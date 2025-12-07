import React from "react";
import "./searchBar.css";
import ProvinceDropdown from "./ProvinceDropdown";
import AreaDropdown from "./AreaDropdown";
import DistanceDropdown from "./DistanceDropdown";

export default function Filters({ selected, onSelect }) {
  return (
    <div className="search-filters">
      <ProvinceDropdown
        selected={selected.province}
        onSelect={(p) => onSelect("province", p)}
      />

      <AreaDropdown
        provinceId={selected.province && selected.province.id}
        selected={selected.area}
        onSelect={(d) => onSelect("area", d)}
      />

      <DistanceDropdown
        selected={selected.distance}
        onSelect={(v) => onSelect("distance", v)}
      />
    </div>
  );
}
