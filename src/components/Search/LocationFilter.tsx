import React, { useEffect, useState } from "react";
import { useDogs } from "../../contexts/DogsContext";
import { SearchParams } from "../../contexts/DogsContext";

const states = ["AL", "AK", "AZ", /*... all states ...*/];

interface LocationFilterProps {}

const LocationFilter: React.FC<LocationFilterProps> = () => {
  const { searchParams, setSearchParams, dogs } = useDogs();

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => ({
      ...prev,
      locationFilter: {
        ...prev.locationFilter,
        city: e.target.value,
      },
    }));
  };

  const uniqueZips = Array.from(new Set(dogs.map((dog) => dog.zip_code)));

  return (
    <div className="location-filter">
      <label htmlFor="city">City:</label>
      <input
        type="text"
        id="city"
        value={searchParams.locationFilter.city || ""}
        onChange={handleCityChange}
      />
      {/* Optionally display unique zip codes */}
      {uniqueZips.map((zip) => (
        <div key={zip}>{zip}</div>
      ))}
    </div>
  );
};

export default LocationFilter;
