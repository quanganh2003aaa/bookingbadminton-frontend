import { NavLink, Outlet } from "react-router-dom";
import "./admin-layout.css";

const adminLinks = [
  { to: "/admin", label: "Quản lý người dùng", exact: true },
  { to: "/admin/owners", label: "Quản lý chủ sân" },
  { to: "/admin/registrations", label: "Quản lý đăng ký" },
  { to: "/admin/reports", label: "Báo cáo" },
];

export default function AppLayoutAdmin() {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">Badminton.</div>
        <nav className="admin-nav">
          {adminLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) =>
                `admin-nav-link${isActive ? " active" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <span>Quản trị hệ thống</span>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
