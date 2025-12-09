import { useMemo, useState } from "react";
import "./admin-system.css";

const mockRegistrations = [
  {
    id: 1,
    name: "Phạm Văn An",
    phone: "0987654321",
    email: "an.manager@mail.com",
    venue: "Sân 12 Khuất Duy Tiến",
    venueAddress: "12 Khuất Duy Tiến, Thanh Xuân, Hà Nội",
    venueContact: "0987000001",
    openTime: "06:00",
    closeTime: "23:00",
    mapLink: "https://maps.google.com/?q=12+khuat+duy+tien",
    status: "pending",
  },
  {
    id: 2,
    name: "Nguyễn Thị Bình",
    phone: "0911222333",
    email: "binh.manager@mail.com",
    venue: "Sân Cầu Giấy",
    venueAddress: "15 Trần Quốc Hoàn, Cầu Giấy, Hà Nội",
    venueContact: "0911222333",
    openTime: "06:00",
    closeTime: "22:00",
    mapLink: "https://maps.google.com/?q=tran+quoc+hoan+ha+noi",
    status: "approved",
  },
  {
    id: 3,
    name: "Trần Minh Châu",
    phone: "0933444555",
    email: "chau.manager@mail.com",
    venue: "Sân Tây Hồ",
    venueAddress: "88 Lạc Long Quân, Tây Hồ, Hà Nội",
    venueContact: "0933444555",
    openTime: "05:30",
    closeTime: "22:30",
    mapLink: "https://maps.google.com/?q=lac+long+quan+ha+noi",
    status: "rejected",
  },
  {
    id: 4,
    name: "Lê Hoàng Dũng",
    phone: "0977333444",
    email: "dung.manager@mail.com",
    venue: "Sân Long Biên",
    venueAddress: "25 Long Biên, Hà Nội",
    venueContact: "0977333444",
    openTime: "06:00",
    closeTime: "22:00",
    mapLink: "https://maps.google.com/?q=long+bien+ha+noi",
    status: "pending",
  },
  {
    id: 5,
    name: "Võ Quang Em",
    phone: "0909000005",
    email: "em.manager@mail.com",
    venue: "Sân Gia Lâm",
    venueAddress: "55 Ngô Xuân Quảng, Gia Lâm, Hà Nội",
    venueContact: "0909000005",
    openTime: "06:00",
    closeTime: "23:00",
    mapLink: "https://maps.google.com/?q=ngo+xuan+quang+ha+noi",
    status: "pending",
  },
  {
    id: 6,
    name: "Đặng Thị Phương",
    phone: "0909000006",
    email: "phuong.manager@mail.com",
    venue: "Sân Hoàng Mai",
    venueAddress: "120 Giải Phóng, Hoàng Mai, Hà Nội",
    venueContact: "0909000006",
    openTime: "05:30",
    closeTime: "22:00",
    mapLink: "https://maps.google.com/?q=giai+phong+ha+noi",
    status: "approved",
  },
  {
    id: 7,
    name: "Bùi Minh Giang",
    phone: "0909000007",
    email: "giang.manager@mail.com",
    venue: "Sân Thanh Xuân",
    venueAddress: "99 Nguyễn Trãi, Thanh Xuân, Hà Nội",
    venueContact: "0909000007",
    openTime: "06:00",
    closeTime: "23:00",
    mapLink: "https://maps.google.com/?q=nguyen+trai+ha+noi",
    status: "pending",
  },
  {
    id: 8,
    name: "Đỗ Thùy Hạnh",
    phone: "0909000008",
    email: "hanh.manager@mail.com",
    venue: "Sân Ba Đình",
    venueAddress: "45 Đội Cấn, Ba Đình, Hà Nội",
    venueContact: "0909000008",
    openTime: "06:00",
    closeTime: "22:00",
    mapLink: "https://maps.google.com/?q=doi+can+ha+noi",
    status: "pending",
  },
  {
    id: 9,
    name: "Hoàng Gia Khang",
    phone: "0909000009",
    email: "khang.manager@mail.com",
    venue: "Sân Đống Đa",
    venueAddress: "26 Tôn Đức Thắng, Đống Đa, Hà Nội",
    venueContact: "0909000009",
    openTime: "06:00",
    closeTime: "22:00",
    mapLink: "https://maps.google.com/?q=ton+duc+thang+ha+noi",
    status: "rejected",
  },
  {
    id: 10,
    name: "Phan Thị Lan",
    phone: "0909000010",
    email: "lan.manager@mail.com",
    venue: "Sân Cầu Diễn",
    venueAddress: "12 Hồ Tùng Mậu, Nam Từ Liêm, Hà Nội",
    venueContact: "0909000010",
    openTime: "06:00",
    closeTime: "22:30",
    mapLink: "https://maps.google.com/?q=ho+tung+mau+ha+noi",
    status: "approved",
  },
  {
    id: 11,
    name: "Trịnh Tuấn Minh",
    phone: "0909000011",
    email: "minh.manager@mail.com",
    venue: "Sân Trần Phú",
    venueAddress: "60 Trần Phú, Hà Đông, Hà Nội",
    venueContact: "0909000011",
    openTime: "06:00",
    closeTime: "23:00",
    mapLink: "https://maps.google.com/?q=tran+phu+ha+dong",
    status: "pending",
  },
  {
    id: 12,
    name: "Tạ Quốc Nam",
    phone: "0909000012",
    email: "nam.manager@mail.com",
    venue: "Sân Nguyễn Trãi",
    venueAddress: "110 Nguyễn Trãi, Thanh Xuân, Hà Nội",
    venueContact: "0909000012",
    openTime: "05:30",
    closeTime: "22:30",
    mapLink: "https://maps.google.com/?q=110+nguyen+trai+ha+noi",
    status: "pending",
  },
  {
    id: 13,
    name: "Huỳnh Hải Oanh",
    phone: "0909000013",
    email: "oanh.manager@mail.com",
    venue: "Sân Yên Hòa",
    venueAddress: "8 Trung Kính, Cầu Giấy, Hà Nội",
    venueContact: "0909000013",
    openTime: "06:00",
    closeTime: "22:00",
    mapLink: "https://maps.google.com/?q=trung+kinh+ha+noi",
    status: "approved",
  },
  {
    id: 14,
    name: "Mai Văn Phú",
    phone: "0909000014",
    email: "phu.manager@mail.com",
    venue: "Sân Mỹ Đình",
    venueAddress: "Mễ Trì, Nam Từ Liêm, Hà Nội",
    venueContact: "0909000014",
    openTime: "06:00",
    closeTime: "23:00",
    mapLink: "https://maps.google.com/?q=me+tri+ha+noi",
    status: "pending",
  },
  {
    id: 15,
    name: "Vũ Minh Quân",
    phone: "0909000015",
    email: "quan.manager@mail.com",
    venue: "Sân Hà Đông",
    venueAddress: "55 Quang Trung, Hà Đông, Hà Nội",
    venueContact: "0909000015",
    openTime: "06:00",
    closeTime: "22:00",
    mapLink: "https://maps.google.com/?q=quang+trung+ha+dong",
    status: "pending",
  },
  {
    id: 16,
    name: "Ngô Đức Sơn",
    phone: "0909000016",
    email: "son.manager@mail.com",
    venue: "Sân Láng Hạ",
    venueAddress: "120 Láng Hạ, Đống Đa, Hà Nội",
    venueContact: "0909000016",
    openTime: "06:00",
    closeTime: "22:30",
    mapLink: "https://maps.google.com/?q=lang+ha+ha+noi",
    status: "approved",
  },
  {
    id: 17,
    name: "Trần Thị Trang",
    phone: "0909000017",
    email: "trang.manager@mail.com",
    venue: "Sân Phạm Ngọc Thạch",
    venueAddress: "80 Phạm Ngọc Thạch, Đống Đa, Hà Nội",
    venueContact: "0909000017",
    openTime: "06:00",
    closeTime: "23:00",
    mapLink: "https://maps.google.com/?q=pham+ngoc+thach+ha+noi",
    status: "pending",
  },
  {
    id: 18,
    name: "Phạm Thanh Uyên",
    phone: "0909000018",
    email: "uyen.manager@mail.com",
    venue: "Sân Nguyễn Chí Thanh",
    venueAddress: "18 Nguyễn Chí Thanh, Đống Đa, Hà Nội",
    venueContact: "0909000018",
    openTime: "06:00",
    closeTime: "22:00",
    mapLink: "https://maps.google.com/?q=nguyen+chi+thanh+ha+noi",
    status: "rejected",
  },
  {
    id: 19,
    name: "Lưu Lan Vân",
    phone: "0909000019",
    email: "van.manager@mail.com",
    venue: "Sân Lạc Trung",
    venueAddress: "22 Lạc Trung, Hai Bà Trưng, Hà Nội",
    venueContact: "0909000019",
    openTime: "05:30",
    closeTime: "22:00",
    mapLink: "https://maps.google.com/?q=lac+trung+ha+noi",
    status: "pending",
  },
  {
    id: 20,
    name: "Nguyễn Anh Xuân",
    phone: "0909000020",
    email: "xuan.manager@mail.com",
    venue: "Sân Hoàn Kiếm",
    venueAddress: "Hàng Bài, Hoàn Kiếm, Hà Nội",
    venueContact: "0909000020",
    openTime: "06:00",
    closeTime: "22:00",
    mapLink: "https://maps.google.com/?q=hang+bai+ha+noi",
    status: "pending",
  },
];

