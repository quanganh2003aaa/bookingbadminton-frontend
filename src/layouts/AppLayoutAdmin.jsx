import { Outlet } from "react-router-dom";

export default function AppLayoutAdmin() {
  return (
    <div className="admin-layout">
      <header>Admin nav / breadcrumbs</header>
      <main>
        <Outlet />
      </main>
      <footer>Admin footer</footer>
    </div>
  );
}