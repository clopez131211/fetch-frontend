import React from "react";
import { useDogs } from "../../contexts/DogsContext";
import { SearchParams } from "../../services/api";

const SortControl = (): JSX.Element => {
  const { searchParams, setSearchParams } = useDogs();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, direction] = e.target.value.split(":");
    setSearchParams((prev: SearchParams) => ({
      ...prev,
      sortField: field,
      sortDirection: direction as 'asc' | 'desc',
      from: 0,
      size: prev.size ?? 25,
      breeds: prev.breeds || [],
      locationFilter: prev.locationFilter || {
        city: "",
        states: []
      },
      zipCodes: prev.zipCodes
    }));
  };

  return (
    <div className="sort-control">
      <label>Sort by:</label>
      <select
        value={`${searchParams.sortField}:${searchParams.sortDirection}`}
        onChange={handleSortChange}
      >
        <option value="breed:asc">Breed (A-Z)</option>
        <option value="breed:desc">Breed (Z-A)</option>
        <option value="age:asc">Age (Youngest)</option>
        <option value="age:desc">Age (Oldest)</option>
        <option value="name:asc">Name (A-Z)</option>
        <option value="name:desc">Name (Z-A)</option>
      </select>
    </div>
  );
};

export default SortControl;
