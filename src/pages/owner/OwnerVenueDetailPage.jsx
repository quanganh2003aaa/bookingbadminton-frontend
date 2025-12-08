import { useMemo, useRef, useState } from "react";
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
    mapLink: venue.mapLink || "",
  });
  const [images, setImages] = useState(venue.images || []);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const statusOptions = ["Hoạt động", "Ngừng hoạt động"];

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Tên sân không được để trống";
    if (!form.address.trim()) newErrors.address = "Địa chỉ không được để trống";
    if (!form.contact.trim()) newErrors.contact = "Số liên hệ không được để trống";

    if (!form.openTime || !form.closeTime) {
      newErrors.time = "Giờ hoạt động không được để trống";
    } else {
      const [startH, startM] = form.openTime.split(":").map(Number);
      const [endH, endM] = form.closeTime.split(":").map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;
      if (Number.isNaN(startMinutes) || Number.isNaN(endMinutes)) {
        newErrors.time = "Giờ hoạt động không hợp lệ";
      } else if (endMinutes <= startMinutes) {
        newErrors.time = "Giờ kết thúc phải muộn hơn giờ bắt đầu";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      if (!validate()) return;
      // TODO: integrate API update when backend is ready
    }
    setIsEditing((prev) => !prev);
  };

  const handleFileClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newPreviews]);
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
            {errors.name && <p className="field-error">{errors.name}</p>}
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
            {errors.address && <p className="field-error">{errors.address}</p>}
          </div>
          <div className="field">
            <label>Link map</label>
            <input
              value={form.mapLink}
              onChange={handleChange("mapLink")}
              readOnly={!isEditing}
              placeholder="Dán link iframe hoặc URL Google Map"
            />
          </div>
          <div className="field">
            <label>Số liên hệ</label>
            <input
              value={form.contact}
              onChange={handleChange("contact")}
              readOnly={!isEditing}
            />
            {errors.contact && <p className="field-error">{errors.contact}</p>}
          </div>
          <div className="field">
            <label>Giờ hoạt động</label>
            <div className="time-range">
              <input
                type="time"
                value={form.openTime}
                onChange={handleChange("openTime")}
                disabled={!isEditing}
                className="time-input"
              />
              <span className="time-sep">-</span>
              <input
                type="time"
                value={form.closeTime}
                onChange={handleChange("closeTime")}
                disabled={!isEditing}
                className="time-input"
              />
            </div>
            {errors.time && <p className="field-error">{errors.time}</p>}
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

      {form.mapLink && (
        <section className="detail-card map-card">
          <h3>Vị trí bản đồ</h3>
          <div className="map-frame">
            <iframe
              src={form.mapLink}
              title="Bản đồ sân"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      )}

      <section className="detail-card gallery-card">
        <div className="gallery-header">
          <h3>Hình ảnh</h3>
          <button
            type="button"
            className="icon-upload-btn"
            onClick={handleFileClick}
          >
            +
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handleFilesSelected}
          />
        </div>
        <div className="gallery-strip">
          {images?.map((src, idx) => (
            <div className="gallery-item" key={src + idx}>
              <img src={src} alt={`Ảnh sân ${idx + 1}`} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
