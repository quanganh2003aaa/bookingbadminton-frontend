import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer";

export default function AppLayout() {
  return (
    <div className="app-container">
      <Header />
      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
