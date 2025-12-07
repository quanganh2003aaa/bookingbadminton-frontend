import React, { useMemo, useState } from "react";
import { FiUser } from "react-icons/fi";
import "./userInfoPage.css";

const mockUser = {
  name: "Pham Van A",
  email: "testgmail@gmail.com",
  phone: "0987654321",
  password: "********",
};

const mockBookings = [
  {
    id: 1,
    date: "2026-01-01",
    venue: "Sân cầu lông 12 Khuất Duy Tiến",
    address: "Km 10, Đường Nguyễn Trãi, Quận Thanh Xuân, Hà Nội",
    timeRange: "17:00 - 19:00",
    ownerPhones: ["0987654321", "0987654321"],
  },
  {
    id: 2,
    date: "2026-01-01",
    venue: "Sân cầu lông 12 Khuất Duy Tiến",
    address: "Km 10, Đường Nguyễn Trãi, Quận Thanh Xuân, Hà Nội",
    timeRange: "15:00 - 17:00",
    ownerPhones: ["0987654321", "0987654321"],
  },
  {
    id: 3,
    date: "2026-01-01",
    venue: "Sân cầu lông 12 Khuất Duy Tiến",
    address: "Km 10, Đường Nguyễn Trãi, Quận Thanh Xuân, Hà Nội",
    timeRange: "13:00 - 15:00",
    ownerPhones: ["0987654321", "0987654321"],
  },
  {
    id: 4,
    date: "2026-01-02",
    venue: "Sân cầu lông Thanh Xuân",
    address: "123 Nguyễn Trãi, Thanh Xuân, Hà Nội",
    timeRange: "07:00 - 09:00",
    ownerPhones: ["0901234567", "0987654321"],
  },
  {
    id: 5,
    date: "2026-01-02",
    venue: "Sân cầu lông Cầu Giấy",
    address: "45 Trần Thái Tông, Cầu Giấy, Hà Nội",
    timeRange: "09:00 - 11:00",
    ownerPhones: ["0901234567", "0977777777"],
  },
  {
    id: 6,
    date: "2026-01-03",
    venue: "Sân cầu lông Hoàng Mai",
    address: "75 Giải Phóng, Hoàng Mai, Hà Nội",
    timeRange: "15:00 - 17:00",
    ownerPhones: ["0911222333", "0966666666"],
  },
  {
    id: 7,
    date: "2026-01-03",
    venue: "Sân cầu lông Tây Hồ",
    address: "88 Lạc Long Quân, Tây Hồ, Hà Nội",
    timeRange: "17:00 - 19:00",
    ownerPhones: ["0911222333", "0966666666"],
  },
  {
    id: 8,
    date: "2026-01-04",
    venue: "Sân cầu lông Đống Đa",
    address: "12 Tôn Đức Thắng, Đống Đa, Hà Nội",
    timeRange: "06:00 - 08:00",
    ownerPhones: ["0933444555", "0988888888"],
  },
  {
    id: 9,
    date: "2026-01-04",
    venue: "Sân cầu lông Long Biên",
    address: "34 Nguyễn Văn Cừ, Long Biên, Hà Nội",
    timeRange: "08:00 - 10:00",
    ownerPhones: ["0933444555", "0988888888"],
  },
  {
    id: 10,
    date: "2026-01-05",
    venue: "Sân cầu lông Hai Bà Trưng",
    address: "22 Phố Huế, Hai Bà Trưng, Hà Nội",
    timeRange: "16:00 - 18:00",
    ownerPhones: ["0944555666", "0911999777"],
  },
  {
    id: 11,
    date: "2026-01-05",
    venue: "Sân cầu lông Ba Đình",
    address: "99 Liễu Giai, Ba Đình, Hà Nội",
    timeRange: "18:00 - 20:00",
    ownerPhones: ["0944555666", "0911999777"],
  },
  {
    id: 12,
    date: "2026-01-06",
    venue: "Sân cầu lông Bắc Từ Liêm",
    address: "10 Phạm Văn Đồng, Bắc Từ Liêm, Hà Nội",
    timeRange: "07:00 - 09:00",
    ownerPhones: ["0955666777", "0933444555"],
  },
  {
    id: 13,
    date: "2026-01-06",
    venue: "Sân cầu lông Nam Từ Liêm",
    address: "68 Lê Đức Thọ, Nam Từ Liêm, Hà Nội",
    timeRange: "09:00 - 11:00",
    ownerPhones: ["0955666777", "0933444555"],
  },
];

