import {
  FiInstagram,
  FiTwitter,
  FiFacebook,
  FiYoutube,
  FiSend,
} from "react-icons/fi";
import logo from "../../assets/logo.png";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src={logo} alt="Booking Badminton" />
          </div>
          <div className="footer-desc">
            Được thực hiện bởi Phạm Quang Trường Anh
            <br />
            Đã đăng ký bản quyền
          </div>
          <div className="footer-social">
            <a href="#" aria-label="Instagram">
              <FiInstagram />
            </a>
            <a href="#" aria-label="Twitter">
              <FiTwitter />
            </a>
            <a href="#" aria-label="Facebook">
              <FiFacebook />
            </a>
            <a href="#" aria-label="YouTube">
              <FiYoutube />
            </a>
          </div>
        </div>

        <div className="footer-links">
          <div>
            <div className="footer-title">Website</div>
            <a href="#">Về chúng tôi</a>
            <a href="#">Tin tức</a>
            <a href="#">Liên hệ</a>
          </div>
          <div>
            <div className="footer-title">Hỗ trợ</div>
            <a href="#">Chính sách bảo mật</a>
            <a href="#">Chính sách hoạt động</a>
            <a href="#">Uy tín</a>
            <a href="#">Hướng dẫn</a>
          </div>
        </div>

        <div className="footer-contact">
          <div className="footer-title">Liên hệ với chúng tôi</div>
          <div className="footer-input">
            <input type="email" placeholder="Email của bạn" />
            <button type="button" aria-label="Send email">
              <FiSend />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
