import React from "react";
import "./searchBar.css";
import { FiSearch } from "react-icons/fi";

export default function SearchInput({ value, onChange, onSearch }) {
  return (
    <div className="search-input-wrap">
      <FiSearch
        className="search-leading-icon"
        aria-hidden="true"
        onClick={() => onSearch && onSearch()}
      />
      <input
        type="text"
        className="search-input"
        placeholder="Tìm kiếm..."
        aria-label="Tìm kiếm"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch && onSearch()}
      />
    </div>
  );
}
