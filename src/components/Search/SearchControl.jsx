import React, { useContext } from "react";
import { useDogs } from "../../contexts/DogsContext";

const SortControl = () => {
  const { searchParams, setSearchParams } = useDogs();

  const handleSortChange = (e) => {
    setSearchParams((prev) => ({
      ...prev,
      sortDirection: e.target.value,
      from: 0,
    }));
  };

  return (
    <div className="sort-control">
      <label>Sort by Breed:</label>
      <select value={searchParams.sortDirection} onChange={handleSortChange}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
};

export default SortControl;
