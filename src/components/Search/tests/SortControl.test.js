import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SortControl from "../SortControl";
import { DogsContext } from "../../../contexts/DogsContext";

describe("SortControl", () => {
  const initialSearchParams = {
    sortField: "breed",
    sortDirection: "asc",
  };

  const mockSetSearchParams = jest.fn();

  const renderComponent = (params = initialSearchParams) => {
    const contextValue = {
      searchParams: params,
      setSearchParams: mockSetSearchParams,
    };

    return render(
      <DogsContext.Provider value={contextValue}>
        <SortControl />
      </DogsContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders label and select with correct options", () => {
    renderComponent();
    
    // Check label
    expect(screen.getByText("Sort By:")).toBeInTheDocument();
    
    // Check select element and its initial value
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(select.value).toBe("breed:asc");
    
    // Check option elements and their values
    const options = select.querySelectorAll("option");
    expect(options).toHaveLength(6);
    expect(options[0]).toHaveValue("breed:asc");
    expect(options[1]).toHaveValue("breed:desc");
    expect(options[2]).toHaveValue("name:asc");
    expect(options[3]).toHaveValue("name:desc");
    expect(options[4]).toHaveValue("age:asc");
    expect(options[5]).toHaveValue("age:desc");
  });

  test("calls setSearchParams with correct values on change", () => {
    renderComponent();
    
    const select = screen.getByRole("combobox");
    
    // Simulate changing select value to "name:desc"
    fireEvent.change(select, { target: { value: "name:desc" } });
    
    // Expect setSearchParams to be called once
    expect(mockSetSearchParams).toHaveBeenCalledTimes(1);
    // Retrieve the updater function passed to setSearchParams
    const updater = mockSetSearchParams.mock.calls[0][0];
    // Assume previous state is the initialSearchParams plus potential extra props
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