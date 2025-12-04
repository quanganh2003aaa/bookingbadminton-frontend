import { Link, useNavigate } from "react-router-dom";
import "./header.css";
import SearchBar from "../SearchBar/SearchBar";
import logo from "../../assets/Logo.png";

export default function Header() {
  const navigate = useNavigate();
  // TODO: lấy thông tin user từ state/auth thực tế
  const user = { name: "Pham Van A" };

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
              {user ? (
                <button
                  className="profile-btn"
                  type="button"
                  onClick={() => navigate("/info-user")}
                >
                  {user.name} <span className="arrow">→</span>
                </button>
              ) : (
                <Link to="/login" className="profile-login">
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <SearchBar />
    </header>
  );
}
