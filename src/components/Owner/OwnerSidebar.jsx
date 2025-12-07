import { NavLink } from "react-router-dom";

export default function OwnerSidebar({ items, brand = "Badminton." }) {
  return (
    <aside className="owner-sidebar">
      <div className="owner-brand">{brand}</div>
      <nav className="owner-nav">
        {items.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `owner-nav-link${isActive ? " active" : ""}`
            }
          >
            <span className="owner-nav-icon">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
