import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TimeGrid, { Legend } from "../../components/owner/TimeGrid";
import "../../components/owner/time-grid.css";
import "./owner-status-detail.css";
import { ENDPOINTS } from "../../api/endpoints";

const toMinutes = (str = "") => {
  const [h, m] = str.split(":").map(Number);
  return h * 60 + m;
};

const toTime = (value = "") => {
  if (!value) return "";
  if (value.includes("T")) {
    const [, timePart = ""] = value.split("T");
    const [h = "00", m = "00"] = timePart.split(":");
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
  }
  const parts = String(value).split(":");
  return `${parts[0]?.padStart(2, "0") || "00"}:${parts[1]?.padStart(2, "0") || "00"}`;
};

const mockData = {
  date: new Date().toISOString().slice(0, 10),
  courts: [],
  tickets: [],
};

export default function OwnerCourtStatusDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filterDate, setFilterDate] = useState(mockData.date);
  const [filterCourt, setFilterCourt] = useState("all");
  const [filterStart, setFilterStart] = useState("07:00");
  const [filterEnd, setFilterEnd] = useState("19:00");
  const [filteredCourts, setFilteredCourts] = useState(mockData.courts);
  const [bookings, setBookings] = useState([]);
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [fieldName, setFieldName] = useState(`#${id}`);

  const applyFilters = () => {
    // placeholder for future BE-powered filters on grid if needed
  };

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setBookingLoading(true);
      setBookingError("");
      try {
        const params = new URLSearchParams();
        params.append("date", filterDate);
        const res = await fetch(`${ENDPOINTS.ownerFieldBookingDetail(id)}?${params.toString()}`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Không thể tải danh sách đơn đặt sân.");
        const payload = await res.json().catch(() => ({}));
        const result = payload?.result || {};
        setFieldName(result.fieldName || `#${id}`);
        const subFields = Array.isArray(result.subFields) ? result.subFields : [];
        const courts = subFields.map((sf, idx) => {
          const bookingsSf = Array.isArray(sf.bookings)
            ? sf.bookings.map((b, bi) => ({
                id: b.bookingId || b.id || `booking-${bi}`,
                subField: sf.indexField || idx + 1,
                start: toTime(b.startHour || b.start || ""),
                end: toTime(b.endHour || b.end || ""),
                phone: b.msisdn || b.phone || "",
                status: "booked",
              }))
            : [];
          return {
            id: sf.id || `sub-${idx}`,
            name: `Sân ${sf.indexField || idx + 1}`,
            bookings: bookingsSf,
          };
        });
        setFilteredCourts(courts);
        setBookings(
          courts.flatMap((c) =>
            (c.bookings || []).map((b) => ({
              ...b,
              subField: c.name,
            }))
          )
        );
        if (result.startTime) setFilterStart(toTime(result.startTime));
        if (result.endTime) setFilterEnd(toTime(result.endTime));
      } catch (err) {
        if (err.name === "AbortError") return;
        setBookingError(err.message || "Có lỗi xảy ra.");
        setBookings([]);
        setFilteredCourts([]);
      } finally {
        if (!controller.signal.aborted) setBookingLoading(false);
      }
    })();
    return () => controller.abort();
  }, [id, filterDate]);

  const statusLabels = {
    ACCEPT: "Đã duyệt",
    PENDING: "Chờ duyệt",
    INACCEPT: "Từ chối",
  };

  return (
    <div className="owner-status-detail">
      <div className="detail-header">
        <div>
          <p className="owner-subtitle">Tình trạng sân</p>
          <h1 className="owner-venues-title">Chi tiết sân {fieldName}</h1>
        </div>
        <button type="button" className="ghost-btn" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </div>

      <div className="status-card">
        <Legend />
        <TimeGrid courts={filteredCourts} start={filterStart} end={filterEnd} step={30} />
      </div>

      <div className="bookings-list-card">
        <div className="bookings-header">
          <h3>Đơn đặt sân</h3>
          <div className="bookings-filters">
            <label>
              Ngày:
              <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
            </label>
          </div>
        </div>
        {bookingError && <div className="form-error">{bookingError}</div>}
        {bookingLoading && <div className="booking-row empty">Đang tải...</div>}
        {!bookingLoading && bookings.length === 0 && !bookingError && <div className="booking-row empty">Chưa có đơn đặt sân</div>}
        {!bookingLoading && bookings.length > 0 && (
          <div className="booking-table">
            <div className="booking-row booking-head">
              <span>Sân con</span>
              <span>Thời gian</span>
              <span>SĐT</span>
              <span>Trạng thái</span>
            </div>
            {bookings.map((b) => (
              <div key={b.id} className="booking-row">
                <span className="cell-strong">{b.subField || "—"}</span>
                <span>
                  {b.start} - {b.end}
                </span>
                <span>{b.phone || "—"}</span>
                <span>
                  <span className="status-chip">{statusLabels[b.status] || b.status}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
