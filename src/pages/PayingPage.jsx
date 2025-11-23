import React, { useState } from "react";
import "./payingPage.css";

const mockPayment = {
  customerName: "Pham Van A",
  phone: "0987654321",
  venueName: "Sân cầu lông 12 Khuất Duy Tiến",
  address: "12 Khuất Duy Tiến, Thanh Xuân, Hà Nội",
  date: "2026-01-01",
  timeRange: "15:00 - 17:00",
  total: 180000,
};

export default function PayingPage() {
  const [customerName, setCustomerName] = useState(mockPayment.customerName);
  const [phone, setPhone] = useState(mockPayment.phone);
  const { venueName, address, date, timeRange, total } = mockPayment;

  return (
    <div className="paying-page">
      <div className="paying-card">
        <div className="paying-title">Thông tin đặt sân</div>

        <div className="paying-body">
          <div className="paying-form">
            <FormRow label="Tên của bạn">
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </FormRow>
            <FormRow label="Số điện thoại">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </FormRow>
            <FormRow label="Tên sân">
              <span className="field-badge">{venueName}</span>
            </FormRow>
            <FormRow label="Địa chỉ">
              <span className="field-badge">{address}</span>
            </FormRow>
            <FormRow label="Thời gian">
              <div className="field-inline">
                <span className="field-badge">{formatDateLabel(date)}</span>
                <span className="field-badge">{timeRange}</span>
              </div>
            </FormRow>
            <FormRow label="Thành tiền">
              <span className="field-badge strong">
                {total.toLocaleString("vi-VN")} VND
              </span>
            </FormRow>
          </div>

          <div className="paying-qr">
            <div className="qr-placeholder">
              <span>Ảnh QR Code</span>
            </div>
          </div>
        </div>

        <div className="paying-note">
          Bấm xác nhận thanh toán, bạn đã đọc và đồng ý với các điều khoản và
          chính sách của chúng tôi
        </div>

        <button className="paying-submit" type="button">
          ĐẶT SÂN
        </button>
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

function formatDateLabel(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