const statusLabel = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
};

export default function AdminRegistrationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [registrations, setRegistrations] = useState(mockRegistrations);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const pageSize = 10;

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return registrations.filter((r) => {
      const matchesTerm =
        !term ||
        r.name.toLowerCase().includes(term) ||
        r.email.toLowerCase().includes(term) ||
        r.venue.toLowerCase().includes(term);
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      return matchesTerm && matchesStatus;
    });
  }, [search, statusFilter, registrations]);

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

  const updateStatus = (item, nextStatus) => {
    if (item.status === nextStatus) return;
    const actionText =
      nextStatus === "approved" ? "duyệt đơn này" : "từ chối đơn này";
    const ok = window.confirm(
      `Bạn có chắc muốn ${actionText} của ${item.name} cho ${item.venue}?`
    );
    if (!ok) return;
    setRegistrations((prev) =>
      prev.map((r) =>
        r.id === item.id ? { ...r, status: nextStatus } : r
      )
    );
    setSelectedId(item.id);
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

  const handleViewDetail = (id) => setSelectedId(id);

  const selected = registrations.find((r) => r.id === selectedId);
  const mapSrc =
    selected && selected.mapLink
      ? `${selected.mapLink}${selected.mapLink.includes("?") ? "&" : "?"}output=embed`
      : "";

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

          <div className="admin-table registration-table">
            <div className="admin-table-row admin-table-head">
              <span>#</span>
              <span>Tên sân</span>
              <span>Email</span>
              <span>Trạng thái</span>
              <span>Chi tiết</span>
            </div>
            {paginated.length === 0 && (
              <div className="admin-table-row empty-row">
                <span>Không có dữ liệu</span>
              </div>
            )}
            {paginated.map((r, idx) => (
              <div className="admin-table-row" key={r.id}>
                <span className="cell-bold">
                  {(currentPage - 1) * pageSize + idx + 1}
                </span>
                <span>{r.venue}</span>
                <span>{r.email}</span>
                <span>
                  <span className={`status-badge status-${r.status} compact`}>
                    {statusLabel[r.status]}
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
              Trang {currentPage}/{totalPages} · {filtered.length} đơn
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
          {!selected ? (
            <div className="detail-placeholder">Chọn đơn để xem chi tiết</div>
          ) : (
            <div className="detail-body">
              <div className="detail-row">
                <span className="label">Tên sân</span>
                <span className="value">{selected.venue}</span>
              </div>
              <div className="detail-row">
                <span className="label">Người đăng ký</span>
                <span className="value">{selected.name}</span>
              </div>
              <div className="detail-row">
                <span className="label">Email</span>
                <span className="value">{selected.email}</span>
              </div>
              <div className="detail-row">
                <span className="label">Số điện thoại</span>
                <span className="value">{selected.phone}</span>
              </div>
              <div className="detail-row">
                <span className="label">Liên hệ sân</span>
                <span className="value">{selected.venueContact}</span>
              </div>
              <div className="detail-row">
                <span className="label">Trạng thái</span>
                <span className={`status-pill ${selected.status === "approved" ? "status-active" : selected.status === "rejected" ? "status-locked" : "status-pending"}`}>
                  {statusLabel[selected.status]}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Địa chỉ sân</span>
                <span className="value">{selected.venueAddress}</span>
              </div>
              <div className="detail-row">
                <span className="label">Giờ hoạt động</span>
                <span className="value">
                  {selected.openTime} - {selected.closeTime}
                </span>
              </div>
              <div className="detail-row map-row">
                <span className="label">Bản đồ</span>
                <div className="map-frame">
                  {mapSrc ? (
                    <iframe title="Map" src={mapSrc} allowFullScreen loading="lazy" />
                  ) : (
                    <div className="map-placeholder">Chưa có map</div>
                  )}
                </div>
              </div>
              <div className="detail-actions">
                <button
                  type="button"
                  className="user-action success"
                  disabled={selected.status === "approved"}
                  onClick={() => updateStatus(selected, "approved")}
                >
                  Duyệt
                </button>
                <button
                  type="button"
                  className="user-action danger"
                  disabled={selected.status === "rejected"}
                  onClick={() => updateStatus(selected, "rejected")}
                >
                  Từ chối
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
