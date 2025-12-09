import { useMemo, useState } from "react";
import "./admin-system.css";

const mockOwners = [
  {
    id: 1,
    venue: "Sân 12 Khuất Duy Tiến",
    phone: "0911000001",
    email: "khoa.owner@mail.com",
    address: "12 Khuất Duy Tiến, Thanh Xuân, Hà Nội",
    openTime: "06:00",
    closeTime: "23:00",
    mapLink: "https://maps.google.com/?q=12+khuat+duy+tien",
    locked: false,
  },
  {
    id: 2,
    venue: "Sân Cầu Giấy",
    phone: "0911000002",
    email: "hanh.owner@mail.com",
    address: "15 Trần Quốc Hoàn, Cầu Giấy, Hà Nội",
    openTime: "06:00",
    closeTime: "22:00",
    mapLink: "https://maps.google.com/?q=tran+quoc+hoan+ha+noi",
    locked: false,
  },
  {
    id: 3,
    venue: "Sân Tây Hồ",
    phone: "0911000003",
    email: "phuc.owner@mail.com",
    address: "88 Lạc Long Quân, Tây Hồ, Hà Nội",
    openTime: "05:30",
    closeTime: "22:30",
    mapLink: "https://maps.google.com/?q=lac+long+quan+ha+noi",
    locked: true,
  },
  {
    id: 4,
    venue: "Sân Long Biên",
    phone: "0911000004",
    email: "long.owner@mail.com",
    address: "25 Long Biên, Hà Nội",
    openTime: "06:00",
    closeTime: "22:00",
    mapLink: "https://maps.google.com/?q=long+bien+ha+noi",
    locked: false,
  },
  {
    id: 5,
    venue: "Sân Gia Lâm",
    phone: "0911000005",
    email: "hai.owner@mail.com",
    address: "55 Ngô Xuân Quảng, Gia Lâm, Hà Nội",
    openTime: "06:00",
    closeTime: "23:00",
    mapLink: "https://maps.google.com/?q=ngo+xuan+quang+ha+noi",
    locked: false,
  },
  {
    id: 6,
    venue: "Sân Hoàng Mai",
    phone: "0911000006",
    email: "lan.owner@mail.com",
    address: "120 Giải Phóng, Hoàng Mai, Hà Nội",
    openTime: "05:30",
    closeTime: "22:00",
    mapLink: "https://maps.google.com/?q=giai+phong+ha+noi",
    locked: false,
  },
  {
    id: 7,
    venue: "Sân Thanh Xuân",
    phone: "0911000007",
    email: "duc.owner@mail.com",
    address: "99 Nguyễn Trãi, Thanh Xuân, Hà Nội",
    openTime: "06:00",
    closeTime: "23:00",
    mapLink: "https://maps.google.com/?q=nguyen+trai+ha+noi",
    locked: true,
  },
  {
    id: 8,
    venue: "Sân Ba Đình",
    phone: "0911000008",
    email: "trang.owner@mail.com",
    address: "45 Đội Cấn, Ba Đình, Hà Nội",
    openTime: "06:00",
    closeTime: "22:00",
    mapLink: "https://maps.google.com/?q=doi+can+ha+noi",
    locked: false,
  },
  {
    id: 9,
    venue: "Sân Đống Đa",
    phone: "0911000009",
    email: "bao.owner@mail.com",
    address: "26 Tôn Đức Thắng, Đống Đa, Hà Nội",
    openTime: "06:00",
    closeTime: "22:00",
    mapLink: "https://maps.google.com/?q=ton+duc+thang+ha+noi",
    locked: false,
  },
  {
    id: 10,
    venue: "Sân Cầu Diễn",
    phone: "0911000010",
    email: "mai.owner@mail.com",
    address: "12 Hồ Tùng Mậu, Nam Từ Liêm, Hà Nội",
    openTime: "06:00",
    closeTime: "22:30",
    mapLink: "https://maps.google.com/?q=ho+tung+mau+ha+noi",
    locked: false,
  },
  {
    id: 11,
    venue: "Sân Trần Phú",
    phone: "0911000011",
    email: "kiet.owner@mail.com",
    address: "60 Trần Phú, Hà Đông, Hà Nội",
    openTime: "06:00",
    closeTime: "23:00",
    mapLink: "https://maps.google.com/?q=tran+phu+ha+dong",
    locked: false,
  },
  {
    id: 12,
    venue: "Sân Nguyễn Trãi",
    phone: "0911000012",
    email: "anh.owner@mail.com",
    address: "110 Nguyễn Trãi, Thanh Xuân, Hà Nội",
    openTime: "05:30",
    closeTime: "22:30",
    mapLink: "https://maps.google.com/?q=110+nguyen+trai+ha+noi",
    locked: false,
  },
  {
    id: 13,
    venue: "Sân Yên Hòa",
    phone: "0911000013",
    email: "yen.owner@mail.com",
    address: "8 Trung Kính, Cầu Giấy, Hà Nội",
    openTime: "06:00",
    closeTime: "22:00",
    mapLink: "https://maps.google.com/?q=trung+kinh+ha+noi",
    locked: true,
  },
  {
    id: 14,
    venue: "Sân Mỹ Đình",
    phone: "0911000014",
    email: "dung.owner@mail.com",
    address: "Mễ Trì, Nam Từ Liêm, Hà Nội",
    openTime: "06:00",
    closeTime: "23:00",
    mapLink: "https://maps.google.com/?q=me+tri+ha+noi",
    locked: false,
  },
  {
    id: 15,
    venue: "Sân Hà Đông",
    phone: "0911000015",
    email: "tu.owner@mail.com",
    address: "55 Quang Trung, Hà Đông, Hà Nội",
    openTime: "06:00",
    closeTime: "22:00",
    mapLink: "https://maps.google.com/?q=quang+trung+ha+dong",
    locked: false,
  },
  {
    id: 16,
    venue: "Sân Láng Hạ",
    phone: "0911000016",
    email: "manh.owner@mail.com",
    address: "120 Láng Hạ, Đống Đa, Hà Nội",
    openTime: "06:00",
    closeTime: "22:30",
    mapLink: "https://maps.google.com/?q=lang+ha+ha+noi",
    locked: false,
  },
  {
    id: 17,
    venue: "Sân Phạm Ngọc Thạch",
    phone: "0911000017",
    email: "thu.owner@mail.com",
    address: "80 Phạm Ngọc Thạch, Đống Đa, Hà Nội",
    openTime: "06:00",
    closeTime: "23:00",
    mapLink: "https://maps.google.com/?q=pham+ngoc+thach+ha+noi",
    locked: false,
  },
  {
    id: 18,
    venue: "Sân Nguyễn Chí Thanh",
    phone: "0911000018",
    email: "tung.owner@mail.com",
    address: "18 Nguyễn Chí Thanh, Đống Đa, Hà Nội",
    openTime: "06:00",
    closeTime: "22:00",
    mapLink: "https://maps.google.com/?q=nguyen+chi+thanh+ha+noi",
    locked: false,
  },
  {
    id: 19,
    venue: "Sân Lạc Trung",
    phone: "0911000019",
    email: "chi.owner@mail.com",
    address: "22 Lạc Trung, Hai Bà Trưng, Hà Nội",
    openTime: "05:30",
    closeTime: "22:00",
    mapLink: "https://maps.google.com/?q=lac+trung+ha+noi",
    locked: true,
  },
  {
    id: 20,
    venue: "Sân Hoàn Kiếm",
    phone: "0911000020",
    email: "vu.owner@mail.com",
    address: "Hàng Bài, Hoàn Kiếm, Hà Nội",
    openTime: "06:00",
    closeTime: "22:00",
    mapLink: "https://maps.google.com/?q=hang+bai+ha+noi",
    locked: false,
  },
];

