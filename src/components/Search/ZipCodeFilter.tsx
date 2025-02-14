import React, { useState } from "react";
import { useDogs } from "../../contexts/DogsContext";
import { SearchParams } from "../../services/api";

const ZipCodeFilter = (): JSX.Element => {
  const { setSearchParams } = useDogs();
  const [zipCode, setZipCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams((prev: SearchParams) => ({
      ...prev,
      from: 0,
      zipCodes: zipCode ? [zipCode] : undefined
    }));
  };

  const handleClear = () => {
    setZipCode("");
    setSearchParams((prev: SearchParams) => ({
      ...prev,
      from: 0,
      zipCodes: undefined
    }));
  };

  return (
    <div className="zip-code-filter">
      <form onSubmit={handleSubmit}>
        <label htmlFor="zip-code">Filter by ZIP Code:</label>
        <div className="zip-code-input-group">
          <input
            id="zip-code"
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            placeholder="Enter ZIP code"
            pattern="[0-9]{5}"
            title="Five digit ZIP code"
          />
          <button type="submit">Apply</button>
          <button type="button" onClick={handleClear}>Clear</button>
        </div>
      </form>
    </div>
  );
};

export default ZipCodeFilter;