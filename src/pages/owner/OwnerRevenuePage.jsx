import { ownerRevenues } from "../../data/ownerMockData";
import "./owner-venue-info.css";

export default function OwnerRevenuePage() {
  return (
    <div className="owner-venues-page">
      <div className="owner-venues-header">
        <div>
          <p className="owner-subtitle">Hiệu quả kinh doanh</p>
          <h1 className="owner-venues-title">Doanh thu</h1>
        </div>
        <button type="button" className="ghost-btn">
          Xuất báo cáo
        </button>
      </div>

      <div className="owner-venues-card">
        <table className="owner-venues-table">
          <thead>
            <tr>
              <th style={{ width: "70px" }}>#</th>
              <th style={{ minWidth: "220px" }}>Tên sân</th>
              <th style={{ width: "200px", textAlign: "center" }}>
                Doanh thu (tháng)
              </th>
              <th style={{ width: "140px", textAlign: "center" }}>
                Tăng trưởng
              </th>
              <th style={{ width: "180px", textAlign: "center" }}>
                Khung cao điểm
              </th>
            </tr>
          </thead>
          <tbody>
            {ownerRevenues.map((item) => (
              <tr key={item.id}>
                <td className="cell-index">{item.id}</td>
                <td className="cell-name">{item.name}</td>
                <td className="cell-center">
                  <span className="revenue-text">{item.monthRevenue}</span>
                </td>
                <td className="cell-center growth">{item.growth}</td>
                <td className="cell-center">{item.topHour}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
