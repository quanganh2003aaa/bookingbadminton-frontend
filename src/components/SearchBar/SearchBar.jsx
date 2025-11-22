import React, { useState, useRef } from "react";
import { FiSliders } from "react-icons/fi";
import "./searchBar.css";
import SearchInput from "./SearchInput";
import Filters from "./Filters";

export default function SearchBar() {
  const [selected, setSelected] = useState({
    province: null,
    area: null,
    distance: null,
  });
  const [searchText, setSearchText] = useState("");
  const rootRef = useRef(null);

  const handleSelect = (key, value) => {
    setSelected((s) => {
      if (key === "province") {
        return { ...s, province: value, area: null };
      }
      return { ...s, [key]: value };
    });
  };

  const handleSearch = () => {
    console.log("Search triggered", {
      query: searchText,
      filters: selected,
    });
  };

  return (
    <div className="searchbar" ref={rootRef}>
      <div className="container">
        <div className="search-inner">
          <SearchInput
            value={searchText}
            onChange={(v) => setSearchText(v)}
            onSearch={handleSearch}
          />

          <button
            type="button"
            className="filter-trigger"
            aria-label="Bộ lọc"
          >
            <FiSliders />
          </button>

          <Filters selected={selected} onSelect={handleSelect} />
        </div>
      </div>
    </div>
  );
}
