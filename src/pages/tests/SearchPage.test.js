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

import { render, screen } from "@testing-library/react";
import { DogsProvider } from "../../contexts/DogsContext";
import SearchPage from "../SearchPage";

describe("SearchPage", () => {
  test("displays loading spinner", () => {
    render(
      <DogsProvider
        value={{
          loading: true,
          error: null,
          dogs: [],
          searchParams: {},
        }}
      >
        <SearchPage />
      </DogsProvider>
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
