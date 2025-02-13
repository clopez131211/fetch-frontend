import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SortControl from "../SortControl";
import { SearchParams, useDogs } from "../../../contexts/DogsContext";

jest.mock("../../../contexts/DogsContext", () => ({
  useDogs: jest.fn(),
}));

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
    (useDogs as jest.Mock).mockReturnValue({
      searchParams: initialSearchParams,
      setSearchParams: mockSetSearchParams,
    });
  });

  test("renders label and select with correct options", () => {
    render(<SortControl />);

    expect(screen.getByText("Sort by:")).toBeInTheDocument();

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect((select as HTMLSelectElement).value).toBe("breed:asc");

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(6);
    expect(options[0]).toHaveValue("breed:asc");
    expect(options[1]).toHaveValue("breed:desc");
    expect(options[2]).toHaveValue("age:asc");
    expect(options[3]).toHaveValue("age:desc");
    expect(options[4]).toHaveValue("name:asc");
    expect(options[5]).toHaveValue("name:desc");
  });

  test("calls setSearchParams with correct values on change", () => {
    render(<SortControl />);

    const select = screen.getByRole("combobox");

    fireEvent.change(select, { target: { value: "name:desc" } });

    expect(mockSetSearchParams).toHaveBeenCalledTimes(1);

    const updater = mockSetSearchParams.mock.calls[0][0];
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