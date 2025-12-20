import { useEffect, useMemo, useState } from "react";
import "./admin-system.css";
import { ENDPOINTS } from "../../api/endpoints";

const pageSize = 10;

export default function AdminSystemPage() {
  const [search, setSearch] = useState("");
  const [lockedFilter, setLockedFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const totalPages = Math.max(1, Math.ceil((total || users.length) / pageSize));
  const currentPage = Math.max(1, Math.min(page, totalPages));

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      params.append("page", String(Math.max(currentPage - 1, 0)));
      params.append("size", String(pageSize));
      if (lockedFilter !== "all") params.append("locked", lockedFilter === "locked");
      const query = params.toString();
      const url = `${ENDPOINTS.adminUsers}${query ? `?${query}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Không thể tải danh sách người dùng.");
      const data = await res.json().catch(() => ({}));
      const payload = data.result || {};
      const list = Array.isArray(payload.content) ? payload.content : Array.isArray(payload) ? payload : [];
      setUsers(
        list.map((item, index) => ({
          id: item.id || item.accountId || `row-${index}`,
          name: item.name || "Chưa cập nhật",
          phone: item.msisdn || "",
          email: item.gmail || item.email || "",
          locked: Boolean(item.deletedAt),
        }))
      );
      const apiTotal =
        payload.totalElements ??
        data.total ??
        data.totalElements ??
        data.totalItems ??
        data?.page?.totalElements ??
        list.length;
      setTotal(apiTotal);
      const apiPageNumber = payload.number;
      if (typeof apiPageNumber === "number" && apiPageNumber + 1 !== currentPage) {
        setPage(apiPageNumber + 1);
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra.");
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, lockedFilter, currentPage]);

  const paginated = useMemo(() => users, [users]);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  );

  const handleToggleLock = async (user) => {
    if (!user) return;
    const action = user.locked ? "mở khóa" : "khóa";
    const ok = window.confirm(`Bạn có chắc muốn ${action} người dùng ${user.name}?`);
    if (!ok) return;
    setActionLoadingId(user.id);
    try {
      const url = user.locked
        ? ENDPOINTS.accountUnlock(user.id)
        : ENDPOINTS.accountLock(user.id);
      const res = await fetch(url, { method: "POST" });
      if (!res.ok) {
        throw new Error(user.locked ? "Không thể mở khóa tài khoản." : "Không thể khóa tài khoản.");
      }
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? {
                ...u,
                locked: !u.locked,
              }
            : u
        )
      );
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

  const handleChangePage = (nextPage) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  const handleLockedChange = (e) => {
    setLockedFilter(e.target.value);
    setPage(1);
  };

  return (
    <div className="admin-system-page">
      <h1>Quản lý người dùng</h1>

      <div className="admin-table-card">
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
            <select value={lockedFilter} onChange={handleLockedChange}>
              <option value="all">Tất cả</option>
              <option value="locked">Đã khóa</option>
              <option value="unlocked">Đang mở</option>
            </select>
          </div>
        </div>

        {error && <div className="form-error inline-error">{error}</div>}

        <div className="admin-table">
          <div className="admin-table-row admin-table-head">
            <span>#</span>
            <span>Tên người dùng</span>
            <span>Số điện thoại</span>
            <span>Gmail</span>
            <span>Thao tác</span>
          </div>
          {loading && (
            <div className="admin-table-row empty-row">
              <span>Đang tải...</span>
            </div>
          )}
          {!loading && paginated.length === 0 && (
            <div className="admin-table-row empty-row">
              <span>Không tìm thấy người dùng</span>
            </div>
          )}
          {!loading &&
            paginated.map((u, idx) => (
              <div className="admin-table-row" key={u.id || idx}>
                <span className="cell-bold">{(currentPage - 1) * pageSize + idx + 1}</span>
                <span>{u.name}</span>
                <span>{u.phone ? `*****${u.phone.slice(-3)}` : "Chưa cập nhật"}</span>
                <span>{u.email || "Chưa cập nhật"}</span>
                <span>
                  <button
                    type="button"
                    className={`user-action ${u.locked ? "success" : "danger"}`}
                    onClick={() => handleToggleLock(u)}
                    disabled={actionLoadingId === u.id}
                  >
                    {actionLoadingId === u.id
                      ? "Đang xử lý..."
                      : u.locked
                      ? "Mở khóa"
                      : "Khóa"}
                  </button>
                </span>
              </div>
            ))}
        </div>

        <div className="table-pagination">
          <div className="page-info">
            Trang {currentPage}/{totalPages} • {total || users.length} người dùng
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
