import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Descriptions, Tag, Table, Typography, Divider, Space, Button, Result } from "antd";
import "./invoicePage.css";

const { Title, Text } = Typography;

const mockInvoice = {
  code: "INV-2025-0001",
  status: "PAID",
  createdAt: "2025-12-26 10:30",
  customer: { name: "Phạm Văn A", phone: "0987654321" },
  venue: {
    name: "Phạm Quang Trường Anh2",
    address: "Số 20, Phường Quyết Tiến, Thành phố Lai Châu, Tỉnh Lai Châu",
  },
  bookingDate: "26/12/2025",
  timeRange: "15:30 - 20:00",
  items: [
    { court: "Sân 2", start: "18:00", end: "20:00", price: 355552, count: 4 },
    { court: "Sân 3", start: "15:30", end: "18:00", price: 266666, count: 5 },
  ],
  total: 622218,
};

export default function InvoicePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const payload = location.state && location.state.invoice ? location.state.invoice : mockInvoice;

  const totalPrice = useMemo(
    () => payload.items?.reduce((sum, item) => sum + Number(item.price || 0), 0) || payload.total || 0,
    [payload.items, payload.total]
  );

  const columns = [
    { title: "Sân", dataIndex: "court", key: "court" },
    {
      title: "Thời gian",
      key: "time",
      render: (_, record) => (
        <span>
          {record.start} - {record.end}
        </span>
      ),
    },
    {
      title: "Số slot",
      dataIndex: "count",
      key: "count",
      render: (val) => <span>{val || 1}</span>,
    },
    {
      title: "Thành tiền",
      dataIndex: "price",
      key: "price",
      render: (val) => <span className="price">{Number(val).toLocaleString("vi-VN")} VND</span>,
      align: "right",
    },
  ];

  return (
    <div className="invoice-page">
      <div className="invoice-shell">
        <Result
          status="success"
          title="Đặt sân thành công"
          subTitle="Hóa đơn đã được tạo. Vui lòng kiểm tra thông tin bên dưới."
          className="invoice-result"
        />

        <Card className="invoice-card" bordered={false}>
          <div className="invoice-header">
            <div>
              <p className="eyebrow">Mã hóa đơn</p>
              <Title level={3} className="no-margin">
                {payload.code}
              </Title>
              <Text type="secondary">Tạo lúc: {payload.createdAt}</Text>
            </div>
            <Tag color={payload.status === "PAID" ? "green" : "orange"} className="status-tag">
              {payload.status === "PAID" ? "ĐÃ THANH TOÁN" : "CHƯA THANH TOÁN"}
            </Tag>
          </div>

          <Divider />

          <div className="invoice-sections">
            <Card size="small" className="mini-card" title="Người đặt">
              <Descriptions column={1} size="small" colon={false}>
                <Descriptions.Item label="Họ tên">
                  <strong>{payload.customer?.name}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Điện thoại">{payload.customer?.phone}</Descriptions.Item>
              </Descriptions>
            </Card>

            <Card size="small" className="mini-card" title="Thông tin sân">
              <Descriptions column={1} size="small" colon={false}>
                <Descriptions.Item label="Tên sân">
                  <strong>{payload.venue?.name}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">{payload.venue?.address}</Descriptions.Item>
                <Descriptions.Item label="Ngày">{payload.bookingDate}</Descriptions.Item>
                <Descriptions.Item label="Khung giờ">{payload.timeRange}</Descriptions.Item>
              </Descriptions>
            </Card>
          </div>

          <div className="table-wrap">
            <Table
              columns={columns}
              dataSource={(payload.items || []).map((item, idx) => ({ key: idx, ...item }))}
              pagination={false}
              size="middle"
            />
          </div>

          <div className="totals">
            <Space direction="vertical" align="end" style={{ width: "100%" }}>
              <div className="total-row">
                <span>Tổng cộng</span>
                <strong>{Number(totalPrice).toLocaleString("vi-VN")} VND</strong>
              </div>
              <div className="total-row accent">
                <span>Thanh toán</span>
                <strong>{Number(totalPrice).toLocaleString("vi-VN")} VND</strong>
              </div>
            </Space>
          </div>
        </Card>

        <div className="invoice-actions">
          <Button onClick={() => navigate("/")} size="large">
            Về trang chủ
          </Button>
          <Button type="primary" onClick={() => window.print()} size="large">
            In hóa đơn
          </Button>
        </div>
      </div>
    </div>
  );
}
