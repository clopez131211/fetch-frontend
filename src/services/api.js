const BASE_URL = "https://frontend-take-home-service.fetch.com";

export async function login(name, email) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Login failed");
  return response;
}

export async function logout() {
  const response = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Logout failed");
  return response;
}

export async function fetchBreeds() {
  const response = await fetch(`${BASE_URL}/dogs/breeds`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch breeds");
  return response.json();
}

export async function searchDogs(params) {
  const queryParams = new URLSearchParams();

  params.zipCodes?.forEach((zip) => {
    queryParams.append("zipCodes", zip);
  });

  params.breeds?.forEach((breed) => queryParams.append("breeds", breed));

  if (params.sortField && params.sortDirection) {
    queryParams.append("sort", `${params.sortField}:${params.sortDirection}`);
  }

  queryParams.append("size", params.size);
  if (params.from) queryParams.append("from", params.from);

  const response = await fetch(`${BASE_URL}/dogs/search?${queryParams}`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Search failed");
  return response.json();
}

export async function fetchDogsByIds(ids) {
  const response = await fetch(`${BASE_URL}/dogs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ids),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch dogs");
  return response.json();
}

export async function generateMatch(favoriteIds) {
  const response = await fetch(`${BASE_URL}/dogs/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(favoriteIds),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to generate match");
  const data = await response.json();
  return data.match;
}

export const fetchLocations = async (zipCodes) => {
  const response = await fetch(`${BASE_URL}/locations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(zipCodes),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Location fetch failed");
  return response.json();
};

export const searchLocations = async (params) => {
  const response = await fetch(`${BASE_URL}/locations/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Location search failed");
  return response.json();
};
