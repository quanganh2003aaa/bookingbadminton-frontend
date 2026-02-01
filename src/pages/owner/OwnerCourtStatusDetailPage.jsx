import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import TimeGrid, { Legend } from "../../components/owner/TimeGrid";
import "../../components/owner/time-grid.css";
import "./owner-status-detail.css";
import { ENDPOINTS } from "../../api/endpoints";

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

const getOwnerId = () => {
  try {
    const raw =
      (document.cookie
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith("userInfo=")) || ""
      ).split("=")[1] || "";
    if (!raw) return "";
    const parsed = JSON.parse(decodeURIComponent(raw));
    return parsed.ownerId || parsed.userId || "";
  } catch {
    return "";
  }
};

const getAccessToken = () => {
  if (typeof document === "undefined") return "";
  return (
    document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("accessToken="))
      ?.split("=")[1] || ""
  );
};

export default function OwnerCourtStatusDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filterDate, setFilterDate] = useState(mockData.date);
  const [filterStart, setFilterStart] = useState("07:00");
  const [filterEnd, setFilterEnd] = useState("19:00");
  const [filteredCourts, setFilteredCourts] = useState(mockData.courts);
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [fieldName, setFieldName] = useState(`#${id}`);

  const [bookingList, setBookingList] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState("");

  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setBookingLoading(true);
      setBookingError("");
      try {
        const params = new URLSearchParams();
        params.append("date", filterDate);
        const token = getAccessToken();
        const res = await fetch(`${ENDPOINTS.ownerFieldBookingDetail(id)}?${params.toString()}`, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error("Không thể tải danh sách lịch sân.");
        const payload = await res.json().catch(() => ({}));
        const result = payload?.result || {};
        setFieldName(result.fieldName || `#${id}`);
        const apiStart = result.startTime ? toTime(result.startTime) : "05:00";
        const apiEnd = result.endTime ? toTime(result.endTime) : "23:00";
        setFilterStart(apiStart);
        setFilterEnd(apiEnd);

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
      } catch (err) {
        if (err.name === "AbortError") return;
        setBookingError(err.message || "Có lỗi xảy ra.");
        setFilteredCourts([]);
      } finally {
        if (!controller.signal.aborted) setBookingLoading(false);
      }
    })();
    return () => controller.abort();
  }, [id, filterDate]);

  const loadList = useCallback(async () => {
    const controller = new AbortController();
    try {
      setListLoading(true);
      setListError("");
      const params = new URLSearchParams();
      params.append("date", filterDate);
      const token = getAccessToken();
      const res = await fetch(`${ENDPOINTS.ownerFieldBookingList(id)}?${params.toString()}`, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error("Không thể tải danh sách đơn đặt sân.");
      const data = await res.json().catch(() => ({}));
      const result = data?.result || [];
      setBookingList(
        Array.isArray(result)
          ? result.map((item, idx) => ({
              bookingId: item.bookingId || `booking-${idx}`,
              user: item.user || "Chưa rõ",
              msisdn: item.msisdn || "",
              status: item.status || "",
              invoiceStatus: item.invoiceStatus || "",
              createdAt: item.createdAt || "",
            }))
          : []
      );
    } catch (err) {
      if (err.name === "AbortError") return;
      setListError(err.message || "Có lỗi xảy ra.");
      setBookingList([]);
    } finally {
      setListLoading(false);
    }
    return () => controller.abort();
  }, [filterDate, id]);

  useEffect(() => {
    const cleanup = loadList();
    return typeof cleanup === "function" ? cleanup : undefined;
  }, [loadList]);

  const fetchDetail = async (bookingId) => {
    setDetail({ bookingId });
    setDetailLoading(true);
    try {
      const res = await fetch(ENDPOINTS.bookingPayDetail(bookingId), {
        headers: { Accept: "application/json" },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Không thể tải chi tiết đơn.");
      setDetail(data?.result || null);
    } catch (err) {
      setDetail({ error: err.message || "Có lỗi xảy ra." });
    } finally {
      setDetailLoading(false);
    }
  };

  const statusLabels = {
    ACCEPT: "Đã duyệt",
    ACCPEPT: "Đã duyệt",
    COMFIRM: "Chờ chấp thuận",
    PENDING: "Chờ duyệt",
    INACCEPT: "Từ chối",
  };

  const invoiceLabels = {
    PAY: "Đã thanh toán",
    PENDING: "Chưa thanh toán",
  };

  const handleAction = async (type) => {
    if (!detail?.bookingId) return;
    const ownerId = getOwnerId();
    if (!ownerId) {
      message.error("Không tìm thấy ownerId. Vui lòng đăng nhập lại.");
      return;
    }
    const subFieldId = detail.bookingFields?.[0]?.subFieldId;
    if (!subFieldId) {
      message.error("Không tìm thấy sân con của đơn đặt.");
      return;
    }
    const token = getAccessToken();
    setActionLoading(true);
    try {
      const url =
        type === "approve"
          ? ENDPOINTS.ownerApproveBooking(detail.bookingId)
          : ENDPOINTS.ownerRejectBooking(detail.bookingId);
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ownerId, subFieldId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Thao tác thất bại.");
      message.success(type === "approve" ? "Đã chấp thuận đơn." : "Đã từ chối đơn.");
      await fetchDetail(detail.bookingId);
      await loadList();
    } catch (err) {
      message.error(err.message || "Thao tác thất bại.");
    } finally {
      setActionLoading(false);
    }
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
        {bookingError && <div className="form-error">{bookingError}</div>}
        {bookingLoading && <div className="booking-row empty">Đang tải lịch...</div>}
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
        {listError && <div className="form-error">{listError}</div>}
        {(bookingLoading || listLoading) && <div className="booking-row empty">Đang tải...</div>}
        {!bookingLoading && !listLoading && bookingList.length === 0 && !listError && (
          <div className="booking-row empty">Chưa có đơn đặt sân</div>
        )}
        {!bookingLoading && !listLoading && bookingList.length > 0 && (
          <div className="booking-table">
            <div className="booking-row booking-head">
              <span>Người đặt</span>
              <span>SĐT</span>
              <span>Trạng thái</span>
              <span>Thanh toán</span>
              <span>Thao tác</span>
            </div>
            {bookingList.map((b) => (
              <div key={b.bookingId} className="booking-row">
                <span className="cell-strong">{b.user}</span>
                <span>{b.msisdn || "—"}</span>
                <span>
                  <span className={`status-chip status-${(b.status || "").toLowerCase()}`}>
                    {statusLabels[(b.status || "").toUpperCase()] || b.status}
                  </span>
                </span>
                <span>
                  <span className="status-chip subtle">{invoiceLabels[b.invoiceStatus] || b.invoiceStatus || "—"}</span>
                </span>
                <span>
                  <button type="button" className="link-btn" onClick={() => fetchDetail(b.bookingId)}>
                    Xem chi tiết
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {detail && (
        <div className="detail-modal">
          <div className="detail-modal-body">
            <div className="detail-modal-header">
              <h3>Chi tiết đơn</h3>
              <button type="button" className="ghost-btn" onClick={() => setDetail(null)}>
                Đóng
              </button>
            </div>
            {detailLoading && <div className="booking-row empty">Đang tải chi tiết...</div>}
            {!detailLoading && detail.error && <div className="form-error">{detail.error}</div>}
            {!detailLoading && !detail.error && (
              <>
                <div className="detail-info-grid">
                  <div>
                    <div className="label">Mã đơn</div>
                    <div className="value">{detail.bookingId}</div>
                  </div>
                  <div>
                    <div className="label">Người đặt</div>
                    <div className="value">{detail.user}</div>
                  </div>
                  <div>
                    <div className="label">SĐT</div>
                    <div className="value">{detail.msisdn || "—"}</div>
                  </div>
                  <div>
                    <div className="label">Trạng thái</div>
                    <div className="value">
                      {statusLabels[(detail.status || "").toUpperCase()] || detail.status}
                    </div>
                  </div>
                  <div>
                    <div className="label">Thanh toán</div>
                    <div className="value">{invoiceLabels[detail.invoiceStatus] || detail.invoiceStatus || "—"}</div>
                  </div>
                  <div>
                    <div className="label">Tổng tiền</div>
                    <div className="value">{Number(detail.price || 0).toLocaleString("vi-VN")} VND</div>
                  </div>
                </div>
                <div className="detail-bookings">
                  <div className="booking-row booking-head detail-mini">
                    <span>Sân con</span>
                    <span>Khung giờ</span>
                  </div>
                  {(detail.bookingFields || []).map((item, idx) => {
                    const start = toTime(item.startHour || "");
                    const end = toTime(item.endHour || "");
                    return (
                      <div key={`${item.subFieldId || idx}-${start}`} className="booking-row detail-mini">
                        <span className="cell-strong">Sân {item.indexField || idx + 1}</span>
                        <span>
                          {start} - {end}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {detail.imgPayment && (
                  <div className="detail-image">
                    <div className="label">Ảnh thanh toán</div>
                    <div className="payment-frame">
                      <img src={detail.imgPayment} alt="Ảnh thanh toán" />
                    </div>
                  </div>
                )}
                {(detail.status || "").toUpperCase() === "COMFIRM" && (
                  <div className="detail-actions">
                    <button
                      type="button"
                      className="primary-btn"
                      disabled={actionLoading}
                      onClick={() => handleAction("approve")}
                    >
                      Chấp thuận
                    </button>
                    <button
                      type="button"
                      className="danger-btn"
                      disabled={actionLoading}
                      onClick={() => handleAction("reject")}
                    >
                      Từ chối
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
