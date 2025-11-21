import React from "react";
import "./searchBar.css";
import { FiSearch } from "react-icons/fi";

export default function SearchBar() {
  return (
    <div className="searchbar">
      <div className="container search-inner">
        <div className="search-input-wrap">
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm..."
            aria-label="Tìm kiếm"
          />
          <button className="search-icon" aria-label="search">
            <FiSearch aria-hidden="true" />
          </button>
        </div>

        <div className="search-filters">
          <button className="filter">Tỉnh/TP ▾</button>
          <button className="filter">Khu vực ▾</button>
          <button className="filter">Khoảng cách ▾</button>
        </div>
      </div>
    </div>
  );
}
