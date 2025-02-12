import React, { createContext, useState, useEffect, useCallback } from "react";
import {
  fetchBreeds,
  searchDogs,
  fetchDogsByIds,
  generateMatch,
  fetchLocations,
  searchLocations,
} from "../services/api";

const DogsContext = createContext();

export const DogsProvider = ({ children }) => {
  const [breeds, setBreeds] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [match, setMatch] = useState(null);
  const [locationsMap, setLocationsMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationResults, setLocationResults] = useState({
    zips: [],
    total: 0,
  });

  const [searchParams, setSearchParams] = useState({
    breeds: [],
    sortField: "breed",
    sortDirection: "asc",
    size: 25,
    from: 0,
    locationFilter: {
      city: "",
      states: [],
    },
  });

  const [pagination, setPagination] = useState({
    total: 0,
    next: null,
    prev: null,
  });

  const loadBreeds = useCallback(async () => {
    try {
      const breeds = await fetchBreeds();
      setBreeds(breeds);
    } catch (err) {
      setError("Failed to load dog breeds");
    }
  }, []);

  const search = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);

      const locationData = await searchLocations({
        city: params.locationFilter?.city,
        states: params.locationFilter?.states,
        size: 10000,
      });

      const zips = locationData.results.map((loc) => loc.zip_code);
      setLocationResults({ zips, total: locationData.total });

      const { resultIds, total, next, prev } = await searchDogs({
        ...params,
        zipCodes: zips,
        size: params.size,
        from: params.from,
      });

      const dogs = await fetchDogsByIds(resultIds);
      setDogs(dogs);

      const uniqueZips = [...new Set(dogs.map((dog) => dog.zip_code))];
      const locations = await fetchLocations(uniqueZips);

      setLocationsMap((prev) => ({
        ...prev,
        ...locations.reduce((acc, loc) => {
          if (loc?.zip_code) {
            acc[loc.zip_code] = {
              city: loc.city,
              state: loc.state,
              county: loc.county,
            };
          }
          return acc;
        }, {}),
      }));

      setPagination({ total, next, prev });
    } catch (err) {
      setError(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const addFavorite = (dogId) => {
    setFavorites((prev) => [...prev, dogId]);
  };

  const removeFavorite = (dogId) => {
    setFavorites((prev) => prev.filter((id) => id !== dogId));
  };

  const handleGenerateMatch = useCallback(async () => {
    if (favorites.length === 0) return;

    try {
      const matchId = await generateMatch(favorites);
      const [matchedDog] = await fetchDogsByIds([matchId]);
      setMatch(matchedDog);
    } catch (err) {
      setError("Failed to generate match");
    }
  }, [favorites]);

  useEffect(() => {
    loadBreeds();
  }, [loadBreeds]);

  useEffect(() => {
    search(searchParams);
  }, [searchParams, search]);

  return (
    <DogsContext.Provider
      value={{
        breeds,
        dogs,
        favorites,
        match,
        locationsMap,
        loading,
        error,
        searchParams,
        pagination,
        setSearchParams,
        loadBreeds,
        search,
        addFavorite,
        removeFavorite,
        handleGenerateMatch,
        setMatch,
      }}
    >
      {children}
    </DogsContext.Provider>
  );
};

export const useDogs = () => React.useContext(DogsContext);
