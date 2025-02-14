import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import SearchPage from "../SearchPage";
import { useDogs } from "../../contexts/DogsContext";

jest.mock("../../components/Search/BreedFilter", () => () => (
  <div data-testid="breed-filter">Breed Filter</div>
));

jest.mock("../../components/Search/SortControl", () => () => (
  <div data-testid="sort-control">Sort Control</div>
));

jest.mock("../../components/Search/DogList", () => 
  ({ dogs, loading, error }: { dogs: any[], loading: boolean, error: string | null }) => (
    <div data-testid="dog-list">
      {error && <div data-testid="error-message">{error}</div>}
      {`${dogs.length} dogs`}
    </div>
));

jest.mock("../../components/Search/Pagination", () => () => (
  <div data-testid="pagination">Pagination</div>
));

jest.mock("../../components/Search/FavoritesPanel", () => () => (
  <div data-testid="favorites-panel">Favorites Panel</div>
));

jest.mock("../../components/Search/MatchModal", () => () => (
  <div data-testid="match-modal">Match Modal</div>
));

jest.mock("../../components/Header", () => () => (
  <div data-testid="header">Header</div>
));

jest.mock("../../contexts/DogsContext", () => ({
  useDogs: jest.fn(),
}));

describe("SearchPage", () => {
  const mockLoadBreeds = jest.fn();
  const mockSearch = jest.fn();
  
  const defaultProps = {
    loadBreeds: mockLoadBreeds,
    search: mockSearch,
    searchParams: {},
    dogs: [],
    loading: false,
    error: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useDogs as jest.Mock).mockReturnValue(defaultProps);
  });

  it("renders all components when not loading", () => {
    render(<SearchPage />);
    
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByText("Find Your Perfect Dog")).toBeInTheDocument();
    expect(screen.getByTestId("breed-filter")).toBeInTheDocument();
    expect(screen.getByTestId("sort-control")).toBeInTheDocument();
    expect(screen.getByTestId("dog-list")).toBeInTheDocument();
    expect(screen.getByTestId("favorites-panel")).toBeInTheDocument();
    expect(screen.getByTestId("match-modal")).toBeInTheDocument();
  });

  it("shows spinner when loading", () => {
    (useDogs as jest.Mock).mockReturnValue({
      ...defaultProps,
      loading: true,
    });

    render(<SearchPage />);
    
    expect(screen.queryByTestId("dog-list")).not.toBeInTheDocument();
    expect(screen.getByTestId("spinner-container")).toBeInTheDocument();
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("shows error message when there is an error", () => {
    const errorMessage = "Failed to fetch dogs";
    (useDogs as jest.Mock).mockReturnValue({
      ...defaultProps,
      error: errorMessage,
      loading: false,
    });

    render(<SearchPage />);
    
    expect(screen.getByTestId("error-message")).toHaveTextContent(errorMessage);
  });

  it("displays dogs when loaded successfully", () => {
    const mockDogs = [
      { id: '1', name: 'Dog 1' },
      { id: '2', name: 'Dog 2' },
    ];

    (useDogs as jest.Mock).mockReturnValue({
      ...defaultProps,
      dogs: mockDogs,
    });

    render(<SearchPage />);
    
    expect(screen.getByTestId("dog-list")).toHaveTextContent("2 dogs");
  });

  it("calls loadBreeds and search on mount", () => {
    render(<SearchPage />);
    
    expect(mockLoadBreeds).toHaveBeenCalledTimes(1);
    expect(mockSearch).toHaveBeenCalledTimes(1);
    expect(mockSearch).toHaveBeenCalledWith(defaultProps.searchParams);
  });
});