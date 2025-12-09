import { useMemo, useState } from "react";
import "./admin-system.css";

const mockUsers = [
  { id: 1, name: "Phạm Văn A", phone: "0987654321", email: "user1@mail.com", locked: false },
  { id: 2, name: "Nguyễn Thị B", phone: "0911222333", email: "user2@mail.com", locked: true },
  { id: 3, name: "Trần Văn C", phone: "0933444555", email: "user3@mail.com", locked: false },
  { id: 4, name: "Lê Văn D", phone: "0977333444", email: "user4@mail.com", locked: true },
  { id: 5, name: "Phạm Văn E", phone: "0909000005", email: "user5@mail.com", locked: false },
  { id: 6, name: "Nguyễn Thị F", phone: "0909000006", email: "user6@mail.com", locked: false },
  { id: 7, name: "Trần Văn G", phone: "0909000007", email: "user7@mail.com", locked: true },
  { id: 8, name: "Lê Văn H", phone: "0909000008", email: "user8@mail.com", locked: false },
  { id: 9, name: "Phạm Văn I", phone: "0909000009", email: "user9@mail.com", locked: false },
  { id: 10, name: "Nguyễn Thị J", phone: "0909000010", email: "user10@mail.com", locked: false },
  { id: 11, name: "Trần Văn K", phone: "0909000011", email: "user11@mail.com", locked: false },
  { id: 12, name: "Lê Văn L", phone: "0909000012", email: "user12@mail.com", locked: true },
  { id: 13, name: "Phạm Văn M", phone: "0909000013", email: "user13@mail.com", locked: false },
  { id: 14, name: "Nguyễn Thị N", phone: "0909000014", email: "user14@mail.com", locked: false },
  { id: 15, name: "Trần Văn O", phone: "0909000015", email: "user15@mail.com", locked: true },
  { id: 16, name: "Lê Văn P", phone: "0909000016", email: "user16@mail.com", locked: false },
  { id: 17, name: "Phạm Văn Q", phone: "0909000017", email: "user17@mail.com", locked: false },
  { id: 18, name: "Nguyễn Thị R", phone: "0909000018", email: "user18@mail.com", locked: false },
  { id: 19, name: "Trần Văn S", phone: "0909000019", email: "user19@mail.com", locked: true },
  { id: 20, name: "Lê Văn T", phone: "0909000020", email: "user20@mail.com", locked: false },
];

export default function AdminSystemPage() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState(mockUsers);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(term) ||
        u.phone.includes(term) ||
        u.email.toLowerCase().includes(term)
    );
  }, [search, users]);

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

  const handleToggleLock = (user) => {
    const action = user.locked ? "mở khóa" : "khóa";
    const ok = window.confirm(
      `Bạn có chắc muốn ${action} người dùng ${user.name}?`
    );
    if (ok) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, locked: !u.locked } : u
        )
      );
      // TODO: call API toggle lock/unlock
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleChangePage = (nextPage) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
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
        </div>

        <div className="admin-table">
          <div className="admin-table-row admin-table-head">
            <span>#</span>
            <span>Tên người dùng</span>
            <span>Số điện thoại</span>
            <span>Gmail</span>
            <span>Thao tác</span>
          </div>
          {paginated.length === 0 && (
            <div className="admin-table-row empty-row">
              <span>Không tìm thấy người dùng</span>
            </div>
          )}
          {paginated.map((u, idx) => (
            <div className="admin-table-row" key={u.id}>
              <span className="cell-bold">
                {(currentPage - 1) * pageSize + idx + 1}
              </span>
              <span>{u.name}</span>
              <span>*****{u.phone.slice(-3)}</span>
              <span>{u.email}</span>
              <span>
                <button
                  type="button"
                  className={`user-action ${u.locked ? "success" : "danger"}`}
                  onClick={() => handleToggleLock(u)}
                >
                  {u.locked ? "Mở khóa" : "Khóa"}
                </button>
              </span>
            </div>
          ))}
        </div>

        <div className="table-pagination">
          <div className="page-info">
            Trang {currentPage}/{totalPages} · {filtered.length} người dùng
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
