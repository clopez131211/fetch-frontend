export const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

export interface Location {
  zip_code: string;
  city: string;
  state: string;
  county: string;
  latitude?: number;
  longitude?: number;
}

export interface LocationResults {
  results: Location[];
  total: number;
}

export interface LocationSearchParams {
  city?: string;
  states?: string[];
  size?: number;
  from?: number;
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

export interface SearchResults {
  resultIds: string[];
  total: number;
  next: string | null;
  prev: string | null;
}

export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  breed: string;
  zip_code: string;
}

export interface User {
  id: string;
  name: string;
  token: string;
}

export const fetchBreeds = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/dogs/breeds`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return await response.json();
};

export const searchLocations = async (
  params: LocationSearchParams
): Promise<LocationResults> => {
  const response = await fetch(`${API_BASE_URL}/locations/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(params),
  });
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return await response.json();
};

export const searchDogs = async (
  params: SearchParams
): Promise<SearchResults> => {
  const url = new URL(`${API_BASE_URL}/dogs/search`);

  url.searchParams.append("sort", `${params.sortField}:${params.sortDirection}`);
  url.searchParams.append("size", params.size.toString());
  url.searchParams.append("from", params.from.toString());

  params.breeds.forEach((breed) => url.searchParams.append("breeds", breed));
  params.zipCodes?.forEach((zip) => url.searchParams.append("zipCodes", zip));

  const response = await fetch(url.toString(), {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return await response.json();
};

export const fetchDogsByIds = async (ids: string[]): Promise<Dog[]> => {
  const response = await fetch(`${API_BASE_URL}/dogs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(ids),
  });
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return await response.json();
};

export const fetchLocations = async (zipCodes: string[]): Promise<Location[]> => {
  const response = await fetch(`${API_BASE_URL}/locations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(zipCodes),
  });
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return await response.json();
};

export const generateMatch = async (favoriteIds: string[]): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/dogs/match`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(favoriteIds),
  });
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  const data = await response.json();
  return data.match;
};

export const login = async (credentials: { name: string; email: string }): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(credentials),
  });
  
  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`);
  }
  return;
};

export const logout = async (): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Logout failed: ${response.status}`);
  }
};