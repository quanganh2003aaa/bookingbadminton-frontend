import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Row,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
  List,
  message,
} from "antd";
import { UserOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../../api/endpoints";
import "./userInfoPage.css";

const { Title, Text } = Typography;

const getUserFromCookie = () => {
  try {
    const raw =
      (document.cookie
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith("userInfo=")) || ""
      ).split("=")[1] || "";
    return raw ? JSON.parse(decodeURIComponent(raw)) : {};
  } catch {
    return {};
  }
};

const getCookie = (name) => {
  if (typeof document === "undefined") return "";
  return (
    document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${name}=`))
      ?.split("=")[1] || ""
  );
};

const clearCookie = (name) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export default function UserInfoPage() {
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState("bookings");
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", avatar: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState("");
  const [bookingDetail, setBookingDetail] = useState(null);
  const [bookingDetailLoading, setBookingDetailLoading] = useState(false);
  const navigate = useNavigate();

  const userCookie = useMemo(getUserFromCookie, []);

  useEffect(() => {
    const userId = userCookie.userId || "";
    if (!userId) return;
    // profile
    (async () => {
      try {
        const token =
          document.cookie
            .split(";")
            .map((c) => c.trim())
            .find((c) => c.startsWith("accessToken="))
            ?.split("=")[1] || "";
        const res = await fetch(ENDPOINTS.userDetailInfo, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ userId }),
        });
        if (!res.ok) return;
        const data = await res.json().catch(() => ({}));
        const result = data?.result || {};
        setProfile({
          name: result.nameUser || userCookie.username || "",
          email: result.email || userCookie.email || "",
          phone: result.msidn || result.msisdn || userCookie.phone || "",
          avatar: result.avatar || "",
        });
      } catch {
        // ignore
      }
    })();

    // bookings list
    (async () => {
      setBookingsLoading(true);
      setBookingsError("");
      try {
        const token =
          document.cookie
            .split(";")
            .map((c) => c.trim())
            .find((c) => c.startsWith("accessToken="))
            ?.split("=")[1] || "";
        const res = await fetch(ENDPOINTS.bookingUserList(userId), {
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error("Không thể tải danh sách đặt sân.");
        const data = await res.json().catch(() => ({}));
        const list = Array.isArray(data?.result) ? data.result : [];
        setBookings(
          list.map((item, idx) => ({
            id: item.bookingId || `booking-${idx}`,
            bookingId: item.bookingId || `booking-${idx}`,
            date: item.date || "",
            venue: item.fieldName || "—",
            timeRange: item.timeRange || "",
            status: item.status || "",
          }))
        );
        setSelectedId((prev) => prev || list[0]?.bookingId || null);
      } catch (err) {
        setBookingsError(err.message || "Không thể tải danh sách đặt sân.");
        setBookings([]);
      } finally {
        setBookingsLoading(false);
      }
    })();
  }, [userCookie]);

  const selectedBooking = useMemo(
    () => bookings.find((b) => b.bookingId === selectedId) || bookings.find((b) => b.id === selectedId),
    [bookings, selectedId]
  );

  const renderStatus = (val = "") => {
    const upper = String(val || "").toUpperCase();
    if (upper === "ACCEPT") return "Đã duyệt";
    if (upper === "INACCEPT") return "Từ chối";
    if (upper === "PENDING") return "Chờ duyệt";
    if (upper === "COMFIRM") return "Chờ chấp thuận";
    return upper || "Chưa rõ";
  };

  const columns = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (val) => formatDate(val),
      width: 140,
    },
    {
      title: "Tên sân",
      dataIndex: "venue",
      key: "venue",
    },
    {
      title: "Khung giờ",
      dataIndex: "timeRange",
      key: "timeRange",
      width: 150,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (val) => renderStatus(val),
    },
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const refreshToken = getCookie("refreshToken");
      await fetch(ENDPOINTS.logout, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // ignore errors, still clear local state
    } finally {
      clearCookie("accessToken");
      clearCookie("refreshToken");
      clearCookie("userInfo");
      localStorage.removeItem("userProfile");
      message.success("Đăng xuất thành công");
      setLoggingOut(false);
      navigate("/login");
    }
  };

  const fetchBookingDetail = async (bookingId) => {
    if (!bookingId) return;
    setBookingDetailLoading(true);
    try {
      const res = await fetch(ENDPOINTS.bookingPayDetail(bookingId), {
        headers: { Accept: "application/json" },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Không thể tải chi tiết đơn.");
      setBookingDetail(data?.result || null);
    } catch (err) {
      message.error(err.message || "Không thể tải chi tiết đơn.");
      setBookingDetail(null);
    } finally {
      setBookingDetailLoading(false);
    }
  };

  const profileTab = (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={14}>
        <Card title="Thông tin cá nhân" className="ui-card">
          <Form layout="vertical" className="info-form">
            <Form.Item label="Họ và tên">
              <Input
                value={profile.name}
                disabled={!isEditing}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                prefix={<UserOutlined />}
              />
            </Form.Item>
            <Form.Item label="Email">
              <Input
                value={profile.email}
                disabled={!isEditing}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                prefix={<MailOutlined />}
              />
            </Form.Item>
            <Form.Item label="Số điện thoại">
              <Input
                value={profile.phone}
                disabled={!isEditing}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                prefix={<PhoneOutlined />}
              />
            </Form.Item>
            <Space>
              <Button onClick={() => setIsEditing((prev) => !prev)} type={isEditing ? "default" : "primary"}>
                {isEditing ? "Hủy" : "Chỉnh sửa"}
              </Button>
              {isEditing && (
                <Button onClick={handleSaveProfile} type="primary">
                  Lưu thông tin
                </Button>
              )}
            </Space>
          </Form>
        </Card>
      </Col>
      <Col xs={24} lg={10}>
        <Card title="Ảnh đại diện" className="ui-card avatar-card">
          <div className="avatar-block">
            {profile.avatar ? <Avatar size={120} src={profile.avatar} /> : <Avatar size={120} icon={<UserOutlined />} />}
            <Text type="secondary">Chức năng cập nhật ảnh sẽ hỗ trợ sau.</Text>
            <Button disabled>Đổi ảnh</Button>
          </div>
        </Card>
      </Col>
    </Row>
  );

  const bookingsTab = (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={15}>
        <Card title="Danh sách lịch đặt" className="ui-card">
          {bookingsError && <div className="form-error">{bookingsError}</div>}
          <Table
            columns={columns}
            dataSource={bookings.map((b) => ({ ...b, key: b.bookingId || b.id }))}
            pagination={false}
            size="middle"
            loading={bookingsLoading}
            rowClassName={(record) => (record.bookingId === selectedId ? "table-row-selected" : "")}
            onRow={(record) => ({
              onClick: () => setSelectedId(record.bookingId),
              style: { cursor: "pointer" },
            })}
          />
        </Card>
      </Col>
      <Col xs={24} lg={9}>
        <Card title="Chi tiết đặt sân" className="ui-card">
          {selectedBooking ? (
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label="Mã đơn">
                  <Text strong>{selectedBooking.bookingId}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Tên sân">
                  <Text strong>{selectedBooking.venue}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày">{formatDate(selectedBooking.date)}</Descriptions.Item>
                <Descriptions.Item label="Khung giờ">{selectedBooking.timeRange}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">{renderStatus(selectedBooking.status)}</Descriptions.Item>
              </Descriptions>
              <Button
                type="primary"
                block
                loading={bookingDetailLoading}
                onClick={() => fetchBookingDetail(selectedBooking.bookingId)}
              >
                Xem chi tiết
              </Button>
              {bookingDetail && bookingDetail.bookingId === selectedBooking.bookingId && (
                <Descriptions column={1} size="small" bordered>
                  <Descriptions.Item label="Thanh toán">
                    {bookingDetail.invoiceStatus || "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tổng tiền">
                    {Number(bookingDetail.price || 0).toLocaleString("vi-VN")} VND
                  </Descriptions.Item>
                  <Descriptions.Item label="Khung giờ chi tiết">
                    <List
                      size="small"
                      dataSource={bookingDetail.bookingFields || []}
                      renderItem={(item, idx) => (
                        <List.Item>
                          <Space>
                            <Tag color="blue">Sân {item.indexField || idx + 1}</Tag>
                            <span>
                              {toTime(item.startHour)} - {toTime(item.endHour)}
                            </span>
                          </Space>
                        </List.Item>
                      )}
                    />
                  </Descriptions.Item>
                  {bookingDetail.imgPayment && (
                    <Descriptions.Item label="Ảnh thanh toán">
                      <img src={bookingDetail.imgPayment} alt="Ảnh thanh toán" style={{ maxWidth: "100%" }} />
                    </Descriptions.Item>
                  )}
                </Descriptions>
              )}
            </Space>
          ) : (
            <Text type="secondary">Chưa có lịch đặt nào.</Text>
          )}
        </Card>
      </Col>
    </Row>
  );

  return (
    <div className="user-info-page">
      <div className="user-info-shell">
        <Card className="ui-card hero-card">
          <Space align="start" style={{ width: "100%", justifyContent: "space-between" }} size={16}>
            <Space align="start" size={16}>
              {profile.avatar ? <Avatar size={64} src={profile.avatar} /> : <Avatar size={64} icon={<UserOutlined />} />}
              <div className="hero-meta">
                <Title level={4} className="no-margin">
                  {profile.name || "Người dùng"}
                </Title>
                <Space size={8} wrap>
                  <Tag icon={<MailOutlined />} color="blue">
                    {profile.email || "Chưa cập nhật"}
                  </Tag>
                  <Tag icon={<PhoneOutlined />} color="green">
                    {profile.phone || "Chưa cập nhật"}
                  </Tag>
                </Space>
              </div>
            </Space>
            <Button danger onClick={handleLogout} loading={loggingOut}>
              Đăng xuất
            </Button>
          </Space>
        </Card>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: "bookings", label: "Lịch đặt", children: bookingsTab },
            { key: "profile", label: "Thông tin cá nhân", children: profileTab },
          ]}
        />
      </div>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

function toTime(value = "") {
  if (!value) return "";
  if (value.includes("T")) {
    const [, timePart = ""] = value.split("T");
    const [h = "00", m = "00"] = timePart.split(":");
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
  }
  const parts = String(value).split(":");
  return `${parts[0]?.padStart(2, "0") || "00"}:${parts[1]?.padStart(2, "0") || "00"}`;
}
