import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import TimeGrid, { Legend } from "../../components/owner/TimeGrid";
import "../../components/owner/time-grid.css";
import "./owner-status-detail.css";

const mockCourtStatusDetail = {
  id: 1,
  date: "2025-11-11",
  courts: [
    { name: "Sân 1", bookings: [{ start: "05:00", end: "08:00", status: "locked" }] },
    { name: "Sân 2", bookings: [{ start: "05:00", end: "07:30", status: "locked" }] },
    { name: "Sân 3", bookings: [{ start: "05:00", end: "08:00", status: "locked" }] },
    { name: "Sân 4", bookings: [{ start: "05:00", end: "10:00", status: "locked" }] },
    {
      name: "Sân 5",
      bookings: [
        { start: "17:00", end: "18:30", status: "booked" },
        { start: "18:30", end: "20:30", status: "booked" },
      ],
    },
  ],
  tickets: [
    {
      id: 1,
      time: "13:30 - 15:30",
      phone: "0987654321",
      masked: "*****123",
      customer: "Phạm văn A",
      paid: true,
      amount: 200000,
    },
    {
      id: 2,
      time: "15:30 - 17:30",
      phone: "0911222333",
      masked: "*****233",
      customer: "Nguyễn Thị B",
      paid: false,
      amount: 180000,
    },
    {
      id: 3,
      time: "17:30 - 19:30",
      phone: "0977333444",
      masked: "*****444",
      customer: "Trần Văn C",
      paid: true,
      amount: 250000,
    },
  ],
};

const toMinutes = (str) => {
  const [h, m] = str.split(":").map(Number);
  return h * 60 + m;
};

const rangeWithin = (range, startFilter, endFilter) => {
  const [s, e] = range.split(" - ").map((t) => toMinutes(t));
  return s >= startFilter && e <= endFilter;
};

export default function OwnerCourtStatusDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = mockCourtStatusDetail; // TODO: fetch by id when BE ready
  const [filterDate, setFilterDate] = useState(data.date);
  const [filterCourt, setFilterCourt] = useState("all");
  const [filterStart, setFilterStart] = useState("07:00");
  const [filterEnd, setFilterEnd] = useState("19:00");
  const [filteredCourts, setFilteredCourts] = useState(data.courts);
  const [filteredTickets, setFilteredTickets] = useState(data.tickets);
  const [selectedTicket, setSelectedTicket] = useState(data.tickets[0]);

  const applyFilters = () => {
    const startMin = toMinutes(filterStart);
    const endMin = toMinutes(filterEnd);
    const courts = (filterCourt === "all"
      ? data.courts
      : data.courts.filter((c) => c.name === filterCourt)
    ).map((c) => ({
      ...c,
      bookings: c.bookings.filter((b) => {
        const s = toMinutes(b.start);
        let e = toMinutes(b.end);
        if (e <= s) e += 24 * 60;
        return s >= startMin && e <= endMin;
      }),
    }));
    const tickets = data.tickets.filter((t) =>
      rangeWithin(t.time, startMin, endMin)
    );
    setFilteredCourts(courts);
    setFilteredTickets(tickets);
    setSelectedTicket(tickets[0] || null);
  };

  return (
    <div className="owner-status-detail">
      <div className="detail-header">
        <div>
          <p className="owner-subtitle">Tình trạng sân</p>
          <h1 className="owner-venues-title">
            Chi tiết sân {data.courts?.[0]?.name || `#${id}`}
          </h1>
        </div>
        <button type="button" className="ghost-btn" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </div>

      <div className="status-card">
        <Legend />
        <TimeGrid courts={filteredCourts} start={filterStart} end={filterEnd} step={30} />
      </div>

      <div className="status-meta">
        <div className="filters-card">
          <div className="filters">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
            <select
              value={filterCourt}
              onChange={(e) => setFilterCourt(e.target.value)}
            >
              <option value="all">Tất cả sân</option>
              {data.courts.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="time-pair">
              <input
                type="time"
                value={filterStart}
                onChange={(e) => setFilterStart(e.target.value)}
              />
              <span>-</span>
              <input
                type="time"
                value={filterEnd}
                onChange={(e) => setFilterEnd(e.target.value)}
              />
            </div>
          </div>
          <button type="button" className="filter-btn" onClick={applyFilters}>
            Lọc
          </button>
        </div>

        <div className="tickets-card">
          <div className="ticket-row ticket-head">
            <span>#</span>
            <span>Thời gian</span>
            <span>SĐT</span>
            <span />
          </div>
          <div className="ticket-list">
            {filteredTickets.map((t) => (
              <div className="ticket-row" key={t.id}>
                <span className="ticket-id">#{t.id}</span>
                <span className="ticket-time">{t.time}</span>
                <span className="ticket-phone">{t.masked}</span>
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => setSelectedTicket(t)}
                >
                  Xem chi tiết
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="user-card">
          <div className="user-field">
            <span>Tên người đặt</span>
            <strong>{selectedTicket?.customer || "---"}</strong>
          </div>
          <div className="user-field">
            <span>Số điện thoại</span>
            <strong>{selectedTicket?.phone || "---"}</strong>
          </div>
          <div className="user-field">
            <span>Thanh toán</span>
            <strong className={selectedTicket?.paid ? "paid" : "unpaid"}>
              {selectedTicket ? (selectedTicket.paid ? "Đã thanh toán" : "Chưa thanh toán") : "---"}
            </strong>
          </div>
          <div className="user-field">
            <span>Số tiền</span>
            <strong>
              {selectedTicket
                ? `${selectedTicket.amount.toLocaleString("vi-VN")} VND`
                : "---"}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
