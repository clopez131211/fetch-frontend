import React from "react";
import { useDogs } from "../../contexts/DogsContext";

const SortControl = () => {
  const { searchParams, setSearchParams } = useDogs();

  const handleSortChange = (e) => {
    const [field, direction] = e.target.value.split(":");
    setSearchParams((prev) => ({
      ...prev,
      sortField: field,
      sortDirection: direction,
      from: 0,
    }));
  };

  return (
    <div className="sort-control">
      <label>Sort By:</label>
      <select
        value={`${searchParams.sortField}:${searchParams.sortDirection}`}
        onChange={handleSortChange}
      >
        <option value="breed:asc">Breed (A-Z)</option>
        <option value="breed:desc">Breed (Z-A)</option>
        <option value="name:asc">Name (A-Z)</option>
        <option value="name:desc">Name (Z-A)</option>
        <option value="age:asc">Age (Low to High)</option>
        <option value="age:desc">Age (High to Low)</option>
      </select>
    </div>
  );
};

export default SortControl;
