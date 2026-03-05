import axios from "axios";

const baseURL = "http://localhost:8080/api";
const apiBaseUrl = new URL(baseURL, "http://localhost");

const getCookieValue = (name) => {
  if (typeof document === "undefined") return "";
  return document.cookie
    .split(";")
    .map((c) => c.trim())
    .filter((c) => c.startsWith(`${name}=`))
    .map((c) => c.substring(name.length + 1))[0] || "";
};

const setCookieValue = (name, value) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${value}; path=/;`;
};

let refreshPromise = null;
let fetchInterceptorInstalled = false;
const FETCH_INTERCEPTOR_KEY = "__bookingAuthFetchInterceptorInstalled__";

const readTokenPayload = (responseData) => responseData?.data || responseData?.result || {};

const requestTokenRefresh = async () => {
  if (refreshPromise) return refreshPromise;

  const refreshToken = getCookieValue("refreshToken");
  if (!refreshToken) {
    throw new Error("Missing refresh token");
  }

  refreshPromise = (async () => {
    const res = await refreshClient.post("/auth/refresh", { refreshToken });
    const payload = readTokenPayload(res?.data);

    if (!payload?.accessToken || !payload?.refreshToken) {
      throw new Error("Invalid refresh token response");
    }

    setCookieValue("accessToken", payload.accessToken);
    setCookieValue("refreshToken", payload.refreshToken);
    api.defaults.headers.common.Authorization = `Bearer ${payload.accessToken}`;

    return payload;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
};

export const api = axios.create({
  baseURL,
  timeout: 5000,
});

const refreshClient = axios.create({ baseURL });

api.interceptors.request.use(
  (config) => {
    const token = getCookieValue("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const isUnauthorized = error?.response?.status === 401;
    if (!isUnauthorized || originalRequest?._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    try {
      const payload = await requestTokenRefresh();
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${payload.accessToken}`;
      return api(originalRequest);
    } catch (refreshErr) {
      return Promise.reject(refreshErr);
    }
  }
);

const parseRequestUrl = (input) => {
  if (typeof window === "undefined") return null;

  try {
    if (typeof input === "string") return new URL(input, window.location.origin);
    if (input instanceof URL) return input;
    if (input?.url) return new URL(input.url, window.location.origin);
  } catch {
    return null;
  }

  return null;
};

const isApiRequestNeedingAuth = (input) => {
  const url = parseRequestUrl(input);
  if (!url) return false;

  const sameOrigin = url.origin === apiBaseUrl.origin;
  const inApiPath = url.pathname.startsWith(apiBaseUrl.pathname);
  const isAuthPath = url.pathname.startsWith(`${apiBaseUrl.pathname}/auth/`);
  return sameOrigin && inApiPath && !isAuthPath;
};

const buildHeaders = (input, init, accessToken) => {
  const headers = new Headers(input instanceof Request ? input.headers : undefined);

  if (init?.headers) {
    const initHeaders = new Headers(init.headers);
    initHeaders.forEach((value, key) => headers.set(key, value));
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return headers;
};

const hasAuthorizationHeader = (input, init) => buildHeaders(input, init).has("Authorization");

const buildFetchInitWithAuth = (input, init, accessToken) => ({
  ...(init || {}),
  headers: buildHeaders(input, init, accessToken),
});

const installFetchAuthInterceptor = () => {
  if (typeof window === "undefined" || fetchInterceptorInstalled) return;
  if (window[FETCH_INTERCEPTOR_KEY]) return;

  fetchInterceptorInstalled = true;
  window[FETCH_INTERCEPTOR_KEY] = true;
  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input, init) => {
    const shouldHandleAuth = isApiRequestNeedingAuth(input) || hasAuthorizationHeader(input, init);
    const accessToken = getCookieValue("accessToken");
    const requestInit = shouldHandleAuth ? buildFetchInitWithAuth(input, init, accessToken) : init;

    const retryInput = input instanceof Request ? input.clone() : input;
    const response = await originalFetch(input, requestInit);

    if (!shouldHandleAuth || response.status !== 401) {
      return response;
    }

    try {
      const payload = await requestTokenRefresh();
      const retryInit = buildFetchInitWithAuth(retryInput, init, payload.accessToken);
      return originalFetch(retryInput, retryInit);
    } catch {
      return response;
    }
  };
};

export const setupApiAuth = () => {
  installFetchAuthInterceptor();
};
