import axios from "axios";

const baseURL = "http://localhost:8080/api";

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
    const refreshToken = getCookieValue("refreshToken");
    if (!refreshToken) return Promise.reject(error);

    try {
      const res = await refreshClient.post("/auth/refresh", { refreshToken });
      const data = res?.data?.data || res?.data?.result;
      if (!data?.accessToken || !data?.refreshToken) {
        return Promise.reject(error);
      }

      setCookieValue("accessToken", data.accessToken);
      setCookieValue("refreshToken", data.refreshToken);
      api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    } catch (refreshErr) {
      return Promise.reject(refreshErr);
    }
  }
);
