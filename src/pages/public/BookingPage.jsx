import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getFieldBookingsByDay, getFieldQuantity, getVenueDetail } from "../../services/venueService";
import "./bookingPage.css";

const COURT_COL_WIDTH = 100;
const SLOT_WIDTH = 80;
const slotDuration = 30; // minutes
const DEFAULT_HOURS = { start: "05:00", end: "23:00" };

function getTodayIsoLocal() {
  const now = new Date();
  const y = now.getFullYear();
  const m = `${now.getMonth() + 1}`.padStart(2, "0");
  const d = `${now.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const toHour = (value = "") => {
  const parts = String(value).split(":");
  if (parts.length >= 2) return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
  return value;
};

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
  if (endMin <= startMin) endMin += 24 * 60; // handle overnight end like 00:00
  return { startMin, endMin };
}

function buildSlots({ start, end, step, lockUntilMin, rateRules = [] }) {
  const { startMin, endMin } = getTimeRange(start, end);
  const nowMin = typeof lockUntilMin === "number" ? lockUntilMin : -Infinity;

  const slots = [];
  for (let t = startMin; t < endMin; t += step) {
    slots.push({
      label: formatTimeLabel(t),
      minutes: t,
      baseStatus: "empty",
      selected: false,
      locked: t < nowMin,
      price: findPriceForTime(t, rateRules),
    });
  }
  return slots;
}

function findPriceForTime(minute, rateRules = []) {
  for (const rule of rateRules) {
    const start = parseTime(rule.start);
    let end = parseTime(rule.end);
    if (end <= start) end += 24 * 60; // handle overnight rate ending at 00:00
    const current = minute < start ? minute + 24 * 60 : minute;
    if (current >= start && current < end) return rule.price;
  }
  return 0;
}

function applyBookings(slots, bookings) {
  const next = slots.map((s) => ({ ...s }));
  bookings.forEach((b) => {
    const start = parseTime(b.start);
    const end = parseTime(b.end);
    next.forEach((slot) => {
      if (slot.minutes >= start && slot.minutes < end) {
        slot.baseStatus = b.status;
      }
    });
  });
  return next;
}

export default function BookingPage() {
  const todayIso = getTodayIsoLocal();
  const [searchParams] = useSearchParams();
  const fieldId = searchParams.get("fieldId") || "";
  const [operatingHours, setOperatingHours] = useState(DEFAULT_HOURS);
  const [rates, setRates] = useState([]);
  const [courtsCount, setCourtsCount] = useState(1);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingQuantity, setLoadingQuantity] = useState(false);
  const [fieldInfo, setFieldInfo] = useState(null);
  const [selectedDate, setSelectedDate] = useState(todayIso);
  const gridScrollRef = useRef(null);
  const navigate = useNavigate();

  const [baseSlots, setBaseSlots] = useState(() => {
    const lockUntil = calcLockUntil(
      slotDuration,
      todayIso,
      todayIso,
      DEFAULT_HOURS.start,
      DEFAULT_HOURS.end
    );
    return buildSlots({
      start: DEFAULT_HOURS.start,
      end: DEFAULT_HOURS.end,
      step: slotDuration,
      lockUntilMin: lockUntil,
      rateRules: [],
    });
  });

  const gridTemplate = useMemo(
    () =>
      `${COURT_COL_WIDTH}px repeat(${baseSlots.length}, ${SLOT_WIDTH}px)`,
    [baseSlots.length]
  );
  const gridWidth = useMemo(
    () => COURT_COL_WIDTH + baseSlots.length * SLOT_WIDTH,
    [baseSlots.length]
  );

  const [courts, setCourts] = useState([]);

  useEffect(() => {
    if (!fieldId) {
      setError("Khong tim thay fieldId de dat lich.");
      return;
    }
    setLoadingDetail(true);
    setError("");
    (async () => {
      try {
        const res = await getVenueDetail(fieldId);
        const detail = res?.result || res || {};
        setFieldInfo(detail);
        const slots = Array.isArray(detail.timeSlots) ? detail.timeSlots : [];
        const rateRules = slots.map((slot) => ({
          start: toHour(slot.startHour || slot.startTime || ""),
          end: toHour(slot.endHour || slot.endTime || ""),
          price: slot.price || 0,
        }));
        setRates(rateRules);
        const startHour =
          rateRules[0]?.start || toHour(detail.startTime || DEFAULT_HOURS.start);
        const endHour =
          rateRules[rateRules.length - 1]?.end ||
          toHour(detail.endTime || DEFAULT_HOURS.end);
        setOperatingHours({
          start: startHour || DEFAULT_HOURS.start,
          end: endHour || DEFAULT_HOURS.end,
        });
        setCourtsCount((prev) => {
          const qty = detail.quantity ?? detail.courts;
          if (qty && Number(qty) > 0) return Number(qty);
          return prev || 1;
        });
      } catch (err) {
        console.error(err);
        setError("Khong the tai thong tin san. Vui long thu lai.");
      } finally {
        setLoadingDetail(false);
      }
    })();
  }, [fieldId]);

  useEffect(() => {
    const lockUntil = calcLockUntil(
      slotDuration,
      selectedDate,
      todayIso,
      operatingHours.start,
      operatingHours.end
    );
    const slots = buildSlots({
      start: operatingHours.start,
      end: operatingHours.end,
      step: slotDuration,
      lockUntilMin: lockUntil,
      rateRules: rates,
    });
    setBaseSlots(slots);
  }, [selectedDate, todayIso, operatingHours, rates]);

  useEffect(() => {
    if (!fieldId) return;
    setLoadingBookings(true);
    setError("");
    (async () => {
      try {
        const res = await getFieldBookingsByDay(fieldId, selectedDate);
        const list = Array.isArray(res?.result) ? res.result : [];
        const mapped = list
          .map((b, idx) => ({
            start: toHour(b.startHour || b.start || ""),
            end: toHour(b.endHour || b.end || ""),
            status: "booked",
            id: b.id || idx,
          }))
          .filter((b) => b.start && b.end);
        setBookings(mapped);
      } catch (err) {
        console.error(err);
        setError("Khong the tai lich san trong ngay.");
        setBookings([]);
      } finally {
        setLoadingBookings(false);
      }
    })();
  }, [fieldId, selectedDate]);

  useEffect(() => {
    const template = applyBookings(baseSlots, bookings);
    const count = Math.max(1, Number(courtsCount) || 1);
    const courtsData = Array.from({ length: count }, (_, i) => ({
      name: `Sân ${i + 1}`,
      slots: template.map((s) => ({ ...s, selected: false })),
    }));
    setCourts(courtsData);
  }, [baseSlots, bookings, courtsCount]);

  useEffect(() => {
    if (!fieldId) return;
    setLoadingQuantity(true);
    (async () => {
      try {
        const res = await getFieldQuantity(fieldId);
        const qty = Number(res?.result?.quantity ?? res?.quantity ?? 0);
        setCourtsCount(qty > 0 ? qty : 1);
      } catch (err) {
        console.error(err);
        setCourtsCount((prev) => prev || 1);
      } finally {
        setLoadingQuantity(false);
      }
    })();
  }, [fieldId]);

  useEffect(() => {
    if (selectedDate !== todayIso) return;
    if (!baseSlots.length) return;
    const lockUntil = calcLockUntil(
      slotDuration,
      selectedDate,
      todayIso,
      operatingHours.start,
      operatingHours.end
    );
    const targetIdx =
      baseSlots.findIndex((s) => s.minutes >= (lockUntil ?? 0)) >= 0
        ? baseSlots.findIndex((s) => s.minutes >= (lockUntil ?? 0))
        : baseSlots.length - 1;
    const leftOffset = COURT_COL_WIDTH + targetIdx * SLOT_WIDTH;
    const el = gridScrollRef.current;
    if (el) {
      const scrollLeft = Math.max(
        leftOffset - el.clientWidth / 2 + SLOT_WIDTH / 2,
        0
      );
      el.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [baseSlots, selectedDate, todayIso]);

  const toggleSlot = (courtIdx, slotIdx) => {
    setCourts((prev) =>
      prev.map((court, i) => {
        if (i !== courtIdx) return court;
        const slot = court.slots[slotIdx];
        if (slot.baseStatus === "booked" || slot.locked) return court;
        const nextSelected = !slot.selected;
        const slots = court.slots.map((s, idx) =>
          idx === slotIdx ? { ...s, selected: nextSelected } : s
        );
        return { ...court, slots };
      })
    );
  };

  const selectedSlots = useMemo(
    () =>
      courts.flatMap((c) =>
        c.slots.filter((s) => s.selected).map((s) => s.price)
      ),
    [courts]
  );

  const totalPrice = selectedSlots.reduce((sum, p) => sum + p, 0);

  const selectionDetails = useMemo(
    () =>
      courts.flatMap((court) =>
        court.slots
          .filter((s) => s.selected)
          .map((s) => ({
            court: court.name,
            start: s.label,
            end: formatTimeLabel(s.minutes + slotDuration),
            price: s.price,
          }))
      ),
    [courts]
  );

  return (
    <div className="booking-page">
      <div className="booking-card">
        {error && <div className="error-message">{error}</div>}
        {loadingDetail && <div className="loading-more">Đang tải thông tin sân...</div>}
        {loadingBookings && <div className="loading-more">Đang tải lịch trong ngày...</div>}
        {loadingQuantity && <div className="loading-more">Đang tải số sân...</div>}
        <div className="booking-legend">
          <div className="legend-left">
            <LegendItem color={statusColors.empty} label="Trống" />
            <LegendItem color={statusColors.locked} label="Khóa" />
            <LegendItem color={statusColors.booked} label="Đã đặt" />
            <LegendItem color={statusColors.selected} label="Đang chọn" />
          </div>

          <div className="legend-right">
            <div className="booking-filter">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="booking-filter">
              <span role="img" aria-label="location">
                📍
              </span>
              <span>{fieldInfo?.name || "San cau long"}</span>
            </div>
          </div>
        </div>

        <div className="booking-grid">
          <div className="grid-scroll" ref={gridScrollRef}>
            <div
              className="grid-header"
              style={{
                gridTemplateColumns: gridTemplate,
                width: `${gridWidth}px`,
              }}
            >
              <div className="grid-court-col" />
              <TimeScale
                slots={baseSlots}
                start={operatingHours.start}
                end={operatingHours.end}
                step={slotDuration}
                slotWidth={SLOT_WIDTH}
                courtColWidth={COURT_COL_WIDTH}
                gridWidth={gridWidth}
              />
            </div>

            {courts.map((court, ci) => (
              <div
                className="grid-row"
                key={court.name}
                style={{
                  gridTemplateColumns: gridTemplate,
                  width: `${gridWidth}px`,
                }}
              >
                <div className="grid-court-col">{court.name}</div>
                {court.slots.map((slot, si) => {
                  const baseColor =
                    statusColors[slot.baseStatus] || statusColors.empty;
                  const overlayClass = slot.locked ? " cell-locked" : "";
                  const selectedClass = slot.selected ? " cell-selected" : "";
                  const isLocked = slot.locked;
                  return (
                    <div
                      key={`${court.name}-${si}`}
                      className={`grid-cell${overlayClass}${selectedClass}`}
                      style={{ background: baseColor }}
                      onClick={() => !isLocked && toggleSlot(ci, si)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (!isLocked && e.key === "Enter") toggleSlot(ci, si);
                      }}
                      aria-label={`${court.name} ${slot.label}, trạng thái ${
                        slot.baseStatus
                      }${slot.locked ? " (khóa)" : ""}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="booking-footer">
          <div className="booking-total">
            Tổng tiền: {totalPrice.toLocaleString("vi-VN")} VND
          </div>
          <button
            className="booking-action"
            type="button"
            disabled={!selectionDetails.length}
            onClick={() =>
              navigate("/paying", {
                state: {
                  fieldId,
                  date: selectedDate,
                  venueName: fieldInfo?.name || "San cau long",
                  address: fieldInfo?.address || "",
                  selections: selectionDetails,
                  total: totalPrice,
                },
              })
            }
          >
            Tiến hành đặt sân
          </button>
        </div>
      </div>
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

function TimeScale({
  slots,
  start,
  end,
  step,
  slotWidth,
  courtColWidth,
  gridWidth,
}) {
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

function calcLockUntil(stepMinutes, selectedDateIso, todayIso, start, end) {
  if (selectedDateIso !== todayIso) return null;
  const { startMin, endMin } = getTimeRange(start, end);
  const now = new Date();
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const rounded = Math.ceil((minutesNow + 30) / stepMinutes) * stepMinutes;
  const clamped = Math.min(Math.max(rounded, startMin), endMin);
  return clamped;
}
