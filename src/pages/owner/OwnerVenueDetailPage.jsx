import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ownerVenueDetails } from "../../services/ownerMockData";
import "./owner-venue-detail.css";

const statusClass = (status) =>
  status?.toLowerCase().includes("ngừng") ? "status-stop" : "status-ok";

export default function OwnerVenueDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const venue = useMemo(() => {
    const byId = ownerVenueDetails.find((item) => item.id === Number(id));
    if (byId) return byId;
    const fallback = ownerVenueDetails[0];
    return fallback;
  }, [id]);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: venue.name,
    address: venue.address,
    contact: venue.contact,
    status: venue.status,
    openTime: venue.openTime,
    closeTime: venue.closeTime,
  });

  const statusOptions = ["Hoạt động", "Ngừng hoạt động"];
  const timeOptions = [
    "06:00 AM",
    "07:00 AM",
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
    "09:00 PM",
    "10:00 PM",
    "11:00 PM",
  ];

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      // TODO: integrate API update when backend is ready
      // console.log("Save venue info", form);
    }
    setIsEditing((prev) => !prev);
  };

  return (
    <div className="owner-venue-detail">
      <div className="detail-header">
        <div>
          <p className="owner-subtitle">Thông tin sân</p>
          <h1 className="owner-venues-title">{venue.name}</h1>
        </div>
        <button
          type="button"
          className="ghost-btn"
          onClick={() => navigate("/owner")}
        >
          Quay lại danh sách
        </button>
      </div>

      <div className="detail-layout">
        <section className="detail-card info-card">
          <div className="info-row">
            <div className="field">
              <label>Tên sân</label>
              <input
                value={form.name}
                onChange={handleChange("name")}
                readOnly={!isEditing}
              />
            </div>
            <div className="field status-field">
              <label>Trạng thái</label>
              {isEditing ? (
                <select
                  value={form.status}
                  onChange={handleChange("status")}
                  className={`status-select ${statusClass(form.status)}`}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <span className={`status-badge ${statusClass(form.status)}`}>
                  {form.status}
                </span>
              )}
            </div>
          </div>
          <div className="field">
            <label>Địa chỉ</label>
            <input
              value={form.address}
              onChange={handleChange("address")}
              readOnly={!isEditing}
            />
          </div>
          <div className="field">
            <label>Số liên hệ</label>
            <input
              value={form.contact}
              onChange={handleChange("contact")}
              readOnly={!isEditing}
            />
          </div>
          <div className="field">
            <label>Giờ hoạt động</label>
            <div className="time-range">
              {isEditing ? (
                <select
                  value={form.openTime}
                  onChange={handleChange("openTime")}
                  className="time-select"
                >
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              ) : (
                <input value={form.openTime} readOnly />
              )}
              <span className="time-sep">-</span>
              {isEditing ? (
                <select
                  value={form.closeTime}
                  onChange={handleChange("closeTime")}
                  className="time-select"
                >
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              ) : (
                <input value={form.closeTime} readOnly />
              )}
            </div>
          </div>
          <div className="info-actions">
            <button
              type="button"
              className="primary-btn"
              onClick={handleToggleEdit}
            >
              {isEditing ? "Lưu" : "Cập nhật thông tin"}
            </button>
          </div>
        </section>

        <section className="detail-card schedule-card">
          <div className="schedule-header">
            <div>Khung giờ</div>
            <div>Ngày</div>
            <div>Giá</div>
          </div>
          <div className="schedule-list">
            {venue.schedules?.map((slot, idx) => (
            <div className="slot-row" key={`${slot.start}-${idx}`}>
              <div className="slot-time">
                <input value={slot.start} readOnly />
                <span className="time-sep">-</span>
                <input value={slot.end} readOnly />
              </div>
              <select value={slot.day} disabled>
                <option>{slot.day}</option>
              </select>
              <input value={slot.price} readOnly />
            </div>
          ))}
        </div>
        <button type="button" className="add-slot-btn" disabled>
          Thêm khung giờ
          </button>
        </section>
      </div>

      <section className="detail-card gallery-card">
        <h3>Hình ảnh</h3>
        <div className="gallery-grid">
          {venue.images?.map((src, idx) => (
            <div className="gallery-item" key={src + idx}>
              <img src={src} alt={`Ảnh sân ${idx + 1}`} />
            </div>
          ))}
          <div className="gallery-item placeholder">
            <span>+</span>
            <small>Thêm</small>
          </div>
        </div>
      </section>
    </div>
  );
}
