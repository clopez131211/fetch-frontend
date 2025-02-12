import React, { useEffect, useState } from "react";
import { useDogs } from "../../contexts/DogsContext";
import { SearchParams } from "../../contexts/DogsContext";

const LocationFilter: React.FC = () => {
  const { searchParams, setSearchParams, dogs } = useDogs();

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCity = e.target.value;
    setSearchParams((prev) => ({
      ...prev,
      locationFilter: {
        ...prev.locationFilter,
        city: newCity,
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
        value={searchParams.locationFilter.city}
        onChange={handleCityChange}
      />
      {uniqueZips.map((zip) => (
        <div key={zip}>{zip}</div>
      ))}
    </div>
  );
};

export default LocationFilter;