export default function UserInfoPage() {
  const [selectedId, setSelectedId] = useState(mockBookings[0]?.id ?? null);
  const [activeTab, setActiveTab] = useState("bookings");
  const [profile, setProfile] = useState(mockUser);
  const [isEditing, setIsEditing] = useState(false);

  const selectedBooking = useMemo(
    () => mockBookings.find((b) => b.id === selectedId) || mockBookings[0],
    [selectedId]
  );

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <div className="user-info-page">
      <div className="user-info-card">
        <div className="user-topbar">
          <div className="user-name">
            <span className="user-avatar">
              <FiUser size={24} />
            </span>
            <span className="user-name-text">{profile.name}</span>
          </div>
          <div className="user-contacts">
            <span className="divider" />
            <span className="contact-field">{profile.email}</span>
            <span className="divider" />
            <span className="contact-field">{profile.phone}</span>
          </div>
        </div>

        <div className="user-info-body">
          <aside className="user-sidebar">
            <button
              className={`sidebar-btn ${
                activeTab === "bookings" ? "primary active" : "secondary"
              }`}
              type="button"
              onClick={() => {
                setActiveTab("bookings");
                setIsEditing(false);
              }}
            >
              DANH SÁCH LỊCH ĐẶT
            </button>
            <button
              className={`sidebar-btn ${
                activeTab === "profile" ? "primary active" : "secondary"
              }`}
              type="button"
              onClick={() => setActiveTab("profile")}
            >
              THÔNG TIN CÁ NHÂN
            </button>
            <button className="sidebar-btn secondary" type="button">
              ĐĂNG XUẤT
            </button>
          </aside>

          {activeTab === "bookings" ? (
            <div className="user-content">
              <div className="booking-table-card">
                <div className="booking-table-header">
                  <div>Ngày</div>
                  <div>Tên sân</div>
                  <div />
                </div>
                <div className="booking-table-body">
                  {mockBookings.map((b) => (
                    <div
                      key={b.id}
                      className={`booking-row${
                        selectedId === b.id ? " selected" : ""
                      }`}
                      onClick={() => setSelectedId(b.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") setSelectedId(b.id);
                      }}
                    >
                      <div className="booking-date">{formatDate(b.date)}</div>
                      <div className="booking-venue">{b.venue}</div>
                      <div className="booking-link">xem chi tiết &gt;&gt;</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="booking-detail-card">
                <input
                  type="text"
                  value={selectedBooking?.venue || ""}
                  readOnly
                />
                <textarea
                  value={selectedBooking?.address || ""}
                  readOnly
                  rows={3}
                />
                <div className="detail-inline">
                  <input
                    type="text"
                    value={selectedBooking?.ownerPhones?.[0] || ""}
                    readOnly
                  />
                  <input
                    type="text"
                    value={selectedBooking?.ownerPhones?.[1] || ""}
                    readOnly
                  />
                </div>
                <div className="detail-inline">
                  <input
                    type="text"
                    value={
                      selectedBooking ? formatDate(selectedBooking.date) : ""
                    }
                    readOnly
                  />
                  <input
                    type="text"
                    value={selectedBooking?.timeRange || ""}
                    readOnly
                  />
                </div>
                <button className="contact-owner" type="button">
                  Liên hệ chủ sân
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-content">
              <div className="profile-form">
                <FormRow label="Tên của bạn">
                  <input
                    type="text"
                    value={profile.name}
                    className={isEditing ? "editable" : ""}
                    readOnly={!isEditing}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </FormRow>
                <FormRow label="Gmail">
                  <input
                    type="text"
                    value={profile.email}
                    className={isEditing ? "editable" : ""}
                    readOnly={!isEditing}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </FormRow>
                <FormRow label="Số điện thoại">
                  <input
                    type="text"
                    value={profile.phone}
                    className={isEditing ? "editable" : ""}
                    readOnly={!isEditing}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, phone: e.target.value }))
                    }
                  />
                </FormRow>
                <FormRow label="Mật khẩu">
                  <input
                    type={isEditing ? "text" : "password"}
                    value={profile.password}
                    className={isEditing ? "editable" : ""}
                    readOnly={!isEditing}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                  />
                </FormRow>
                <div className="profile-actions">
                  <button
                    className="contact-owner"
                    type="button"
                    onClick={toggleEdit}
                  >
                    {isEditing ? "LƯU THÔNG TIN" : "SỬA THÔNG TIN"}
                  </button>
                </div>
              </div>

              <div className="profile-avatar">
                <div className="avatar-placeholder">
                  <span>Ảnh đại diện</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FormRow({ label, children }) {
  return (
    <div className="form-row">
      <label>{label}</label>
      <div className="form-control">{children}</div>
    </div>
  );
}

function formatDate(iso) {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}
