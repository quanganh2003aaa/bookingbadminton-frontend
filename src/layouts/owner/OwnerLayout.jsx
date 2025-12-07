import { Outlet, useLocation } from "react-router-dom";
import { FiActivity, FiGrid, FiTrendingUp, FiUser } from "react-icons/fi";
import OwnerSidebar from "../../components/owner/OwnerSidebar";
import OwnerTopbar from "../../components/owner/OwnerTopbar";
import { ownerProfile } from "../../services/ownerMockData";
import "./owner-layout.css";

const navItems = [
  { to: "/owner", label: "Thông tin sân", icon: <FiGrid />, end: true },
  { to: "/owner/status", label: "Tình trạng sân", icon: <FiActivity /> },
  { to: "/owner/revenue", label: "Doanh thu", icon: <FiTrendingUp /> },
  { to: "/owner/account", label: "Tài khoản", icon: <FiUser /> },
];

export default function OwnerLayout() {
  const location = useLocation();

  return (
    <div className="owner-shell">
      <OwnerSidebar items={navItems} />

      <div className="owner-main">
        <OwnerTopbar user={ownerProfile} />
        <div className="owner-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
