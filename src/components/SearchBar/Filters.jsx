import React from "react";
import "./searchBar.css";
import ProvinceDropdown from "./ProvinceDropdown";
import AreaDropdown from "./AreaDropdown";
import DistanceDropdown from "./DistanceDropdown";

export default function Filters({ selected, onSelect }) {
  return (
    <div className="search-filters">
      <div className="filter-wrap filter-fixed">
        <ProvinceDropdown
          selected={selected.province}
          onSelect={(p) => onSelect("province", p)}
        />
      </div>

      <div className="filter-wrap filter-fixed">
        <AreaDropdown
          provinceId={selected.province && selected.province.id}
          selected={selected.area}
          onSelect={(d) => onSelect("area", d)}
        />
      </div>

      <div className="filter-wrap filter-fixed">
        <DistanceDropdown
          selected={selected.distance}
          onSelect={(v) => onSelect("distance", v)}
        />
      </div>
    </div>
  );
}
