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

// Tạm thời giữ dữ liệu mẫu cho tab Lịch đặt
const mockBookings = [
  {
    id: 1,
    date: "2026-01-01",
    venue: "Sân cầu lông Duy Tân",
    address: "Km 10, Nguyễn Trãi, Thanh Xuân, Hà Nội",
    timeRange: "17:00 - 19:00",
    ownerPhones: ["0987654321", "0966666666"],
  },
];

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
  const [selectedId, setSelectedId] = useState(mockBookings[0]?.id ?? null);
  const [activeTab, setActiveTab] = useState("bookings");
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", avatar: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const userCookie = useMemo(getUserFromCookie, []);

  useEffect(() => {
    const userId = userCookie.userId || "";
    if (!userId) return;
    (async () => {
      try {
        const res = await fetch(ENDPOINTS.userDetailInfo, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
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
        // ignore errors, still clear local state
      }
    })();
  }, [userCookie]);

  const selectedBooking = useMemo(
    () => mockBookings.find((b) => b.id === selectedId) || mockBookings[0],
    [selectedId]
  );

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
          <Table
            columns={columns}
            dataSource={mockBookings.map((b) => ({ ...b, key: b.id }))}
            pagination={false}
            size="middle"
            rowClassName={(record) => (record.id === selectedId ? "table-row-selected" : "")}
            onRow={(record) => ({
              onClick: () => setSelectedId(record.id),
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
                <Descriptions.Item label="Tên sân">
                  <Text strong>{selectedBooking.venue}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">{selectedBooking.address}</Descriptions.Item>
                <Descriptions.Item label="Ngày">{formatDate(selectedBooking.date)}</Descriptions.Item>
                <Descriptions.Item label="Khung giờ">{selectedBooking.timeRange}</Descriptions.Item>
              </Descriptions>
              <div>
                <Text strong>Liên hệ chủ sân</Text>
                <List
                  size="small"
                  dataSource={selectedBooking.ownerPhones}
                  renderItem={(phone) => (
                    <List.Item>
                      <Space>
                        <Tag color="green">SĐT</Tag>
                        <Text>{phone}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              </div>
              <Button type="primary" block>
                Liên hệ ngay
              </Button>
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
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}
