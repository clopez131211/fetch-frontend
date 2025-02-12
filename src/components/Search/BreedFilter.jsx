import React, { useEffect } from "react";
import { useDogs } from "../../contexts/DogsContext";

const BreedFilter = () => {
  const { breeds, loadBreeds, searchParams, setSearchParams } = useDogs();

  useEffect(() => {
    loadBreeds();
  }, [loadBreeds]);

  const handleBreedChange = (e) => {
    const selectedBreeds = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSearchParams((prev) => ({
      ...prev,
      breeds: selectedBreeds,
      from: 0,
    }));
  };

  return (
    <div className="breed-filter">
      <label htmlFor="breed-select">Filter by Breed:</label>
      <select
        id="breed-select"
        multiple
        value={searchParams.breeds}
        onChange={handleBreedChange}
      >
        {breeds.map((breed) => (
          <option key={breed} value={breed}>
            {breed}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BreedFilter;
