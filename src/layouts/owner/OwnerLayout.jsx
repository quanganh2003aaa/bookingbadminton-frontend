import { Outlet } from "react-router-dom";
import { FiActivity, FiGrid, FiTrendingUp, FiUser } from "react-icons/fi";
import OwnerSidebar from "../../components/owner/OwnerSidebar";
import OwnerTopbar from "../../components/owner/OwnerTopbar";
import { ownerProfile, adminProfile } from "../../services/ownerMockData";
import { ENDPOINTS } from "../../api/endpoints";
import "./owner-layout.css";

const defaultNavItems = [
  { to: "/owner", label: "Thông tin sân", icon: <FiGrid />, end: true },
  { to: "/owner/status", label: "Tình trạng sân", icon: <FiActivity /> },
  { to: "/owner/revenue", label: "Doanh thu", icon: <FiTrendingUp /> },
  { to: "/owner/account", label: "Tài khoản", icon: <FiUser /> },
];

export default function OwnerLayout({ navItems, isAdmin }) {
  const items = navItems || defaultNavItems;
  const isAdminLayout = items.some((item) => String(item.to || "").startsWith("/admin"));

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

  const handleLogout = async () => {
    if (!isAdminLayout) return;
    try {
      const refreshToken = getCookie("refreshToken");
      await fetch(ENDPOINTS.logout, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      }).catch(() => {});
    } finally {
      clearCookie("accessToken");
      clearCookie("refreshToken");
      clearCookie("userInfo");
      localStorage.removeItem("userProfile");
      window.location.assign("/login");
    }
  };

  return (
    <div className="owner-shell">
      <OwnerSidebar items={items} />

      <div className="owner-main">
        <OwnerTopbar user={isAdmin ? adminProfile : ownerProfile} onLogout={isAdminLayout ? handleLogout : undefined} />
        <div className="owner-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
