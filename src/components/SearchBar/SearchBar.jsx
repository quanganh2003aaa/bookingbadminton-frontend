import React, { useState, useRef, useEffect } from "react";
import "./searchBar.css";
import SearchInput from "./SearchInput";
import Filters from "./Filters";

const DISTANCES = ["< 1 km", "1-3 km", "3-5 km", "> 5 km"];

export default function SearchBar() {
  const [open, setOpen] = useState(null); // 'province' | 'area' | 'distance' | null
  const [selected, setSelected] = useState({
    province: null,
    area: null,
    distance: null,
  });
  const [searchText, setSearchText] = useState("");
  const rootRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(null);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // keep SearchBar as coordinator of selected values

  function toggle(key) {
    setOpen((prev) => (prev === key ? null : key));
  }

  function handleSelect(key, value) {
    setSelected((s) => {
      if (key === "province") {
        return { ...s, province: value, area: null };
      }
      return { ...s, [key]: value };
    });
  }

  return (
    <div className="searchbar" ref={rootRef}>
      <div className="container search-inner">
        <div className="searchbar-search">
          <SearchInput
            value={searchText}
            onChange={(v) => setSearchText(v)}
            onSearch={() => {
              // simple search handler: for now, log the payload
              console.log("Search triggered", {
                query: searchText,
                filters: selected,
              });
            }}
          />
        </div>

        <div className="searchbar-filter">
          <Filters selected={selected} onSelect={handleSelect} />
        </div>
      </div>
    </div>
  );
}
