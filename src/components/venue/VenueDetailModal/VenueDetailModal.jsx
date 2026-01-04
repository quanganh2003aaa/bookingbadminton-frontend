import React, { useMemo, useState } from "react";
import { Modal, Image, Avatar, Tag, Button, Rate, List, Table, Typography, Space, Tabs } from "antd";
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  StarFilled,
  UserOutlined,
} from "@ant-design/icons";
import "./venueDetailModal.css";

const { Title, Text } = Typography;

export default function VenueDetailModal({ venue, onClose, onBook }) {
  const [activeTab, setActiveTab] = useState("pricing");
  if (!venue) return null;

  const {
    name,
    address,
  startTime,
  endTime,
  phone,
  image,
  mapEmbed,
  pricing = [],
  reviews = [],
} = venue;

  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0);
    return +(total / reviews.length).toFixed(1);
  }, [reviews]);

  const pricingColumns = [
    { title: "Khung giờ", dataIndex: "time", key: "time", width: 140 },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (val) => <span className="price-text">{Number(val).toLocaleString("vi-VN")} VND</span>,
      align: "right",
    },
  ];

  const tabs = [
    {
      key: "pricing",
      label: "Bảng giá",
      children: (
        <div className="tab-panel">
          <div className="section-header">
            <Title level={5} className="no-margin">
              Bảng giá
            </Title>
            <Text type="secondary">Các khung giờ và giá áp dụng</Text>
          </div>
          <Table
            columns={pricingColumns}
            dataSource={(pricing || []).map((p, idx) => ({ key: idx, ...p }))}
            pagination={false}
            size="middle"
            className="table-compact"
          />
        </div>
      ),
    },
    {
      key: "reviews",
      label: "Đánh giá",
      children: (
        <div className="tab-panel">
          <div className="section-header">
            <Title level={5} className="no-margin">
              Đánh giá
            </Title>
            <Text type="secondary">{reviews.length ? `${reviews.length} đánh giá` : "Chưa có đánh giá"}</Text>
          </div>
          <List
            dataSource={reviews}
            locale={{ emptyText: "Chưa có đánh giá" }}
            renderItem={(r) => (
              <List.Item className="review-item">
                <List.Item.Meta
                  avatar={r.avatar ? <Avatar src={r.avatar} /> : <Avatar>{(r.name || "?").charAt(0)}</Avatar>}
                  title={
                    <Space align="center">
                      <Text strong>{r.name}</Text>
                      <Rate disabled allowHalf defaultValue={r.rating || 0} />
                    </Space>
                  }
                  description={<Text type="secondary">{r.comment}</Text>}
                />
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      key: "map",
      label: "Bản đồ",
      children: (
        <div className="tab-panel">
          <div className="section-header">
            <Title level={5} className="no-margin">
              Bản đồ
            </Title>
          </div>
          {mapEmbed ? (
            <div className="map-wrapper">
              <iframe
                src={mapEmbed}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ sân"
              />
            </div>
          ) : (
            <div className="placeholder-panel">Bản đồ đang được cập nhật</div>
          )}
        </div>
      ),
    },
  ];

  return (
    <Modal
      open={!!venue}
      onCancel={onClose}
      footer={null}
      width={1100}
      centered
      className="venue-modal-antd"
      destroyOnClose
      style={{ top: 80 }}
    >
      <div className="venue-header">
        <Space size={16} align="start">
          <Avatar size={72} src={image} icon={<UserOutlined />} />
          <div>
            <Title level={4} className="no-margin">
              {name}
            </Title>
            <Space direction="vertical" size={4}>
              <Space size={6}>
                <EnvironmentOutlined />
                <Text type="secondary">{address}</Text>
              </Space>
              <Space size={12} wrap>
                <Tag icon={<ClockCircleOutlined />} color="blue">
                  {startTime} - {endTime}
                </Tag>
                <Tag icon={<PhoneOutlined />} color="green">
                  {phone}
                </Tag>
              </Space>
            </Space>
          </div>
        </Space>
        <Button type="primary" size="large" onClick={() => onBook && onBook()}>
          Đặt lịch
        </Button>
      </div>

      <div className="venue-rating">
        <Tag color="gold" icon={<StarFilled />}>
          {avgRating.toFixed(1)} / 5 ({reviews.length} đánh giá)
        </Tag>
        <Rate disabled allowHalf value={avgRating} />
      </div>

      <div className="venue-tabs-shell">
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabs} />
      </div>
    </Modal>
  );
}
