import React from "react";
import "./time-grid.css";

const statusColors = {
  empty: "#f3f3f3",
  locked: "#a0a4ab",
  booked: "#c62e2e",
  selected: "#0a5f26",
};

function parseTime(str) {
  const [h, m] = str.split(":").map(Number);
  return h * 60 + m;
}

function formatTimeLabel(totalMinutes) {
  const normalized =
    ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60); // keep within a day
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function getTimeRange(start, end) {
  const startMin = parseTime(start);
  let endMin = parseTime(end);
  if (endMin <= startMin) endMin += 24 * 60;
  return { startMin, endMin };
}

function buildSlots({ start, end, step }) {
  const { startMin, endMin } = getTimeRange(start, end);
  const slots = [];
  for (let t = startMin; t < endMin; t += step) {
    slots.push({
      label: formatTimeLabel(t),
      minutes: t,
      baseStatus: "empty",
    });
  }
  return slots;
}

function applyBookings(slots, bookings) {
  const next = slots.map((s) => ({ ...s }));
  bookings.forEach((b) => {
    const start = parseTime(b.start);
    let end = parseTime(b.end);
    if (end <= start) end += 24 * 60;
    next.forEach((slot) => {
      if (slot.minutes >= start && slot.minutes < end) {
        slot.baseStatus = b.status;
      }
    });
  });
  return next;
}

export default function TimeGrid({
  courts,
  start = "05:00",
  end = "23:00",
  step = 30,
  courtColWidth = 100,
  slotWidth = 60,
}) {
  const baseSlots = buildSlots({ start, end, step });
  const gridTemplate = `${courtColWidth}px repeat(${baseSlots.length}, ${slotWidth}px)`;
  const gridWidth = courtColWidth + baseSlots.length * slotWidth;

  return (
    <div className="booking-grid">
      <div className="grid-scroll">
        <div
          className="grid-header"
          style={{
            gridTemplateColumns: gridTemplate,
            width: `${gridWidth}px`,
          }}
        >
          <div className="grid-court-col" />
          <TimeScale
            start={start}
            end={end}
            step={step}
            slotWidth={slotWidth}
            courtColWidth={courtColWidth}
            gridWidth={gridWidth}
          />
        </div>

        {courts.map((court) => {
          const slots = applyBookings(baseSlots, court.bookings || []);
          return (
            <div
              className="grid-row"
              key={court.name}
              style={{
                gridTemplateColumns: gridTemplate,
                width: `${gridWidth}px`,
              }}
            >
              <div className="grid-court-col">{court.name}</div>
              {slots.map((slot, si) => (
                <div
                  key={`${court.name}-${si}`}
                  className="grid-cell"
                  style={{ background: statusColors[slot.baseStatus] }}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TimeScale({ start, end, step, slotWidth, courtColWidth, gridWidth }) {
  const { startMin, endMin } = getTimeRange(start, end);
  const items = [];
  for (let t = startMin; t <= endMin; t += 60) {
    const offsetSlots = (t - startMin) / step;
    const label = formatTimeLabel(t);
    items.push({
      label,
      left: courtColWidth + offsetSlots * slotWidth,
    });
  }

  return (
    <div className="time-scale" style={{ width: `${gridWidth}px` }}>
      {items.map(({ label, left }) => (
        <div key={`${label}-${left}`} className="time-label" style={{ left }}>
          {label}
        </div>
      ))}
    </div>
  );
}

export function Legend() {
  return (
    <div className="booking-legend compact">
      <LegendItem color="#f3f3f3" label="Trống" />
      <LegendItem color="#a0a4ab" label="Khóa" />
      <LegendItem color="#c62e2e" label="Đã đặt" />
    </div>
  );
}

function LegendItem({ color, label, borderColor }) {
  return (
    <div className="legend-item">
      <span
        className="legend-color"
        style={{
          background: color,
          borderColor: borderColor || "var(--color-border)",
        }}
      />
      <span>{label}</span>
    </div>
  );
}
