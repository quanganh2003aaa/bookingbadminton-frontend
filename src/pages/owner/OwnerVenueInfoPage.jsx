import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../../api/endpoints";
import "./owner-venue-info.css";

const statusClass = (status = "") => {
  const lower = status.toLowerCase();
  return lower.includes("ngung") || lower.includes("ngừng")
    ? "status-stop"
    : "status-ok";
};

export default function OwnerVenueInfoPage() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const ownerId = localStorage.getItem("ownerId") || "";
    if (!ownerId) {
      setError("Không tìm thấy ownerId. Vui lòng đăng nhập lại.");
      setVenues([]);
      return;
    }
    const fetchVenues = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        params.append("ownerId", ownerId);
        params.append("page", "0");
        params.append("size", "10");
        const url = `${ENDPOINTS.ownerFields}?${params.toString()}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Không thể tải danh sách sân.");
        const data = await res.json().catch(() => ({}));
        const payload = data.result || {};
        const list = Array.isArray(payload.content)
          ? payload.content
          : Array.isArray(payload)
          ? payload
          : [];
        setVenues(
          list.map((item, idx) => ({
            id: item.id || `venue-${idx}`,
            name: item.name || "Chưa cập nhật",
            address: item.address || "",
            courts: item.quantity ?? 0,
            status: "Hoạt động",
          }))
        );
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra.");
        setVenues([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  return (
    <div className="owner-venues-page">
      <div className="owner-venues-header">
        <div>
          <p className="owner-subtitle">Quản lý sân</p>
          <h1 className="owner-venues-title">Thông tin sân</h1>
        </div>
        <button
          type="button"
          className="ghost-btn"
          onClick={() => navigate("/manager-register?step=2&auto=1")}
        >
          + Thêm sân
        </button>
      </div>

      <div className="owner-venues-card owner-venue-list">
        {error && <p className="form-error">{error}</p>}
        {loading && <div className="venue-item loading">Đang tải...</div>}
        {!loading && venues.length === 0 && !error && (
          <div className="venue-item empty">Không tìm thấy sân</div>
        )}
        {!loading && venues.map((venue, index) => (
          <div
            className="venue-item"
            key={venue.id}
            onClick={() => navigate(`/owner/venue/${venue.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate(`/owner/venue/${venue.id}`);
              }
            }}
          >
            <div className="venue-index">{String(index + 1).padStart(2, "0")}</div>
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
              </div>
            </div>
            <div className="venue-right">
              <div className="score-tag">
                {(venue.averageScore ?? 0).toFixed
                  ? (venue.averageScore ?? 0).toFixed(1)
                  : venue.averageScore ?? 0}{" "}
                ★<span className="score-count">({venue.ratingCount ?? 0})</span>
              </div>
              <button
                type="button"
                className="detail-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/owner/venue/${venue.id}`);
                }}
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
