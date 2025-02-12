import React from "react";
import { useDogs } from "../contexts/DogsContext";

const states = ["AL", "AK", "AZ" /*... all states ...*/];

const LocationFilter = () => {
  const { searchParams, setSearchParams } = useDogs();

  const handleCityChange = (e) => {
    setSearchParams((prev) => ({
      ...prev,
      locationFilter: {
        ...prev.locationFilter,
        city: e.target.value,
      },
    }));
  };

  const handleStateChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (o) => o.value);
    setSearchParams((prev) => ({
      ...prev,
      locationFilter: {
        ...prev.locationFilter,
        states: selected,
      },
    }));
  };

  return (
    <div className="location-filter">
      <h3>Location Filter</h3>

      <div className="filter-group">
        <label>City:</label>
        <input
          type="text"
          placeholder="Enter city name"
          value={searchParams.locationFilter?.city || ""}
          onChange={handleCityChange}
        />
      </div>

      <div className="filter-group">
        <label>States:</label>
        <select
          multiple
          value={searchParams.locationFilter?.states || []}
          onChange={handleStateChange}
          className="state-select"
        >
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LocationFilter;
