import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import "./searchBar.css";

const DISTANCES = ["< 1 km", "1 - 3 km", "3 - 5 km", "> 5 km"];

export default function DistanceDropdown({ selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const applyCustom = () => {
    const n = parseFloat(custom);
    if (!isNaN(n)) {
      onSelect(`${n} km`);
      setCustom("");
      setOpen(false);
    }
  };

  return (
    <div
      className="filter-wrap"
      ref={ref}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className={`filter ${open ? "open" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        type="button"
      >
        <span className={`filter-label ${selected ? "filled" : ""}`}>
          {selected || "Khoảng cách"}
        </span>
        <FiChevronDown className="filter-caret" aria-hidden="true" />
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
            <div className="distance-custom-title">Khoảng cách khác</div>
            <div className="distance-custom-row">
              <div className="distance-input-group">
                <input
                  type="number"
                  min="0"
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyCustom()}
                  placeholder="Ví dụ: 2"
                />
                <span className="distance-unit">km</span>
              </div>
              <button
                type="button"
                className="distance-apply"
                onClick={applyCustom}
                disabled={Number.isNaN(parseFloat(custom))}
              >
                Áp dụng
              </button>
            </div>
          </li>
        </ul>
      )}
    </div>
  );
}
