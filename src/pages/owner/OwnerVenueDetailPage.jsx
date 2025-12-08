import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ownerVenueDetails } from "../../services/ownerMockData";
import "./owner-venue-detail.css";

const statusClass = (status) =>
  status?.toLowerCase().includes("ngừng") ? "status-stop" : "status-ok";

const formatCurrency = (value) => {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const parseTimeToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

const minutesToTime = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export default function OwnerVenueDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const venue = useMemo(() => {
    const byId = ownerVenueDetails.find((item) => item.id === Number(id));
    return byId || ownerVenueDetails[0];
  }, [id]);

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingPricing, setIsEditingPricing] = useState(false);
  const [form, setForm] = useState({
    name: venue.name,
    address: venue.address,
    contact: venue.contact,
    status: venue.status,
    openTime: venue.openTime,
    closeTime: venue.closeTime,
    mapLink: venue.mapLink || "",
  });

  const initialSlots =
    venue.schedules && venue.schedules.length
      ? venue.schedules.map((slot) => ({
          start: slot.start,
          price: slot.price.replace(/\D/g, ""),
        }))
      : [{ start: venue.openTime, price: "" }];

  const [slots, setSlots] = useState(initialSlots);
  const [backupSlots, setBackupSlots] = useState(initialSlots);
  const [images, setImages] = useState(venue.images || []);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const statusOptions = ["Hoạt động", "Ngừng hoạt động"];

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const getSlotEnd = (index) =>
    index < slots.length - 1 ? slots[index + 1].start : form.closeTime;

  const syncFirstSlotWithOpenTime = () => {
    setSlots((prev) => {
      if (!prev.length) return [{ start: form.openTime, price: "" }];
      const updated = [...prev];
      updated[0] = { ...updated[0], start: form.openTime };
      return updated;
    });
  };

  const ensureSingleSlotForNew = () => {
    if (!slots.length) setSlots([{ start: form.openTime, price: "" }]);
  };

  useEffect(() => {
    syncFirstSlotWithOpenTime();
  }, [form.openTime]);

  useEffect(() => {
    ensureSingleSlotForNew();
  }, [slots.length]);

  const validateInfo = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Tên sân không được để trống";
    if (!form.address.trim()) newErrors.address = "Địa chỉ không được để trống";
    if (!form.contact.trim()) newErrors.contact = "Số liên hệ không được để trống";

    if (!form.openTime || !form.closeTime) {
      newErrors.time = "Giờ hoạt động không được để trống";
    } else {
      const startMinutes = parseTimeToMinutes(form.openTime);
      const endMinutes = parseTimeToMinutes(form.closeTime);
      if (Number.isNaN(startMinutes) || Number.isNaN(endMinutes)) {
        newErrors.time = "Giờ hoạt động không hợp lệ";
      } else if (endMinutes <= startMinutes) {
        newErrors.time = "Giờ kết thúc phải muộn hơn giờ bắt đầu";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePricing = () => {
    const newErrors = {};
    if (!form.openTime || !form.closeTime) {
      newErrors.time = "Giờ hoạt động không được để trống";
    }

    if (!slots.length) {
      newErrors.slots = "Cần ít nhất 1 khung giờ";
    } else {
      const starts = slots.map((s) => parseTimeToMinutes(s.start));
      const openMinutes = parseTimeToMinutes(form.openTime);
      const closeMinutes = parseTimeToMinutes(form.closeTime);

      if (starts[0] !== openMinutes) {
        newErrors.slots = "Khung giờ đầu phải trùng giờ mở cửa";
      }

      for (let i = 0; i < starts.length; i += 1) {
        const slotEndMinutes =
          i === starts.length - 1
            ? closeMinutes
            : parseTimeToMinutes(slots[i + 1].start);

        if (
          Number.isNaN(starts[i]) ||
          Number.isNaN(slotEndMinutes) ||
          starts[i] >= slotEndMinutes
        ) {
          newErrors.slots = "Giờ kết thúc phải muộn hơn giờ bắt đầu";
          break;
        }

        if (slotEndMinutes > closeMinutes) {
          newErrors.slots = "Khung giờ phải nhỏ hơn giờ đóng cửa";
          break;
        }

        if (i > 0 && starts[i] <= starts[i - 1]) {
          newErrors.slots = "Mỗi khung giờ phải muộn hơn khung trước đó";
          break;
        }

        if (!slots[i].price.trim()) {
          newErrors.slots = "Vui lòng nhập giá cho từng khung giờ";
          break;
        }
      }

      const lastEnd = parseTimeToMinutes(getSlotEnd(starts.length - 1));
      if (lastEnd !== closeMinutes) {
        newErrors.slots = "Khung giờ cuối phải trùng giờ đóng cửa";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleToggleEditInfo = () => {
    if (isEditingInfo) {
      if (!validateInfo()) return;
      // TODO: call API to save info
    }
    setIsEditingInfo((prev) => !prev);
  };

  const handleFileClick = () => fileInputRef.current?.click();

  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newPreviews]);
  };

  const handleSlotStartChange = (idx, value) => {
    if (idx === 0) return;
    setSlots((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], start: value };
      return updated;
    });
  };

  const handleSlotPriceChange = (idx, value) => {
    setSlots((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], price: value.replace(/\D/g, "") };
      return updated;
    });
  };

  const handleAddSlot = () => {
    if (!isEditingPricing) return;
    if (!form.openTime || !form.closeTime) return;
    const lastStart = parseTimeToMinutes(slots[slots.length - 1].start);
    const lastEnd = parseTimeToMinutes(form.closeTime);
    if (lastEnd <= lastStart) return;
    const mid = minutesToTime(Math.floor((lastStart + lastEnd) / 2));
    setSlots((prev) => [...prev, { start: mid, price: "" }]);
  };

  const handleDeleteSlot = (idx) => {
    if (!isEditingPricing) return;
    if (idx === 0 && slots.length === 1) return;
    setSlots((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveSlots = () => {
    if (!validatePricing()) return;
    setBackupSlots(slots);
    setIsEditingPricing(false);
  };

  const handleCancelSlots = () => {
    setSlots(backupSlots);
    setIsEditingPricing(false);
    setErrors((prev) => ({ ...prev, slots: undefined }));
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
                readOnly={!isEditingInfo}
              />
              {errors.name && <p className="field-error">{errors.name}</p>}
            </div>
            <div className="field status-field">
              <label>Trạng thái</label>
              {isEditingInfo ? (
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
              readOnly={!isEditingInfo}
            />
            {errors.address && <p className="field-error">{errors.address}</p>}
          </div>
          <div className="field">
            <label>Link map</label>
            <input
              value={form.mapLink}
              onChange={handleChange("mapLink")}
              readOnly={!isEditingInfo}
              placeholder="Dán link iframe hoặc URL Google Map"
            />
          </div>
          <div className="field">
            <label>Số liên hệ</label>
            <input
              value={form.contact}
              onChange={handleChange("contact")}
              readOnly={!isEditingInfo}
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
                disabled={!isEditingInfo}
                className="time-input"
              />
              <span className="time-sep">-</span>
              <input
                type="time"
                value={form.closeTime}
                onChange={handleChange("closeTime")}
                disabled={!isEditingInfo}
                className="time-input"
              />
            </div>
            {errors.time && <p className="field-error">{errors.time}</p>}
          </div>
          <div className="info-actions">
            <button
              type="button"
              className="primary-btn"
              onClick={handleToggleEditInfo}
            >
              {isEditingInfo ? "Lưu" : "Cập nhật thông tin"}
            </button>
          </div>
        </section>

        <section className="detail-card schedule-card">
          <div className="schedule-header">
            <div>Khung giờ bắt đầu</div>
            <div>Khung giờ kết thúc</div>
            <div>Giá</div>
            <div />
          </div>
          <div className="schedule-list">
            {slots.map((slot, idx) => (
              <div className="slot-row" key={`${slot.start}-${idx}`}>
                <div className="slot-time">
                  <input
                    type="time"
                    value={idx === 0 ? form.openTime : slot.start}
                    onChange={(e) => handleSlotStartChange(idx, e.target.value)}
                    disabled={!isEditingPricing || idx === 0}
                  />
                </div>
                <div className="slot-time">
                  <input type="time" value={getSlotEnd(idx)} readOnly />
                </div>
                <div className="price-input">
                  <input
                    value={formatCurrency(slot.price)}
                    onChange={(e) => handleSlotPriceChange(idx, e.target.value)}
                    readOnly={!isEditingPricing}
                    placeholder="Giá"
                    disabled={
                      !isEditingPricing ||
                      !slots[idx].start ||
                      !getSlotEnd(idx) ||
                      getSlotEnd(idx) === "Invalid"
                    }
                  />
                  <span className="price-suffix">VND</span>
                </div>
                <div className="slot-actions">
                  {isEditingPricing && idx > 0 && (
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => handleDeleteSlot(idx)}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="schedule-actions">
            {!isEditingPricing ? (
              <button
                type="button"
                className="add-slot-btn"
                onClick={() => {
                  setBackupSlots(slots);
                  setIsEditingPricing(true);
                  setErrors({});
                }}
              >
                Cập nhật bảng giá
              </button>
            ) : (
              <>
                <div className="slot-confirm">
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={handleAddSlot}
                  >
                    Thêm khung giờ
                  </button>
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={handleSaveSlots}
                  >
                    Lưu
                  </button>
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={handleCancelSlots}
                  >
                    Hủy
                  </button>
                </div>
                {errors.slots && <p className="field-error">{errors.slots}</p>}
              </>
            )}
          </div>
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
