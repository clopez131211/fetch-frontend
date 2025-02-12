import React from "react";
import { useDogs } from "../../contexts/DogsContext";

const SortControl = (): JSX.Element => {
  const { searchParams, setSearchParams } = useDogs();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
