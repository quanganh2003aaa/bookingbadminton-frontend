import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./payingPage.css";

const mockPayment = {
  customerName: "Pham Van A",
  phone: "0987654321",
  venueName: "San cau long",
  address: "Dia chi san",
  date: "2026-01-01",
  selections: [{ court: "San 1", start: "15:00", end: "17:00", price: 180000 }],
  total: 180000,
};

export default function PayingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const payload = state.selections && state.selections.length ? state : mockPayment;

  const [customerName, setCustomerName] = useState(payload.customerName || mockPayment.customerName);
  const [phone, setPhone] = useState(payload.phone || mockPayment.phone);
  const venueName = payload.venueName || mockPayment.venueName;
  const address = payload.address || mockPayment.address;
  const date = payload.date || mockPayment.date;
  const selections = payload.selections || mockPayment.selections;
  const total = payload.total || mockPayment.total;

  const mergedSelections = useMemo(() => mergeConsecutiveSelections(selections), [selections]);

  const timeRange = useMemo(() => {
    if (!mergedSelections.length) return "";
    const sorted = [...mergedSelections].sort((a, b) => a.start.localeCompare(b.start));
    return `${sorted[0].start} - ${sorted[sorted.length - 1].end}`;
  }, [mergedSelections]);

  return (
    <div className="paying-page">
      <div className="paying-shell">
        <header className="paying-header">
          <div>
            <p className="eyebrow">Thanh toán</p>
            <h1>Thông tin đặt sân</h1>
            <p className="sub">Kiểm tra chi tiết và xác nhận thanh toán</p>
          </div>
          <div className="total-chip">
            <span>Tổng tiền</span>
            <strong>{total.toLocaleString("vi-VN")} VND</strong>
          </div>
        </header>

        <div className="paying-grid">
          <section className="card">
            <h3>Thông tin người đặt</h3>
            <div className="form-grid compact">
              <FormRow label="Tên của bạn">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nhập tên"
                />
              </FormRow>
              <FormRow label="Số điện thoại">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nhập số điện thoại"
                />
              </FormRow>
            </div>
          </section>

          <section className="card">
            <h3>Thông tin sân</h3>
            <div className="info-grid compact">
              <InfoRow label="Tên sân" value={<span className="info-strong">{venueName}</span>} />
              <InfoRow label="Địa chỉ" value={<span className="info-muted">{address}</span>} />
              <InfoRow
                label="Thời gian"
                value={
                  <div className="pill-row">
                    <span className="pill">{formatDateLabel(date)}</span>
                    <span className="pill">{timeRange}</span>
                  </div>
                }
              />
              <InfoRow
                label="Chi tiết đặt"
                value={
                  <div className="selection-scroll horizontal">
                    <div className="selection-row">
                      {mergedSelections.map((s, idx) => (
                        <div key={s.court + s.start + idx} className="selection-card">
                          <div className="selection-title">{s.court}</div>
                          <div className="selection-time">
                            {s.start} - {s.end}
                          </div>
                          <div className="selection-price">
                            {Number(s.price).toLocaleString("vi-VN")} VND
                          </div>
                          {s.count > 1 && <div className="selection-count">{s.count} slot liên tiếp</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                }
              />
            </div>
          </section>

          <section className="card qr-card">
            <div className="qr-placeholder">
              <span>QR Code sẽ hiển thị tại đây</span>
            </div>
            <p className="qr-note">Quét mã để thanh toán nhanh chóng và an toàn</p>
          </section>
        </div>

        <div className="paying-footer">
          <div className="footer-note">
            Bấm xác nhận thanh toán, bạn đã đồng ý với các điều khoản và chính sách của chúng tôi.
          </div>
          <button className="paying-submit" type="button" onClick={() => navigate("/booking")}>
            Xác nhận & Đặt sân
          </button>
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

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <div className="info-value">{value}</div>
    </div>
  );
}

function formatDateLabel(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function parseTimeToMinutes(value = "") {
  const [h = "0", m = "0"] = String(value).split(":");
  return Number(h) * 60 + Number(m);
}

function mergeConsecutiveSelections(list = []) {
  if (!Array.isArray(list) || !list.length) return [];
  const sorted = [...list].sort((a, b) => {
    const c = (a.court || "").localeCompare(b.court || "");
    if (c !== 0) return c;
    return parseTimeToMinutes(a.start) - parseTimeToMinutes(b.start);
  });

  const merged = [];
  for (const item of sorted) {
    const last = merged[merged.length - 1];
    const sameCourt = last && last.court === item.court;
    const isConsecutive = sameCourt && parseTimeToMinutes(last.end) === parseTimeToMinutes(item.start);
    if (isConsecutive) {
      last.end = item.end;
      last.price = Number(last.price) + Number(item.price || 0);
      last.count = (last.count || 1) + 1;
    } else {
      merged.push({
        court: item.court || "",
        start: item.start,
        end: item.end,
        price: item.price || 0,
        count: 1,
      });
    }
  }
  return merged;
}
