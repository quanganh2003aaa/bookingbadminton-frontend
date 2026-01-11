import { useEffect, useMemo, useState } from "react";
import "./owner-account.css";
import { ENDPOINTS } from "../../api/endpoints";

const getCookie = (name) => {
  if (typeof document === "undefined") return "";
  return (
    document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${name}=`))
      ?.split("=")[1] || ""
  );
};

const clearCookie = (name) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

const getUserInfo = () => {
  try {
    const raw = decodeURIComponent(getCookie("userInfo") || "");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export default function OwnerAccountPage() {
  const userInfo = useMemo(getUserInfo, []);
  const [profile, setProfile] = useState({
    nameOwner: userInfo.username || "",
    msisdn: userInfo.phone || "",
    email: userInfo.email || "",
    avatar: "",
  });

  const getAccessToken = () => getCookie("accessToken");

  useEffect(() => {
    const ownerId = userInfo.userId || "";
    if (!ownerId) return;
    (async () => {
      try {
        const token = getAccessToken();
        const res = await fetch(ENDPOINTS.ownerDetailInfo, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ ownerId }),
        });
        if (!res.ok) return;
        const data = await res.json().catch(() => ({}));
        const result = data?.result || {};
        setProfile((prev) => ({
          ...prev,
          nameOwner: result.nameOwner || prev.nameOwner,
          msisdn: result.msisdn || prev.msisdn,
          email: result.email || prev.email,
          avatar: result.avatar || prev.avatar,
        }));
      } catch {
        // ignore
      }
    })();
  }, [userInfo.userId]);

  const displayName = profile.nameOwner || profile.email || profile.msisdn || "Tài khoản";
  const initials = (displayName || "O").slice(0, 2).toUpperCase();

  const handleLogout = () => {
    clearCookie("accessToken");
    clearCookie("refreshToken");
    clearCookie("userInfo");
    localStorage.removeItem("userProfile");
    window.location.assign("/login");
  };

  return (
    <div className="owner-account-page">
      <div className="owner-venues-header">
        <div>
          <p className="owner-subtitle">Hồ sơ chủ sân</p>
          <h1 className="owner-venues-title">Chi tiết tài khoản</h1>
        </div>
        <button type="button" className="danger-btn" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>

      <div className="owner-account-card">
        <div className="account-header">
          {profile.avatar ? (
            <img className="account-avatar img" src={profile.avatar} alt={displayName} />
          ) : (
            <div className="account-avatar">{initials}</div>
          )}
          <div>
            <h2>{displayName}</h2>
            <p>ID: {userInfo.userId || "—"}</p>
          </div>
        </div>

        <div className="account-grid">
          <div className="account-field">
            <span>Số điện thoại</span>
            <strong>{profile.msisdn || "Chưa cập nhật"}</strong>
          </div>
          <div className="account-field">
            <span>Email</span>
            <strong>{profile.email || "Chưa cập nhật"}</strong>
          </div>
          <div className="account-field">
            <span>Vai trò</span>
            <strong>{userInfo.role || "OWNER"}</strong>
          </div>
        </div>

        <div className="account-actions" />
      </div>
    </div>
  );
}
