import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";

import {
  fetchBreeds,
  searchDogs,
  fetchDogsByIds,
  generateMatch,
  fetchLocations,
  searchLocations,
} from "../services/api";

export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  breed: string;
  zip_code: string;
}

interface Location {
  zip_code: string;
  city: string;
  state: string;
  county: string;
}

export interface LocationFilter {
  city: string;
  states: string[];
}

export interface SearchParams {
  breeds: string[];
  sortField: string;
  sortDirection: string;
  size: number;
  from: number;
  locationFilter: LocationFilter;
  zipCodes?: string[];
}

export interface Pagination {
  total: number;
  next: string | null;
  prev: string | null;
}

export interface LocationResults {
  zips: string[];
  total: number;
}

export interface DogsContextType {
  breeds: string[];
  dogs: Dog[];
  favorites: Dog[];
  match: Dog | null;
  locationsMap: { [zip: string]: { city: string; state: string; county: string } };
  locationResults: LocationResults;
  loading: boolean;
  error: string | null;
  searchParams: SearchParams;
  pagination: Pagination;
  setSearchParams: Dispatch<SetStateAction<SearchParams>>;
  loadBreeds: () => Promise<void>;
  search: (params: SearchParams) => Promise<void>;
  addToFavorites: (dog: Dog) => void;
  removeFromFavorites: (dogId: string) => void;
  generateMatchFromFavorites: () => Promise<void>;
  setMatch: Dispatch<SetStateAction<Dog | null>>;
}

const DogsContext = createContext<DogsContextType | null>(null);

export const useDogs = (): DogsContextType => {
  const context = useContext(DogsContext);
  if (!context) {
    throw new Error("useDogs must be used within a DogsProvider");
  }
  return context;
};

export const DogsProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [favorites, setFavorites] = useState<Dog[]>(() => {
    const storedFavorites = localStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });
  const [match, setMatch] = useState<Dog | null>(null);
  const [locationsMap, setLocationsMap] = useState<{ [zip: string]: { city: string; state: string; county: string } }>({});
  const [locationResults, setLocationResults] = useState<LocationResults>({ zips: [], total: 0 });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>({
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
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    next: null,
    prev: null,
  });

  const loadBreeds = useCallback(async (): Promise<void> => {
    try {
      const fetchedBreeds = await fetchBreeds();
      setBreeds(fetchedBreeds);
    } catch (err) {
      setError("Failed to load dog breeds");
    }
  }, []);

  const search = useCallback(async (params: SearchParams): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const locationData = await searchLocations({
        city: params.locationFilter.city,
        states: params.locationFilter.states,
        size: 10000,
      });
      const zips = locationData.results.map((loc: Location) => loc.zip_code);
      setLocationResults({ zips, total: locationData.total });

      const searchParamsWithSort = {
        ...params,
        zipCodes: zips,
        size: params.size,
        from: params.from,
        sort: `${params.sortField}:${params.sortDirection}`,
      };

      const { resultIds, total, next, prev } = await searchDogs(searchParamsWithSort);

      const dogsData = await fetchDogsByIds(resultIds);
      setDogs(dogsData);

      const uniqueZips = Array.from(new Set(dogsData.map((dog) => dog.zip_code)));
      const locations = await fetchLocations(uniqueZips);
      setLocationsMap((prevMap) => ({
        ...prevMap,
        ...locations.reduce((acc: { [key: string]: { city: string; state: string; county: string } }, loc: Location) => {
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
    } catch (err: any) {
      setError(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const addToFavorites = (dog: Dog): void => {
    setFavorites((prev) => {
      const updatedFavorites = [...prev, dog];
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  const removeFromFavorites = (dogId: string): void => {
    setFavorites((prev) => {
      const updatedFavorites = prev.filter((dog) => dog.id !== dogId);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  const generateMatchFromFavorites = useCallback(async (): Promise<void> => {
    if (favorites.length === 0) return;
    try {
      const favIds = favorites.map((dog) => dog.id);
      const matchId = await generateMatch(favIds);

      if (matchId && typeof matchId === 'string') {
        const [matchedDog] = await fetchDogsByIds([matchId]);
        setMatch(matchedDog);
      } else {
        setError("No match found.");
        setMatch(null);
      }
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

  const value: DogsContextType = {
    breeds,
    dogs,
    favorites,
    match,
    locationsMap,
    locationResults,
    loading,
    error,
    searchParams,
    pagination,
    setSearchParams,
    loadBreeds,
    search,
    addToFavorites,
    removeFromFavorites,
    generateMatchFromFavorites,
    setMatch,
  };

  return <DogsContext.Provider value={value}>{children}</DogsContext.Provider>;
};

export const useDogsContext = (): DogsContextType => useContext(DogsContext)!;