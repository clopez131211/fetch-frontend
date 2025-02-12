import React from "react";
import { useDogs } from "../../contexts/DogsContext";

const Pagination = (): JSX.Element => {
  const { pagination, searchParams, setSearchParams } = useDogs();

  const currentFrom = Number(searchParams?.from) || 0;
  const pageSize = Number(searchParams?.size) || 25;
  const totalItems = Number(pagination?.total) || 0;

  const currentPage = Math.floor(currentFrom / pageSize) + 1;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const handlePageChange = (cursor: string | null | undefined) => {
    if (!cursor) return;

    const params = new URLSearchParams(cursor);
    const newFrom = Number(params.get("from")) || 0;

    setSearchParams((prev) => ({
      ...prev,
      from: newFrom,
    }));
  };

  return (
    <div className="pagination">
      <button
        onClick={() => handlePageChange(pagination?.prev)}
        disabled={!pagination?.prev}
      >
        Previous
      </button>

      <span>
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => handlePageChange(pagination?.next)}
        disabled={!pagination?.next}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
