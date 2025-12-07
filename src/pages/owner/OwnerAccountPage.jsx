import { ownerProfile } from "../../data/ownerMockData";
import "./owner-account.css";

const displayName =
  ownerProfile.email?.split("@")[0] || ownerProfile.phone || "Tài khoản owner";
const initials = (displayName || "O").slice(0, 2).toUpperCase();

export default function OwnerAccountPage() {
  return (
    <div className="owner-account-page">
      <div className="owner-venues-header">
        <div>
          <p className="owner-subtitle">Hồ sơ chủ sân</p>
          <h1 className="owner-venues-title">Chi tiết tài khoản</h1>
        </div>
        <button type="button" className="primary-btn">
          Cập nhật thông tin
        </button>
      </div>

      <div className="owner-account-card">
        <div className="account-header">
          <div className="account-avatar">{initials}</div>
          <div>
            <h2>{displayName}</h2>
            <p>Chủ hệ thống • {ownerProfile.venuesManaged} sân</p>
          </div>
        </div>

        <div className="account-grid">
          <div className="account-field">
            <span>Điện thoại</span>
            <strong>{ownerProfile.phone}</strong>
          </div>
          <div className="account-field">
            <span>Email</span>
            <strong>{ownerProfile.email}</strong>
          </div>
          <div className="account-field">
            <span>Đánh giá</span>
            <strong>{ownerProfile.rating} ★</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