export default function AdminOwnersPage() {
  const [search, setSearch] = useState("");
  const [owners, setOwners] = useState(mockOwners);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const pageSize = 10;

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return owners;
    return owners.filter(
      (o) =>
        o.venue.toLowerCase().includes(term) ||
        o.address.toLowerCase().includes(term) ||
        o.phone.includes(term) ||
        o.email.toLowerCase().includes(term)
    );
  }, [search, owners]);

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

  const handleToggleLock = (owner) => {
    const action = owner.locked ? "mở khóa" : "khóa";
    const ok = window.confirm(
      `Bạn có chắc muốn ${action} sân ${owner.venue}?`
    );
    if (ok) {
      setOwners((prev) =>
        prev.map((o) =>
          o.id === owner.id ? { ...o, locked: !o.locked } : o
        )
      );
      setSelectedId(owner.id);
      // TODO: call API toggle lock/unlock owner
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleChangePage = (nextPage) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  const handleViewDetail = (ownerId) => {
    setSelectedId(ownerId);
  };

  const selectedOwner = owners.find((o) => o.id === selectedId);
  const mapSrc = (() => {
    if (!selectedOwner) return "";
    if (selectedOwner.mapLink) {
      const hasQuery = selectedOwner.mapLink.includes("?");
      const hasOutput = selectedOwner.mapLink.includes("output=embed");
      return selectedOwner.mapLink + (hasOutput ? "" : `${hasQuery ? "&" : "?"}output=embed`);
    }
    if (selectedOwner.address) {
      return `https://www.google.com/maps?q=${encodeURIComponent(selectedOwner.address)}&output=embed`;
    }
    return "";
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

          <div className="admin-table owner-table">
            <div className="admin-table-row admin-table-head">
              <span>#</span>
              <span>Tên sân</span>
              <span>Email</span>
              <span>Chi tiết</span>
            </div>
            {paginated.length === 0 && (
              <div className="admin-table-row empty-row">
                <span>Không tìm thấy sân</span>
              </div>
            )}
            {paginated.map((o, idx) => (
              <div className="admin-table-row" key={o.id}>
                <span className="cell-bold">
                  {(currentPage - 1) * pageSize + idx + 1}
                </span>
                <span>{o.venue}</span>
                <span>{o.email}</span>
                <span>
                  <button
                    type="button"
                    className="user-action neutral"
                    onClick={() => handleViewDetail(o.id)}
                  >
                    Xem chi tiet
                  </button>
                </span>
              </div>
            ))}
          </div>

          <div className="table-pagination">
            <div className="page-info">
              Trang {currentPage}/{totalPages} · {filtered.length} sân
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
          {!selectedOwner ? (
            <div className="detail-placeholder">Chọn sân để xem chi tiết</div>
          ) : (
            <div className="detail-body">
              <div className="detail-row">
                <span className="label">Tên sân</span>
                <span className="value">{selectedOwner.venue}</span>
              </div>
              <div className="detail-row">
                <span className="label">Email</span>
                <span className="value">{selectedOwner.email}</span>
              </div>
              <div className="detail-row">
                <span className="label">Địa chỉ</span>
                <span className="value">{selectedOwner.address}</span>
              </div>
              <div className="detail-row">
                <span className="label">Liên hệ</span>
                <span className="value">{selectedOwner.phone}</span>
              </div>
              <div className="detail-row">
                <span className="label">Giờ hoạt động</span>
                <span className="value">
                  {selectedOwner.openTime} - {selectedOwner.closeTime}
                </span>
              </div>
              <div className="detail-row map-row">
                <span className="label">Bản đồ</span>
                <div className="map-frame">
                  {mapSrc ? (
                    <iframe
                      title="Map preview"
                      src={mapSrc}
                      allowFullScreen
                      loading="lazy"
                    />
                  ) : (
                    <div className="map-placeholder">Chưa có map</div>
                  )}
                </div>
              </div>
              <div className="detail-row">
                <span className="label">Trạng thái</span>
                <span
                  className={`status-pill ${
                    selectedOwner.locked ? "status-locked" : "status-active"
                  }`}
                >
                  {selectedOwner.locked ? "Đang khóa" : "Hoạt động"}
                </span>
              </div>
              <div className="detail-actions">
                <button
                  type="button"
                  className={`user-action ${
                    selectedOwner.locked ? "success" : "danger"
                  }`}
                  onClick={() => handleToggleLock(selectedOwner)}
                >
                  {selectedOwner.locked ? "Mở khóa sân" : "Khóa sân"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
