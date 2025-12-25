import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./owner-venue-info.css";
import { ENDPOINTS } from "../../api/endpoints";

const statusClass = (status = "") => {
  const upper = status.toUpperCase();
  if (upper === "ACTIVE") return "status-ok";
  if (upper === "INACTIVE") return "status-stop";
  return "status-pending";
};

const statusLabel = (status = "") => {
  const upper = status.toUpperCase();
  if (upper === "ACTIVE") return "Hoạt động";
  if (upper === "INACTIVE") return "Ngừng hoạt động";
  return "Chưa rõ";
};

export default function OwnerCourtStatusPage() {
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const totalPages = Math.max(1, Math.ceil((total || fields.length) / pageSize));
  const currentPage = Math.max(1, Math.min(page, totalPages));

  useEffect(() => {
    const ownerId = localStorage.getItem("ownerId") || "";
    if (!ownerId) {
      setError("Không tìm thấy ownerId. Vui lòng đăng nhập lại.");
      setFields([]);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        params.append("ownerId", ownerId);
        params.append("page", String(Math.max(currentPage - 1, 0)));
        params.append("size", String(pageSize));
        const url = `${ENDPOINTS.ownerFieldBookings}?${params.toString()}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Không thể tải danh sách sân.");
        const data = await res.json().catch(() => ({}));
        const payload = data.result || {};
        const list = Array.isArray(payload.content) ? payload.content : Array.isArray(payload) ? payload : [];
        setFields(
          list.map((item, idx) => ({
            id: item.id || `field-${idx}`,
            name: item.name || "Chưa cập nhật",
            todayBookings: item.todayBookings ?? 0,
            status: item.status || "",
          }))
        );
        const apiTotal =
          payload.totalElements ??
          data.totalElements ??
          data.total ??
          payload.totalItems ??
          list.length;
        setTotal(apiTotal);
        const apiPageNumber = payload.pageNumber ?? payload.number;
        if (typeof apiPageNumber === "number" && apiPageNumber + 1 !== currentPage) {
          setPage(apiPageNumber + 1);
        }
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra.");
        setFields([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  );

  const handleChangePage = (nextPage) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  return (
    <div className="owner-venues-page">
      <div className="owner-venues-header">
        <div>
          <p className="owner-subtitle">Theo dõi hoạt động</p>
          <h1 className="owner-venues-title">Tình trạng sân</h1>
        </div>
      </div>

      {error && <div className="detail-placeholder form-error inline-error">{error}</div>}

      <div className="owner-venues-card">
        <table className="owner-venues-table">
          <thead>
            <tr>
              <th style={{ width: "70px" }}>#</th>
              <th>Tên sân</th>
              <th style={{ width: "160px" }}>Đặt hôm nay</th>
              <th style={{ width: "150px", textAlign: "center" }}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="cell-center">
                  Đang tải...
                </td>
              </tr>
            )}
            {!loading && fields.length === 0 && (
              <tr>
                <td colSpan={4} className="cell-center">
                  Không có dữ liệu
                </td>
              </tr>
            )}
            {!loading &&
              fields.map((court, idx) => (
                <tr key={court.id}>
                  <td className="cell-index">{(currentPage - 1) * pageSize + idx + 1}</td>
                  <td className="cell-name">{court.name}</td>
                  <td className="cell-center">{court.todayBookings ?? 0}</td>
                  <td className="cell-center status-click">
                    <span className={`status-badge ${statusClass(court.status)}`}>
                      {statusLabel(court.status)}
                    </span>
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => navigate(`/owner/status/${court.id}`)}
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className="table-pagination owner-pagination">
          <div className="page-info">
            Trang {currentPage}/{totalPages} • {total || fields.length} sân
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
    </div>
  );
}
