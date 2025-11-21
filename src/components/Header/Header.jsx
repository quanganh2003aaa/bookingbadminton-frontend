import { Link } from "react-router-dom";
import "./header.css";
import SearchBar from "../SearchBar/SearchBar";
import logo from "../../assets/Logo.png";

export default function Header() {
  return (
    <header className="site-header">
      <div className="topbar">
        <div className="container header-inner">
          <div className="logo">
            <img src={logo} alt="Booking Badminton Logo" className="logo-img" />
          </div>

          <div className="header-right">
            <nav className="main-nav">
              <Link to="/" className="nav-link nav-active">
                Trang chủ
              </Link>
              <Link to="/contact" className="nav-link">
                Liên hệ
              </Link>
            </nav>

            <div className="profile">
              <button className="profile-btn">
                Pham Van A <span className="arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <SearchBar />
    </header>
  );
}
