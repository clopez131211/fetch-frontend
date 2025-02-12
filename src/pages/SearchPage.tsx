import React, { useEffect } from "react";
import { useDogs } from "../contexts/DogsContext";
import BreedFilter from "../components/Search/BreedFilter";
import SortControl from "../components/Search/SortControl";
import DogList from "../components/Search/DogList";
import Pagination from "../components/Search/Pagination";
import FavoritesPanel from "../components/Search/FavoritesPanel";
import MatchModal from "../components/Search/MatchModal";
import Header from "../components/Header";

function SearchPage(): JSX.Element {
  const { loadBreeds, search, searchParams, dogs, loading, error } = useDogs();

  useEffect(() => {
    loadBreeds();
    search(searchParams);
  }, [loadBreeds, search, searchParams]);

  return (
    <div className="search-page">
      <Header />
      <div className="filters-section">
        <h1>Find Your Perfect Dog</h1>
        <BreedFilter />
        <SortControl />
      </div>

      <div className="main-content">
        <div className="content-wrapper">
          {loading ? (
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>
          ) : (
            <DogList dogs={dogs} loading={loading} error={error} />
          )}
          {error && <p className="error-message">{error}</p>}
          <div className="pagination-wrapper">
            <Pagination />
          </div>
        </div>
      </div>

      <FavoritesPanel />
      <MatchModal />
    </div>
  );
}

export default SearchPage;
