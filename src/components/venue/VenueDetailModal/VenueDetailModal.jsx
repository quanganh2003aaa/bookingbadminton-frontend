import React, { useMemo, useState } from "react";
import {
  Modal,
  Tabs,
  Image,
  Avatar,
  Tag,
  Button,
  Rate,
  List,
  Table,
  Typography,
  Space,
  Card,
} from "antd";
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
  const [activeTab, setActiveTab] = useState("images");
  if (!venue) return null;

  const {
    name,
    address,
    startTime,
    endTime,
    phone,
    image,
    mapEmbed,
    images = [],
    pricing = [],
    reviews = [],
  } = venue;

  const displayImages = useMemo(() => (images.length ? images : image ? [image] : []), [images, image]);

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

  const tabItems = [
    {
      key: "images",
      label: "Hình ảnh",
      children: (
        <Image.PreviewGroup>
          <div className="images-grid">
            {displayImages.length ? (
              displayImages.map((src, idx) => (
                <Card key={src + idx} className="image-card" cover={<Image src={src} alt={`${name} ${idx + 1}`} />}></Card>
              ))
            ) : (
              <div className="placeholder-panel">Chưa có hình ảnh</div>
            )}
          </div>
        </Image.PreviewGroup>
      ),
    },
    {
      key: "pricing",
      label: "Giá sân",
      children: (
        <Table
          columns={pricingColumns}
          dataSource={(pricing || []).map((p, idx) => ({ key: idx, ...p }))}
          pagination={false}
          size="middle"
        />
      ),
    },
    {
      key: "map",
      label: "Bản đồ",
      children: mapEmbed ? (
        <div className="map-wrapper">
          <iframe
            src={mapEmbed}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Bản đồ"
          />
        </div>
      ) : (
        <div className="placeholder-panel">Bản đồ đang được cập nhật</div>
      ),
    },
    {
      key: "reviews",
      label: "Đánh giá",
      children: (
        <List
          dataSource={reviews}
          locale={{ emptyText: "Chưa có đánh giá" }}
          renderItem={(r) => (
            <List.Item className="review-item">
              <List.Item.Meta
                avatar={
                  r.avatar ? (
                    <Avatar src={r.avatar} />
                  ) : (
                    <Avatar>{(r.name || "?").charAt(0)}</Avatar>
                  )
                }
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
    >
      <div className="venue-hero">
        {displayImages[0] ? (
          <Image src={displayImages[0]} alt={name} width="100%" height={200} style={{ objectFit: "cover" }} preview={false} />
        ) : (
          <div className="placeholder-panel">Chưa có hình ảnh</div>
        )}
      </div>

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
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </div>
    </Modal>
  );
}
