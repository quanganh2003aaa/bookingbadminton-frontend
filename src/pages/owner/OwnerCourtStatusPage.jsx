import { ownerStatuses } from "../../services/ownerMockData";
import "./owner-venue-info.css";

const statusClass = (status) =>
  status.toLowerCase().includes("ngừng") ? "status-stop" : "status-ok";

export default function OwnerCourtStatusPage() {
  return (
    <div className="owner-venues-page">
      <div className="owner-venues-header">
        <div>
          <p className="owner-subtitle">Theo dõi hoạt động</p>
          <h1 className="owner-venues-title">Tình trạng sân</h1>
        </div>
      </div>

      <div className="owner-venues-card">
        <table className="owner-venues-table">
          <thead>
            <tr>
              <th style={{ width: "70px" }}>#</th>
              <th>Tên sân</th>
              <th style={{ width: "160px" }}>Đặt hôm nay</th>
              <th style={{ width: "150px", textAlign: "center" }}>
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody>
            {ownerStatuses.map((court) => (
              <tr key={court.id}>
                <td className="cell-index">{court.id}</td>
                <td className="cell-name">{court.name}</td>
                <td className="cell-center">{court.todayBookings}</td>
                <td className="cell-center">
                  <span className={`status-badge ${statusClass(court.status)}`}>
                    {court.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
