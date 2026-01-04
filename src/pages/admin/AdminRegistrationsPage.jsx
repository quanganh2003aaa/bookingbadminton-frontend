import { useEffect, useMemo, useState } from "react";
import "./admin-system.css";
import { ENDPOINTS } from "../../api/endpoints";

const STATUS_LABELS = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
};

const apiStatusMap = {
  all: "",
  pending: "INACCEPT",
  approved: "ACCEPT",
  rejected: "REJECT",
};

const toUiStatus = (status) => {
  const upper = (status || "").toUpperCase();
  if (upper === "ACCEPT") return { uiStatus: "approved", statusCode: "ACCEPT" };
  if (upper === "REJECT") return { uiStatus: "rejected", statusCode: "REJECT" };
  return { uiStatus: "pending", statusCode: "INACCEPT" };
};

const formatDateTime = (value) => {
  if (!value) return "Chưa cập nhật";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

const transformRegistration = (item, index) => {
  const { uiStatus, statusCode } = toUiStatus(item.status);
  return {
    id: item.id || item.accountId || item.gmail || item.name || `row-${index}`,
    name: item.name || "",
    email: item.gmail || item.email || "",
    status: uiStatus,
    statusCode,
  };
};

const transformDetail = (item, fallbackId) => {
  const { uiStatus, statusCode } = toUiStatus(item.status);
  return {
    id: item.id || fallbackId,
    accountId: item.accountId || "",
    name: item.name || "",
    email: item.gmail || item.email || "",
    phone: item.mobileContact || "",
    address: item.address || "",
    linkMap: item.linkMap || "",
    status: uiStatus,
    statusCode,
    createdAt: item.createdAt || "",
    updatedAt: item.updatedAt || "",
    qrImage:
      item.qrImage ||
      item.qrCode ||
      item.qr ||
      item.bankQr ||
      item.imageQr ||
      item.qrUrl ||
      "",
  };
};

export default function AdminRegistrationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);

  const pageSize = 10;

  useEffect(() => {
    const controller = new AbortController();
    const fetchRegistrations = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        const trimmedSearch = search.trim();
        if (trimmedSearch) params.append("search", trimmedSearch);
        const apiStatus = apiStatusMap[statusFilter];
        if (apiStatus) params.append("status", apiStatus);

        const query = params.toString();
        const url = `${ENDPOINTS.adminRegisterOwners}${query ? `?${query}` : ""}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error("Không thể tải danh sách đơn đăng ký.");

        const data = await res.json().catch(() => ({}));
        const list = Array.isArray(data.result) ? data.result : [];
        setRegistrations(list.map(transformRegistration));
        setPage(1);
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message || "Có lỗi xảy ra.");
        setRegistrations([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchRegistrations();
    return () => controller.abort();
  }, [search, statusFilter]);

  const fetchDetail = async (id) => {
    if (!id) return;
    setDetail(null);
    setDetailError("");
    setDetailLoading(true);
    try {
      const url =
        typeof ENDPOINTS.adminRegisterOwnerDetail === "function"
          ? ENDPOINTS.adminRegisterOwnerDetail(id)
          : `${ENDPOINTS.adminRegisterOwners}/${id}/detail`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Không thể tải chi tiết đơn đăng ký.");
      const data = await res.json().catch(() => ({}));
      setDetail(transformDetail(data.result || {}, id));
    } catch (err) {
      setDetailError(err.message || "Có lỗi xảy ra khi tải chi tiết.");
    } finally {
      setDetailLoading(false);
    }
  };

  const filtered = registrations;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  );

  const updateStatus = async (item, nextStatus) => {
    if (!item || item.status === nextStatus) return;
    const actionText =
      nextStatus === "approved" ? "duyệt đơn này" : "từ chối đơn này";
    const ok = window.confirm(
      `Bạn có chắc muốn ${actionText} của ${item.name || "người này"}?`
    );
    if (!ok) return;
    setActionLoadingId(item.id);
    try {
      let url = "";
      if (nextStatus === "approved") {
        url =
          typeof ENDPOINTS.adminRegisterOwnerApprove === "function"
            ? ENDPOINTS.adminRegisterOwnerApprove(item.id)
            : `${ENDPOINTS.adminRegisterOwners}/${item.id}/approve`;
      } else if (nextStatus === "rejected") {
        url =
          typeof ENDPOINTS.adminRegisterOwnerReject === "function"
            ? ENDPOINTS.adminRegisterOwnerReject(item.id)
            : `${ENDPOINTS.adminRegisterOwners}/${item.id}/reject`;
      }
      if (!url) throw new Error("Thiếu endpoint cập nhật trạng thái.");
      const res = await fetch(url, { method: "POST" });
      if (!res.ok) {
        const message =
          nextStatus === "approved"
            ? "Không thể duyệt đơn đăng ký."
            : "Không thể từ chối đơn đăng ký.";
        throw new Error(message);
      }

      setRegistrations((prev) =>
        prev.map((r) => (r.id === item.id ? { ...r, status: nextStatus } : r))
      );
      setDetail((prev) =>
        prev && prev.id === item.id ? { ...prev, status: nextStatus } : prev
      );
      setSelectedId(item.id);
    } catch (err) {
      alert(err.message || "Có lỗi xảy ra khi cập nhật trạng thái.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const handleChangePage = (nextPage) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  const handleViewDetail = (id) => {
    setSelectedId(id);
    fetchDetail(id);
  };

  return (
    <div className="admin-system-page">
      <h1>Quản lý đơn đăng ký quản lý</h1>

      <div className="owner-management">
        <div className="admin-table-card owner-table-card">
          <div className="table-header">
            <div className="table-search">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={search}
                onChange={handleSearchChange}
              />
            </div>
            <div className="table-filters">
              <select value={statusFilter} onChange={handleStatusChange}>
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>
          </div>

          {error && <div className="form-error inline-error">{error}</div>}

          <div className="admin-table registration-table">
            <div className="admin-table-row admin-table-head">
              <span>#</span>
              <span>Người đăng ký</span>
              <span>Gmail</span>
              <span>Trạng thái</span>
              <span>Chi tiết</span>
            </div>
            {loading && (
              <div className="admin-table-row empty-row">
                <span>Đang tải...</span>
              </div>
            )}
            {!loading && paginated.length === 0 && (
              <div className="admin-table-row empty-row">
                <span>Không có dữ liệu</span>
              </div>
            )}
            {!loading &&
              paginated.map((r, idx) => (
                <div className="admin-table-row" key={r.id || idx}>
                  <span className="cell-bold">
                    {(currentPage - 1) * pageSize + idx + 1}
                  </span>
                  <span>{r.name || "Chưa cập nhật"}</span>
                  <span>{r.email || "Chưa cập nhật"}</span>
                  <span>
                    <span className={`status-badge status-${r.status} compact`}>
                      {STATUS_LABELS[r.status] || r.statusCode || "Chưa rõ"}
                    </span>
                  </span>
                  <span>
                    <button
                      type="button"
                      className="user-action neutral detail-btn"
                      onClick={() => handleViewDetail(r.id)}
                    >
                      Xem chi tiết
                    </button>
                  </span>
                </div>
              ))}
          </div>

          <div className="table-pagination">
            <div className="page-info">
              Trang {currentPage}/{totalPages} - {filtered.length} đơn
            </div>
            <div className="page-buttons">
              <button
                type="button"
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => handleChangePage(currentPage - 1)}
              >
                Trước
              </button>
              {pageNumbers.map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`page-btn ${p === currentPage ? "active" : ""}`}
                  onClick={() => handleChangePage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => handleChangePage(currentPage + 1)}
              >
                Sau
              </button>
            </div>
          </div>
        </div>

        <div className="owner-detail-card">
          <h3>Chi tiết đơn</h3>
          {detailLoading ? (
            <div className="detail-placeholder">Đang tải chi tiết...</div>
          ) : detailError ? (
            <div className="detail-placeholder form-error inline-error">
              {detailError}
            </div>
          ) : !detail ? (
            <div className="detail-placeholder">Chọn đơn để xem chi tiết</div>
          ) : (
            <div className="detail-body">
              <div className="detail-row">
                <span className="label">Người đăng ký</span>
                <span className="value">{detail.name || "Chưa cập nhật"}</span>
              </div>
              <div className="detail-row">
                <span className="label">Gmail</span>
                <span className="value">{detail.email || "Chưa cập nhật"}</span>
              </div>
              <div className="detail-row">
                <span className="label">Số điện thoại</span>
                <span className="value">{detail.phone || "Chưa cập nhật"}</span>
              </div>
              <div className="detail-row">
                <span className="label">Địa chỉ</span>
                <span className="value">{detail.address || "Chưa cập nhật"}</span>
              </div>
              <div className="detail-row">
                <span className="label">Trạng thái</span>
                <span
                  className={`status-pill ${
                    detail.status === "approved"
                      ? "status-active"
                      : detail.status === "rejected"
                      ? "status-locked"
                      : "status-pending"
                  }`}
                >
                  {STATUS_LABELS[detail.status] || detail.statusCode || "Chưa rõ"}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Ngày tạo</span>
                <span className="value">{formatDateTime(detail.createdAt)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Cập nhật lần cuối</span>
                <span className="value">{formatDateTime(detail.updatedAt)}</span>
              </div>
              <div className="detail-row map-row">
                <span className="label">Bản đồ</span>
                <div className="map-frame">
                  {detail.linkMap ? (
                    <iframe title="Bản đồ sân" src={detail.linkMap} allowFullScreen loading="lazy" />
                  ) : (
                    <div className="map-placeholder">Chưa có bản đồ</div>
                  )}
                </div>
              </div>
              <div className="detail-row qr-row">
                <span className="label">QR code ngân hàng</span>
                <div className="qr-frame">
                  {detail.qrImage ? (
                    <img src={detail.qrImage} alt="QR thanh toán sân" className="qr-preview" />
                  ) : (
                    <div className="map-placeholder">Chưa có ảnh QR</div>
                  )}
                </div>
              </div>
              {detail.status === "pending" && (
                <div className="detail-actions">
                  <button
                    type="button"
                    className="user-action success"
                    disabled={actionLoadingId === detail.id}
                    onClick={() => updateStatus(detail, "approved")}
                  >
                    {actionLoadingId === detail.id ? "Đang duyệt..." : "Duyệt"}
                  </button>
                  <button
                    type="button"
                    className="user-action danger"
                    disabled={actionLoadingId === detail.id}
                    onClick={() => updateStatus(detail, "rejected")}
                  >
                    {actionLoadingId === detail.id ? "Đang xử lý..." : "Từ chối"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
