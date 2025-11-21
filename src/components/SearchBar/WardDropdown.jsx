import React, { useState, useEffect, useRef } from "react";
import "./searchBar.css";

export default function WardDropdown({ districtId, selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    if (!districtId) {
      setItems([]);
      return;
    }
    let mounted = true;
    async function load() {
      try {
        const res = await fetch(
          `https://esgoo.net/api-tinhthanh/3/${districtId}.htm`
        );
        const data = await res.json();
        if (mounted && data && data.error === 0 && Array.isArray(data.data))
          setItems(data.data);
      } catch (e) {
        console.error("Ward load error", e);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [districtId]);

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
        disabled={!districtId}
      >
        {(selected && selected.full_name) || "Phường/Xã"} ▾
      </button>
      {open && (
        <ul className="filter-dropdown" role="listbox">
          {items.map((w) => (
            <li
              key={w.id}
              className="filter-item"
              onClick={() => {
                onSelect(w);
                setOpen(false);
              }}
            >
              {w.full_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
