import { API_BASE } from "../../../api/endpoints";

const API_HOST = (import.meta.env?.VITE_API_BASE || API_BASE || "")
  .replace(/\/api$/, "")
  .replace(/\/$/, "");

const CLIENT_ORIGIN =
  typeof window !== "undefined" && window.location?.origin
    ? window.location.origin
    : "";

const resolveBase = (customBase) => customBase || CLIENT_ORIGIN || API_HOST || "";

export const withBase = (path = "", base) => {
  const root = resolveBase(base);
  if (!root) return path.startsWith("/") ? path : `/${path}`;
  return `${root}${path.startsWith("/") ? path : `/${path}`}`;
};

export const normalizeImageSrc = (value = "", base) => {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;

  const normalized = value.replace(/\\\\/g, "/").replace(/\\/g, "/");
  const lower = normalized.toLowerCase();
  const build = (p) => encodeURI(withBase(p.startsWith("/") ? p : `/${p}`, base));

  const uploadFieldsIdx = lower.lastIndexOf("/upload/fields/");
  if (uploadFieldsIdx !== -1) return build(normalized.slice(uploadFieldsIdx));

  const uploadFromSrcIdx = lower.indexOf("/src/assets/image/upload/");
  if (uploadFromSrcIdx !== -1) return build(normalized.slice(uploadFromSrcIdx));

  const uploadIdx = lower.indexOf("/upload/");
  if (uploadIdx !== -1) return build(normalized.slice(uploadIdx));

  const publicIdx = lower.indexOf("/public/");
  if (publicIdx !== -1) {
    const rel = normalized.slice(publicIdx + "/public".length);
    return build(rel.startsWith("/") ? rel : `/${rel}`);
  }

  const srcIdx = lower.indexOf("/src/");
  if (srcIdx !== -1) {
    const rel = normalized.slice(srcIdx);
    return build(rel.startsWith("/") ? rel : `/${rel}`);
  }

  return build(normalized.startsWith("/") ? normalized : `/${normalized}`);
};

export const statusClass = (status = "") => {
  const lower = status.toLowerCase();
  return lower.includes("ngừng") || lower.includes("ngung") ? "status-stop" : "status-ok";
};

export const activeToLabel = (active = "") => {
  const upper = active.toUpperCase();
  if (upper === "ACTIVE") return "Hoạt động";
  if (upper === "INACTIVE") return "Ngừng hoạt động";
  return active || "Chưa rõ";
};

export const labelToActive = (label = "") => {
  const upper = label.toUpperCase();
  if (upper.includes("NGỪNG") || upper.includes("NGUNG")) return "INACTIVE";
  return "ACTIVE";
};

export const parseTimeToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

export const minutesToTime = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export const formatCurrency = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const normalizeHour = (value = "") => {
  if (!value) return "";
  const parts = value.split(":");
  if (parts.length >= 2) return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
  return value;
};

export const STATUS_OPTIONS = ["Hoạt động", "Ngừng hoạt động"];
