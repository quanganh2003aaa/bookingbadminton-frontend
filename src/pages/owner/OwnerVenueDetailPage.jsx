import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ownerVenueDetails } from "../../services/ownerMockData";
import { ENDPOINTS } from "../../api/endpoints";
import Notice from "../../components/common/Notice";
import {
  activeToLabel,
  formatCurrency,
  labelToActive,
  minutesToTime,
  normalizeHour,
  normalizeImageSrc,
  parseTimeToMinutes,
  statusClass,
  STATUS_OPTIONS,
} from "./utils/venueDetailUtils";
import "./owner-venue-detail.css";

export default function OwnerVenueDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const fallbackVenue = useMemo(() => {
    const byId = ownerVenueDetails.find((item) => String(item.id) === String(id));
    return byId || ownerVenueDetails[0];
  }, [id]);

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingPricing, setIsEditingPricing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoSaving, setInfoSaving] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [pricingSaving, setPricingSaving] = useState(false);
  const [pricingMessage, setPricingMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [form, setForm] = useState({
    name: fallbackVenue.name,
    address: fallbackVenue.address,
    contact: fallbackVenue.contact,
    status: fallbackVenue.status,
    openTime: fallbackVenue.openTime,
    closeTime: fallbackVenue.closeTime,
    mapLink: fallbackVenue.mapLink || "",
    quantity: fallbackVenue.quantity || fallbackVenue.courts || 0,
  });

  const [slots, setSlots] = useState([]);
  const [backupSlots, setBackupSlots] = useState([]);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const [slotsLoaded, setSlotsLoaded] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const ownerId = localStorage.getItem("ownerId") || "";
    if (!ownerId) {
      setError("Không tìm thấy ownerId. Vui lòng đăng nhập lại.");
      return;
    }
    const fetchDetail = async () => {
      setLoading(true);
      setError("");
      try {
        const url =
          typeof ENDPOINTS.ownerFieldDetailWithOwner === "function"
            ? ENDPOINTS.ownerFieldDetailWithOwner(id, ownerId)
            : `${ENDPOINTS.ownerFields}/${id}?ownerId=${ownerId}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Không thể tải chi tiết sân.");
        const data = await res.json().catch(() => ({}));
        const item = data.result || {};
        setForm({
          name: item.name || "",
          address: item.address || "",
          contact: item.msisdn || item.mobileContact || "",
          status: activeToLabel(item.active || ""),
          openTime: item.startTime || "",
          closeTime: item.endTime || "",
          mapLink: item.linkMap || "",
          quantity: item.quantity ?? 0,
        });
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi tải chi tiết sân.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  useEffect(() => {
    setSlots((prev) => {
      if (!prev.length) return prev;
      const updated = [...prev];
      updated[0] = { ...updated[0], start: form.openTime || updated[0].start };
      return updated;
    });
  }, [form.openTime]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const getSlotEnd = (index) => {
    const current = slots[index];
    if (current?.end) return current.end;
    if (index < slots.length - 1) return slots[index + 1].start;
    return form.closeTime;
  };

  const validateInfo = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Tên sân không được để trống";
    if (!form.address.trim()) newErrors.address = "Địa chỉ không được để trống";
    if (!form.contact.trim()) newErrors.contact = "Số liên hệ không được để trống";
    if (form.quantity === "" || Number(form.quantity) < 0) {
      newErrors.quantity = "Số sân con phải lớn hơn hoặc bằng 0";
    }

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
          newErrors.slots = "Mỗi khung giờ phải muộn hơn khung trước";
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
      const ownerId = localStorage.getItem("ownerId") || "";
      if (!ownerId) {
        setError("Không tìm thấy ownerId. Vui lòng đăng nhập lại.");
        return;
      }
      const saveInfo = async () => {
        setInfoSaving(true);
        setError("");
        setInfoMessage("");
        try {
          const url =
            typeof ENDPOINTS.ownerFieldUpdateWithOwner === "function"
              ? ENDPOINTS.ownerFieldUpdateWithOwner(id, ownerId)
              : `${ENDPOINTS.ownerFields}/${id}?ownerId=${ownerId}`;
          const payload = {
            ownerId,
            name: form.name.trim(),
            address: form.address.trim(),
            ratePoint: 0,
            quantity: Number(form.quantity) || 0,
            mobileContact: form.contact.trim(),
            startTime: form.openTime || null,
            endTime: form.closeTime || null,
            active: labelToActive(form.status),
            linkMap: form.mapLink || "",
          };
          const res = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.message || "Cập nhật thông tin thất bại.");
          }
          setInfoMessage("Cập nhật thông tin thành công.");
          await fetchTimeSlots();
          setIsEditingInfo(false);
        } catch (err) {
          setError(err.message || "Có lỗi xảy ra khi cập nhật thông tin.");
        } finally {
          setInfoSaving(false);
        }
      };
      saveInfo();
      return;
    }
    setInfoMessage("");
    setIsEditingInfo(true);
  };

  const handleAddSlot = () => {
    if (!isEditingPricing) return;
    if (!form.openTime || !form.closeTime) return;
    const lastSlot = slots[slots.length - 1] || {};
    const lastStart = parseTimeToMinutes(lastSlot.start || form.openTime);
    const lastEnd = parseTimeToMinutes(form.closeTime);
    if (Number.isNaN(lastStart) || Number.isNaN(lastEnd) || lastEnd <= lastStart) return;
    const mid = minutesToTime(Math.floor((lastStart + lastEnd) / 2));
    setSlots((prev) => {
      const updated = [...prev];
      if (updated.length) {
        updated[updated.length - 1] = { ...updated[updated.length - 1], end: mid };
      }
      updated.push({ start: mid, end: form.closeTime, price: "" });
      return updated;
    });
  };

  const handleDeleteSlot = (idx) => {
    if (!isEditingPricing) return;
    if (idx === 0 && slots.length === 1) return;
    setSlots((prev) => {
      const nextStart = prev[idx + 1]?.start || form.closeTime;
      const updated = prev.filter((_, i) => i !== idx);
      if (idx - 1 >= 0 && updated[idx - 1]) {
        updated[idx - 1] = { ...updated[idx - 1], end: nextStart };
      }
      return updated;
    });
  };

  const handleSlotStartChange = (idx, value) => {
    if (idx === 0) return;
    setSlots((prev) => {
      const updated = [...prev];
      const safeValue = value || updated[idx].start;
      updated[idx] = { ...updated[idx], start: safeValue };
      if (idx - 1 >= 0) {
        updated[idx - 1] = { ...updated[idx - 1], end: safeValue };
      }
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

  const handleSaveSlots = () => {
    if (!validatePricing()) return;
    const payload = slots.map((slot, idx) => ({
      price: Number(slot.price) || 0,
      startHour: slot.start || form.openTime,
      endHour: getSlotEnd(idx),
    }));
    const target = ENDPOINTS.timeSlotsField
      ? ENDPOINTS.timeSlotsField(id)
      : `${ENDPOINTS.ownerFields}/${id}`;
    const saveSlots = async () => {
      setPricingSaving(true);
      setPricingMessage("");
      try {
        const res = await fetch(target, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Cập nhật bảng giá thất bại.");
        }
        setPricingMessage("Cập nhật bảng giá thành công.");
        setBackupSlots(slots);
        setIsEditingPricing(false);
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi cập nhật bảng giá.");
      } finally {
        setPricingSaving(false);
      }
    };
    saveSlots();
  };

  const handleCancelSlots = () => {
    setSlots(backupSlots);
    setIsEditingPricing(false);
    setErrors((prev) => ({ ...prev, slots: undefined }));
  };

  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const upload = async () => {
      setUploading(true);
      setUploadMessage("");
      try {
        const uploadUrl =
          typeof ENDPOINTS.fieldImageUpload === "function"
            ? ENDPOINTS.fieldImageUpload(id)
            : `${ENDPOINTS.ownerFields}/${id}/images/upload`;
        for (const file of files) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("type", "USING");
          const res = await fetch(uploadUrl, { method: "POST", body: formData });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.message || "Tải ảnh thất bại.");
          }
        }
        await fetchImages();
        setUploadMessage("Đã thêm ảnh thành công.");
      } catch (err) {
        setError(err.message || "Có lỗi khi tải ảnh.");
      } finally {
        setUploading(false);
        e.target.value = "";
      }
    };
    upload();
  };

  const fetchTimeSlots = useCallback(async () => {
    try {
      setSlotsLoaded(false);
      const url = ENDPOINTS.timeSlotsField ? ENDPOINTS.timeSlotsField(id) : "";
      if (!url) return;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json().catch(() => ({}));
      const list = Array.isArray(data.result) ? data.result : [];
      if (!list.length) {
        setSlots([]);
        setBackupSlots([]);
        return;
      }
      const mapped = list.map((item, idx) => ({
        start: normalizeHour(item.startHour),
        end: normalizeHour(item.endHour),
        price: String(item.price ?? "").replace(/\D/g, ""),
        idx,
      }));
      const slotsFromApi = mapped.map((m) => ({
        start: m.start,
        end: m.end,
        price: m.price,
      }));
      setSlots(slotsFromApi);
      setBackupSlots(slotsFromApi);
      setSlotsLoaded(true);
      const lastEnd = mapped[mapped.length - 1]?.end;
      if (lastEnd) {
        setForm((prev) => ({
          ...prev,
          openTime: mapped[0]?.start || prev.openTime,
          closeTime: lastEnd,
        }));
      }
    } catch (err) {
      // swallow errors to avoid blocking main flow
    }
  }, [id]);

  const fetchImages = useCallback(async () => {
    try {
      setImagesLoaded(false);
      const url = ENDPOINTS.fieldImages ? ENDPOINTS.fieldImages(id) : "";
      if (!url) return;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json().catch(() => ({}));
      const list = Array.isArray(data.result) ? data.result : [];
      if (!list.length) {
        setImages([]);
        setImagesLoaded(true);
        return;
      }
      const urls = list
        .map((img) => normalizeImageSrc(img.url || img.link || img.path || img))
        .filter(Boolean);
      setImages(urls);
      setImagesLoaded(true);
    } catch (err) {
      // silent fail; keep existing images
    }
  }, [id]);

  useEffect(() => {
    fetchTimeSlots();
    fetchImages();
  }, [fetchTimeSlots, fetchImages]);

  // No fallback slots when API has no data; keep empty to avoid showing mock.

  return (
    <div className="owner-venue-detail">
      <div className="detail-header">
        <div>
          <p className="owner-subtitle">Thông tin sân</p>
          <h1 className="owner-venues-title">{form.name || fallbackVenue.name}</h1>
        </div>
        <button type="button" className="ghost-btn" onClick={() => navigate("/owner")}>
          Quay lại danh sách
        </button>
      </div>

      <Notice type="error" message={error} />
      {loading && <Notice type="info" message="Đang tải chi tiết..." />}

      <div className="detail-layout">
        <section className="detail-card info-card">
          <div className="info-row">
            <div className="field">
              <label>Tên sân</label>
              <input value={form.name} onChange={handleChange("name")} readOnly={!isEditingInfo} />
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
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <span className={`status-badge ${statusClass(form.status)}`}>{form.status}</span>
              )}
            </div>
          </div>
          <div className="field">
            <label>Địa chỉ</label>
            <input value={form.address} onChange={handleChange("address")} readOnly={!isEditingInfo} />
            {errors.address && <p className="field-error">{errors.address}</p>}
          </div>
          <div className="field">
            <label>Số sân con</label>
            <input
              type="number"
              min="0"
              value={form.quantity}
              onChange={handleChange("quantity")}
              readOnly={!isEditingInfo}
            />
            {errors.quantity && <p className="field-error">{errors.quantity}</p>}
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
            <input value={form.contact} onChange={handleChange("contact")} readOnly={!isEditingInfo} />
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
            <button type="button" className="primary-btn" onClick={handleToggleEditInfo} disabled={infoSaving}>
              {isEditingInfo ? (infoSaving ? "Đang lưu..." : "Lưu") : "Cập nhật thông tin"}
            </button>
          </div>
          <Notice type="success" message={infoMessage} />
        </section>

        <section className="detail-card schedule-card">
          <div className="schedule-header">
            <div>Khung giờ bắt đầu</div>
            <div>Khung giờ kết thúc</div>
            <div>Giá</div>
            <div />
          </div>
          <div className="schedule-list">
            {slots.length === 0 ? (
              <div className="slot-row empty-row">Chưa có ca sân</div>
            ) : (
              slots.map((slot, idx) => (
                <div className="slot-row" key={`${slot.start}-${idx}`}>
                  <div className="slot-time">
                    <input
                      type="time"
                      value={slot.start || form.openTime}
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
                    />
                    <span className="price-suffix">VND</span>
                  </div>
                  <div className="slot-actions">
                    {isEditingPricing && idx > 0 && (
                      <button type="button" className="icon-btn" onClick={() => handleDeleteSlot(idx)}>
                        -
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="schedule-actions">
            {!isEditingPricing ? (
              <button
                type="button"
                className="add-slot-btn"
                onClick={() => {
                  setBackupSlots(slots);
                  setIsEditingPricing(true);
                  setErrors((prev) => ({ ...prev, slots: undefined }));
                }}
              >
                Cập nhật bảng giá
              </button>
            ) : (
              <>
                <div className="slot-confirm">
                  <button type="button" className="ghost-btn" onClick={handleAddSlot}>
                    Thêm khung giờ
                  </button>
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={handleSaveSlots}
                    disabled={pricingSaving}
                  >
                    {pricingSaving ? "Đang lưu..." : "Lưu"}
                  </button>
                  <button type="button" className="ghost-btn" onClick={handleCancelSlots}>
                    Hủy
                  </button>
                </div>
                {errors.slots && <p className="field-error">{errors.slots}</p>}
              </>
            )}
          </div>
          <Notice type="success" message={pricingMessage} />
        </section>
      </div>

      {form.mapLink && (
        <section className="detail-card map-card">
          <h3>Bản đồ</h3>
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
          <button type="button" className="icon-upload-btn" onClick={() => fileInputRef.current?.click()}>
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
        <Notice
          type={uploading ? "info" : "success"}
          message={uploading ? "Đang tải ảnh..." : uploadMessage}
        />
        <div className="gallery-strip">
          {imagesLoaded && images.length === 0 && (
            <div className="gallery-item placeholder">Chưa có ảnh được trả về</div>
          )}
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
