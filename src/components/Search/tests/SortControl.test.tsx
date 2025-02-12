import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SortControl from "../SortControl";
import { SearchParams, DogsContextType } from "../../../contexts/DogsContext";

// Mock the DogsContext module at the top level
jest.mock("../../../contexts/DogsContext", () => ({
  useDogs: jest.fn(),
}));

// Import the mocked useDogs
import { useDogs } from "../../../contexts/DogsContext";

describe("SortControl", () => {
  const initialSearchParams: SearchParams = {
    breeds: [],
    sortField: "breed",
    sortDirection: "asc",
    size: 25,
    from: 0,
    locationFilter: {
      city: "",
      states: [],
    },
  };

  const mockSetSearchParams = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Set up the mock implementation for useDogs
    (useDogs as jest.Mock).mockReturnValue({
      searchParams: initialSearchParams,
      setSearchParams: mockSetSearchParams,
    });
  });

  test("renders label and select with correct options", () => {
    render(<SortControl />);

    // Check label
    expect(screen.getByText("Sort By:")).toBeInTheDocument();

    // Check select element and its initial value
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect((select as HTMLSelectElement).value).toBe("breed:asc");

    // Check option elements and their values
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(6);
    expect(options[0]).toHaveValue("breed:asc");
    expect(options[1]).toHaveValue("breed:desc");
    expect(options[2]).toHaveValue("name:asc");
    expect(options[3]).toHaveValue("name:desc");
    expect(options[4]).toHaveValue("age:asc");
    expect(options[5]).toHaveValue("age:desc");
  });

  test("calls setSearchParams with correct values on change", () => {
    render(<SortControl />);

    const select = screen.getByRole("combobox");

    // Simulate changing select value to "name:desc"
    fireEvent.change(select, { target: { value: "name:desc" } });

    // Expect setSearchParams to be called once
    expect(mockSetSearchParams).toHaveBeenCalledTimes(1);
    
    // Retrieve the updater function passed to setSearchParams
    const updater = mockSetSearchParams.mock.calls[0][0];
    // Test the updater function
    const previousState = { ...initialSearchParams, extra: "value" };
    const newState = updater(previousState);

    expect(newState).toEqual({
      ...previousState,
      sortField: "name",
      sortDirection: "desc",
      from: 0,
    });
  });
});