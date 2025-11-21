import React from "react";
import "./searchBar.css";
import { FiSearch } from "react-icons/fi";

export default function SearchInput({ value, onChange, onSearch }) {
  return (
    <div className="search-input-wrap">
      <input
        type="text"
        className="search-input"
        placeholder="Tìm kiếm..."
        aria-label="Tìm kiếm"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch && onSearch()}
      />
      <button
        className="search-icon"
        aria-label="search"
        onClick={() => onSearch && onSearch()}
      >
        <FiSearch aria-hidden="true" />
      </button>
    </div>
  );
}
