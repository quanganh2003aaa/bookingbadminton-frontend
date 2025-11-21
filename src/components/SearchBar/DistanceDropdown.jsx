import React, { useState, useRef, useEffect } from "react";
import "./searchBar.css";

const DISTANCES = ["< 1 km", "1-3 km", "3-5 km", "> 5 km"];

export default function DistanceDropdown({ selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  function applyCustom() {
    const n = parseFloat(custom);
    if (!isNaN(n)) {
      onSelect(`${n} km`);
      setCustom("");
      setOpen(false);
    }
  }

  return (
    <div className="filter-wrap" ref={ref}>
      <button
        className={`filter ${open ? "open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected || "Khoảng cách"} ▾
      </button>
      {open && (
        <ul className="filter-dropdown" role="listbox">
          {DISTANCES.map((d) => (
            <li
              key={d}
              className="filter-item"
              onClick={() => {
                onSelect(d);
                setOpen(false);
              }}
            >
              {d}
            </li>
          ))}
          <li className="distance-custom">
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="km"
            />
            <button type="button" onClick={applyCustom}>
              Áp dụng
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
