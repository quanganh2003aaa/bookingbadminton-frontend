import "./admin-system.css";

const summaryCards = [
  { title: "Lượt đặt thành công", value: 3_120, unit: "lượt", delta: "+8% so với tháng trước", note: "Tỷ lệ huỷ 2.1%" },
  { title: "Chủ sân đang hoạt động", value: 148, unit: "địa điểm", delta: "+5 chủ sân", note: "18 địa điểm đang chờ duyệt" },
  { title: "Người dùng mới", value: 920, unit: "tài khoản", delta: "+14% so với tháng trước", note: "72 tài khoản bị khoá" },
];

const bookingBreakdown = [
  { label: "Thành công", value: 72, tone: "success" },
  { label: "Đang xử lý", value: 18, tone: "pending" },
  { label: "Bị huỷ", value: 10, tone: "danger" },
];

export default function AdminReportsPage() {
  const formatCurrency = (value) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  return (
    <div className="admin-system-page reports-page">
      <h1>Báo cáo hệ thống</h1>

      <div className="report-filters">
        <div className="filter-group">
          <label>Khoảng thời gian</label>
          <select defaultValue="last30">
            <option value="last7">7 ngày</option>
            <option value="last30">30 ngày</option>
            <option value="q4">Quý 4</option>
            <option value="ytd">YTD</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Từ ngày</label>
          <input type="date" defaultValue="2025-12-01" />
        </div>
        <div className="filter-group">
          <label>Đến ngày</label>
          <input type="date" defaultValue="2025-12-31" />
        </div>
        <div className="filter-actions">
          <button className="user-action neutral" type="button">
            Làm mới
          </button>
          <button className="user-action success" type="button">
            Xuất báo cáo
          </button>
        </div>
      </div>

      <div className="report-grid">
        {summaryCards.map((card) => (
          <div key={card.title} className="report-card">
            <div className="report-card-title">{card.title}</div>
            <div className="report-card-value">
              {card.unit === "VND"
                ? formatCurrency(card.value)
                : `${card.value.toLocaleString("vi-VN")} ${card.unit}`}
            </div>
            <div className="report-meta">
              <span className="delta positive">{card.delta}</span>
              <span className="note">{card.note}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="report-panels">
        <div className="report-card breakdown-card">
          <div className="chart-head">
            <div>
              <div className="chart-title">Tỷ lệ đặt sân</div>
              <div className="chart-subtitle">Theo trạng thái giao dịch</div>
            </div>
            <span className="chart-badge neutral">Theo %</span>
          </div>
          <div className="breakdown-list">
            {bookingBreakdown.map((item) => (
              <div key={item.label} className="breakdown-row">
                <div className="breakdown-info">
                  <span className={`dot ${item.tone}`} />
                  <span>{item.label}</span>
                </div>
                <div className="breakdown-value">{item.value}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
