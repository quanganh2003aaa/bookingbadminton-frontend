import React, { useMemo, useState } from "react";
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
} from "antd";
import { UserOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";
import "./userInfoPage.css";

const { Title, Text } = Typography;

const mockUser = {
  name: "Phạm Văn A",
  email: "phamvana@example.com",
  phone: "0987654321",
  password: "********",
};

const mockBookings = [
  {
    id: 1,
    date: "2026-01-01",
    venue: "Sân cầu lông Duy Tiến",
    address: "Km 10, Nguyễn Trãi, Thanh Xuân, Hà Nội",
    timeRange: "17:00 - 19:00",
    ownerPhones: ["0987654321", "0966666666"],
  },
  {
    id: 2,
    date: "2026-01-02",
    venue: "Sân cầu lông Thanh Xuân",
    address: "123 Nguyễn Trãi, Thanh Xuân, Hà Nội",
    timeRange: "07:00 - 09:00",
    ownerPhones: ["0901234567", "0987654321"],
  },
  {
    id: 3,
    date: "2026-01-03",
    venue: "Sân cầu lông Hoàng Mai",
    address: "75 Giải Phóng, Hoàng Mai, Hà Nội",
    timeRange: "15:00 - 17:00",
    ownerPhones: ["0911222333", "0966666666"],
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
            <Form.Item label="Mật khẩu">
              <Input.Password
                value={profile.password}
                disabled={!isEditing}
                onChange={(e) => setProfile((p) => ({ ...p, password: e.target.value }))}
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
            <Avatar size={120} icon={<UserOutlined />} />
            <Text type="secondary">Cập nhật ảnh đại diện để tài khoản sinh động hơn.</Text>
            <Button>Đổi ảnh</Button>
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
          <Space align="start" style={{ width: "100%" }} size={16}>
            <Avatar size={64} icon={<UserOutlined />} />
            <div className="hero-meta">
              <Title level={4} className="no-margin">
                {profile.name}
              </Title>
              <Space size={8} wrap>
                <Tag icon={<MailOutlined />} color="blue">
                  {profile.email}
                </Tag>
                <Tag icon={<PhoneOutlined />} color="green">
                  {profile.phone}
                </Tag>
              </Space>
            </div>
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
