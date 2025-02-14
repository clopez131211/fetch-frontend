import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ZipCodeFilter from "../ZipCodeFilter";
import { useDogs } from "../../../contexts/DogsContext";

jest.mock("../../../contexts/DogsContext", () => ({
  useDogs: jest.fn(),
}));

describe("ZipCodeFilter", () => {
  const setSearchParamsMock = jest.fn();

  beforeEach(() => {
    setSearchParamsMock.mockReset();
    (useDogs as jest.Mock).mockReturnValue({
      setSearchParams: setSearchParamsMock,
    });
  });

  test("calls setSearchParams with the entered zipcode when 'Apply' is clicked", () => {
    render(<ZipCodeFilter />);
    const input = screen.getByPlaceholderText(/Enter ZIP code/i);
    const applyButton = screen.getByRole("button", { name: /Apply/i });

    fireEvent.change(input, { target: { value: "12345" } });
    fireEvent.click(applyButton);

    expect(setSearchParamsMock).toHaveBeenCalledTimes(1);
    const updater = setSearchParamsMock.mock.calls[0][0];
    const newParams = updater({
      breeds: [],
      sortField: "",
      sortDirection: "",
      size: 25,
      from: 0,
      locationFilter: { city: "", states: [] },
    });
    expect(newParams.zipCodes).toEqual(["12345"]);
    expect(newParams.from).toEqual(0);
  });

  test("calls setSearchParams with zipCodes undefined when 'Clear' is clicked", () => {
    render(<ZipCodeFilter />);
    const clearButton = screen.getByRole("button", { name: /Clear/i });
    const input = screen.getByPlaceholderText(/Enter ZIP code/i);
    fireEvent.change(input, { target: { value: "12345" } });
    fireEvent.click(clearButton);

    expect(setSearchParamsMock).toHaveBeenCalledTimes(1);
    const updater = setSearchParamsMock.mock.calls[0][0];
    const newParams = updater({
      breeds: [],
      sortField: "",
      sortDirection: "",
      size: 25,
      from: 0,
      locationFilter: { city: "", states: [] },
    });
    expect(newParams.zipCodes).toBeUndefined();
    expect(newParams.from).toEqual(0);
    expect(input).toHaveValue("");
  });
});