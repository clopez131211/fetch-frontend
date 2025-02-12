// src/pages/tests/SearchPage.test.js
jest.mock("../../services/api", () => ({
  fetchBreeds: jest.fn(),
  searchDogs: jest.fn(),
  fetchLocations: jest.fn(),
  searchLocations: jest.fn().mockResolvedValue({
    results: [],
    total: 0,
  }),
}));

import React from "react";
import { render, screen, act } from "@testing-library/react";
import { DogsContext } from "../../contexts/DogsContext";
import SearchPage from "../SearchPage";
import { UserProvider } from "../../contexts/UserContext";

// Helper to render with custom DogsContext value
const renderWithDogsContext = (value) => {
  return render(
    <UserProvider>
      <DogsContext.Provider value={value}>
        <SearchPage />
      </DogsContext.Provider>
    </UserProvider>
  );
};

describe("SearchPage", () => {
  test("displays loading spinner when loading", async () => {
    const contextValue = {
      loading: true,
      error: null,
      dogs: [],
      searchParams: {},
      breeds: [],
      loadBreeds: jest.fn(),
      favorites: [],
      locationsMap: {},
      search: jest.fn(), // ADD THIS LINE
    };

    await act(async () => {
      renderWithDogsContext(contextValue);
    });

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("displays error message when error exists", async () => {
    const errorText = "Something went wrong";
    const contextValue = {
      loading: false,
      error: errorText,
      dogs: [],
      searchParams: {},
      breeds: [],
      loadBreeds: jest.fn(),
      favorites: [],
      locationsMap: {},
      search: jest.fn(), // ADD THIS LINE
    };

    await act(async () => {
      renderWithDogsContext(contextValue);
    });

    expect(screen.getByText(errorText)).toBeInTheDocument();
  });

  test("displays search results when dogs are loaded", async () => {
    const mockDogs = [
      { id: "dog1", name: "Fido", zip_code: "12345" },
      { id: "dog2", name: "Buddy", zip_code: "67890" },
    ];
    const contextValue = {
      loading: false,
      error: null,
      dogs: mockDogs,
      searchParams: {},
      breeds: ["Labrador", "Poodle"],
      loadBreeds: jest.fn(),
      favorites: [],
      locationsMap: {
        "12345": { city: "Test City", state: "Test State", county: "Test County" },
        "67890": { city: "Another City", state: "Another State", county: "Another County" },
      },
      search: jest.fn(), // ADD THIS LINE
    };

    await act(async () => {
      renderWithDogsContext(contextValue);
    });

    mockDogs.forEach((dog) => {
      expect(screen.getByText(dog.name)).toBeInTheDocument();
    });
  });
});
