import React from "react";
import { useDogs } from "../../contexts/DogsContext";

const BreedFilter = (): JSX.Element => {
  const { breeds, searchParams, setSearchParams } = useDogs();

  const handleBreedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBreeds: string[] = Array.from(
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
        multiple
        role="listbox"
        value={searchParams.breeds}
        onChange={handleBreedChange}
        data-testid="breed-select"
      >
        {breeds.map((breed: string) => (
          <option key={breed} value={breed}>
            {breed}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BreedFilter;
