import { ownerVenues } from "../../data/ownerMockData";
import "./owner-venue-info.css";

const statusClass = (status) =>
  status.toLowerCase().includes("ngừng") ? "status-stop" : "status-ok";

export default function OwnerVenueInfoPage() {
  return (
    <div className="owner-venues-page">
      <div className="owner-venues-header">
        <div>
          <p className="owner-subtitle">Quản lý sân</p>
          <h1 className="owner-venues-title">Thông tin sân</h1>
        </div>
        <button type="button" className="ghost-btn">
          + Thêm sân
        </button>
      </div>

      <div className="owner-venues-card owner-venue-list">
        {ownerVenues.map((venue, index) => (
          <div className="venue-item" key={venue.id}>
            <div className="venue-index">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="venue-main">
              <div className="venue-name-row">
                <h3 className="venue-name">{venue.name}</h3>
                <span className={`status-badge ${statusClass(venue.status)}`}>
                  {venue.status}
                </span>
              </div>
              <div className="venue-meta">
                <span className="meta-chip">{venue.address}</span>
                <span className="meta-chip">Số sân: {venue.courts}</span>
                <span className="meta-chip">
                  Điểm trung bình: {venue.averageScore}
                </span>
                <span className="meta-chip">
                  Lượt đánh giá: {venue.ratingCount}
                </span>
              </div>
            </div>
            <div className="venue-right">
              <div className="score-tag">
                {venue.averageScore} ★
                <span className="score-count">({venue.ratingCount})</span>
              </div>
              <button type="button" className="detail-btn">
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
