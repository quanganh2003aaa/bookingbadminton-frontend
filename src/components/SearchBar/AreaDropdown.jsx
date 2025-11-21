import React, { useState, useEffect, useRef } from "react";
import "./searchBar.css";

export default function AreaDropdown({ provinceId, selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    if (!provinceId) {
      setItems([]);
      return;
    }
    let mounted = true;
    async function load() {
      try {
        const res = await fetch(
          `https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`
        );
        const data = await res.json();
        if (mounted && data && data.error === 0 && Array.isArray(data.data))
          setItems(data.data);
      } catch (e) {
        console.error("District load error", e);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [provinceId]);

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
        disabled={!provinceId}
      >
        {(selected && selected.full_name) || "Khu vực"} ▾
      </button>
      {open && (
        <ul className="filter-dropdown" role="listbox">
          {items.map((d) => (
            <li
              key={d.id}
              className="filter-item"
              onClick={() => {
                onSelect(d);
                setOpen(false);
              }}
            >
              {d.full_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
