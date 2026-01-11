import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./header.css";
import SearchBar from "../../search/SearchBar";
import logo from "../../../assets/logo.png";

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

const getUserFromCookie = () => {
  try {
    const raw = decodeURIComponent(getCookie("userInfo") || "");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUserFromCookie());
  }, []);

  const displayName = user?.username || user?.email || user?.phone || "";

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
              {displayName ? (
                <button className="profile-btn" type="button" onClick={() => navigate("/info-user")}>
                  {displayName} <span className="arrow">›</span>
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
