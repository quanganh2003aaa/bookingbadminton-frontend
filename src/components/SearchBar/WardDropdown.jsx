import React, { useState, useEffect, useRef } from "react";
import { FiChevronDown } from "react-icons/fi";
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
        if (mounted && data && data.error === 0 && Array.isArray(data.data)) {
          setItems(data.data);
        }
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
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

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
        disabled={!districtId}
        type="button"
      >
        <span className={`filter-label ${selected ? "filled" : ""}`}>
          {(selected && selected.full_name) || "Phường/Xã"}
        </span>
        <FiChevronDown className="filter-caret" aria-hidden="true" />
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
