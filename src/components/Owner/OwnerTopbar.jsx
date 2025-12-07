import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

export default function OwnerTopbar({ user }) {
  const displayName =
    user?.email?.split("@")[0] || user?.phone || "Tài khoản owner";
  const initials = (displayName || "O").slice(0, 2).toUpperCase();

  return (
    <header className="owner-topbar">
      <div className="owner-topbar-left">
        <button
          type="button"
          aria-label="Mở menu"
          className="owner-menu-btn"
        >
          <FiMenu />
        </button>
      </div>
      <Link to="/owner/account" className="owner-topbar-user">
        <span className="owner-avatar">{initials}</span>
        <span className="owner-username">{displayName}</span>
      </Link>
    </header>
  );
}
