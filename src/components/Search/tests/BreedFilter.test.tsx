import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import BreedFilter from "../BreedFilter";
import { useDogs } from "../../../contexts/DogsContext";

// Mock the DogsContext
jest.mock("../../../contexts/DogsContext", () => ({
  useDogs: jest.fn()
}));

describe("BreedFilter", () => {
  const mockBreeds = ["Labrador", "Poodle"];
  const mockSetSearchParams = jest.fn();
  
  const mockValue = {
    breeds: mockBreeds,
    dogs: [],
    favorites: [],
    match: null,
    locationsMap: {},
    locationResults: { zips: [], total: 0 },
    loading: false,
    error: null,
    searchParams: {
      breeds: [],
      sortField: "breed",
      sortDirection: "asc",
      size: 25,
      from: 0,
      locationFilter: {
        city: "",
        states: [],
      },
    },
    pagination: {
      total: 0,
      next: null,
      prev: null,
    },
    setSearchParams: mockSetSearchParams,
    loadBreeds: jest.fn(),
    search: jest.fn(),
    addToFavorites: jest.fn(),
    removeFromFavorites: jest.fn(),
    generateMatchFromFavorites: jest.fn(),
    setMatch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useDogs as jest.Mock).mockReturnValue(mockValue);
  });

  it("displays breed options", () => {
    render(<BreedFilter />);

    const select = screen.getByRole("listbox");
    expect(select).toBeInTheDocument();

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveValue("Labrador");
    expect(options[1]).toHaveValue("Poodle");
  });

  it("calls setSearchParams when breeds are selected", () => {
    render(<BreedFilter />);

    const select = screen.getByRole("listbox") as HTMLSelectElement;
    
    // Set selected options
    select.multiple = true;
    select.value = "";  // Reset value
    select.options[0].selected = true;  // Select first option (Labrador)

    fireEvent.change(select);

    expect(mockSetSearchParams).toHaveBeenCalled();
    const updater = mockSetSearchParams.mock.calls[0][0];
    const newState = updater(mockValue.searchParams);
    
    expect(newState).toEqual({
      ...mockValue.searchParams,
      breeds: ["Labrador"],
      from: 0
    });
  });
});