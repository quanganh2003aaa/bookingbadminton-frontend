import { Outlet } from "react-router-dom";
import Header from "../../components/common/Header/Header";
import Footer from "../../components/common/Footer";

export default function AppLayout() {
  return (
    <div className="app-container">
      <Header />
      <main style={{ padding: "10px" }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
