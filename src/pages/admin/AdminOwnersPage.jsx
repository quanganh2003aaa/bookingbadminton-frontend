import { useEffect, useMemo, useState } from "react";
import "./admin-system.css";
import { ENDPOINTS } from "../../api/endpoints";

const pageSize = 10;

const formatStatus = (active) => {
  const upper = (active || "").toUpperCase();
  if (upper === "ACTIVE") return { label: "Đang hoạt động", css: "status-active" };
  if (upper === "INACTIVE") return { label: "Ngưng hoạt động", css: "status-locked" };
  return { label: "Chưa rõ", css: "status-pending" };
};

export default function AdminOwnersPage() {
  const [search, setSearch] = useState("");
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [detail, setDetail] = useState(null);
  const [detailError, setDetailError] = useState("");
  const [detailLoading, setDetailLoading] = useState(false);

  const totalPages = Math.max(1, Math.ceil((total || owners.length) / pageSize));
  const currentPage = Math.max(1, Math.min(page, totalPages));

  const fetchOwners = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      params.append("page", String(Math.max(currentPage - 1, 0)));
      params.append("size", String(pageSize));
      const url = `${ENDPOINTS.adminFields}?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Không thể tải danh sách sân.");
      const data = await res.json().catch(() => ({}));
      const payload = data.result || {};
      const list = Array.isArray(payload.content)
        ? payload.content
        : Array.isArray(payload)
        ? payload
        : [];
      setOwners(
        list.map((item, index) => ({
          id: item.id || `row-${index}`,
          name: item.name || "",
          email: item.gmail || item.email || "",
        }))
      );
      const apiTotal =
        payload.totalElements ??
        data.totalElements ??
        data.total ??
        list.length;
      setTotal(apiTotal);
      const apiPageNumber = payload.pageNumber ?? payload.number;
      if (typeof apiPageNumber === "number" && apiPageNumber + 1 !== currentPage) {
        setPage(apiPageNumber + 1);
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra.");
      setOwners([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, currentPage]);

  const fetchDetail = async (id) => {
    if (!id) return;
    setDetail(null);
    setDetailError("");
    setDetailLoading(true);
    try {
      const url =
        typeof ENDPOINTS.adminFieldDetail === "function"
          ? ENDPOINTS.adminFieldDetail(id)
          : `${ENDPOINTS.adminFields}/${id}/detail`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Không thể tải chi tiết sân.");
      const data = await res.json().catch(() => ({}));
      const item = data.result || {};
      const status = formatStatus(item.active);
      setDetail({
        id: item.id || id,
        name: item.name || "",
        address: item.address || "",
        ownerName: item.ownerName || "",
        ownerEmail: item.ownerGmail || "",
        phone: item.msisdn || item.mobileContact || "",
        status,
        linkMap: item.linkMap || "",
        startTime: item.startTime || "",
        endTime: item.endTime || "",
      });
    } catch (err) {
      setDetailError(err.message || "Có lỗi xảy ra khi tải chi tiết.");
    } finally {
      setDetailLoading(false);
    }
  };

  const paginated = useMemo(() => owners, [owners]);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleChangePage = (nextPage) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  const handleViewDetail = (id) => {
    fetchDetail(id);
  };

  const mapSrc = (() => {
    if (!detail || !detail.linkMap) return "";
    return detail.linkMap;
  })();

  return (
    <div className="admin-system-page">
      <h1>Quản lý sân</h1>

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
          </div>

          {error && <div className="form-error inline-error">{error}</div>}

          <div className="admin-table owner-table">
            <div className="admin-table-row admin-table-head">
              <span>#</span>
              <span>Tên sân</span>
              <span>Email</span>
              <span>Chi tiết</span>
            </div>
            {loading && (
              <div className="admin-table-row empty-row">
                <span>Đang tải...</span>
              </div>
            )}
            {!loading && paginated.length === 0 && (
              <div className="admin-table-row empty-row">
                <span>Không tìm thấy sân</span>
              </div>
            )}
            {!loading &&
              paginated.map((o, idx) => (
                <div className="admin-table-row" key={o.id || idx}>
                  <span className="cell-bold">
                    {(currentPage - 1) * pageSize + idx + 1}
                  </span>
                  <span>{o.name || "Chưa cập nhật"}</span>
                  <span>{o.email || "Chưa cập nhật"}</span>
                  <span>
                    <button
                      type="button"
                      className="user-action neutral"
                      onClick={() => handleViewDetail(o.id)}
                    >
                      Xem chi tiết
                    </button>
                  </span>
                </div>
              ))}
          </div>

          <div className="table-pagination">
            <div className="page-info">
              Trang {currentPage}/{totalPages} • {total || owners.length} sân
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
          <h3>Thông tin sân</h3>
          {detailLoading ? (
            <div className="detail-placeholder">Đang tải chi tiết...</div>
          ) : detailError ? (
            <div className="detail-placeholder form-error inline-error">
              {detailError}
            </div>
          ) : !detail ? (
            <div className="detail-placeholder">Chọn sân để xem chi tiết</div>
          ) : (
            <div className="detail-body">
              <div className="detail-row">
                <span className="label">Tên sân</span>
                <span className="value">{detail.name || "Chưa cập nhật"}</span>
              </div>
              <div className="detail-row">
                <span className="label">Chủ sân</span>
                <span className="value">{detail.ownerName || "Chưa cập nhật"}</span>
              </div>
              <div className="detail-row">
                <span className="label">Email chủ sân</span>
                <span className="value">{detail.ownerEmail || "Chưa cập nhật"}</span>
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
                <span className="label">Thời gian hoạt động</span>
                <span className="value">
                  {detail.startTime || "--:--"} - {detail.endTime || "--:--"}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Trạng thái</span>
                <span className={`status-pill ${detail.status.css}`}>
                  {detail.status.label}
                </span>
              </div>
              <div className="detail-row map-row">
                <span className="label">Bản đồ</span>
                <div className="map-frame">
                  {mapSrc ? (
                    <iframe title="Map preview" src={mapSrc} allowFullScreen loading="lazy" />
                  ) : (
                    <div className="map-placeholder">Chưa có bản đồ</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
