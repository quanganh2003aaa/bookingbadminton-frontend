import React, { useState, useEffect, useRef } from "react";
import "./searchBar.css";

export default function ProvinceDropdown({ selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("https://esgoo.net/api-tinhthanh/1/0.htm");
        const data = await res.json();
        if (data && data.error === 0 && Array.isArray(data.data))
          setItems(data.data);
      } catch (e) {
        console.error("Province load error", e);
      }
    }
    load();
  }, []);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div className="filter-wrap" ref={ref}>
      <button
        className={`filter ${open ? "open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {(selected && selected.full_name) || "Tỉnh/TP"} ▾
      </button>
      {open && (
        <ul className="filter-dropdown" role="listbox">
          {items.map((p) => (
            <li
              key={p.id}
              className="filter-item"
              onClick={() => {
                onSelect(p);
                setOpen(false);
              }}
            >
              {p.full_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
