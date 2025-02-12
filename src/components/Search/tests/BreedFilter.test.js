import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import BreedFilter from "../BreedFilter";
import { DogsContext } from "../../../contexts/DogsContext";

test("displays breed options", () => {
  const mockBreeds = ["Labrador", "Poodle"];
  const mockValue = {
    breeds: mockBreeds,
    searchParams: { breeds: [] },
    setSearchParams: jest.fn(),
    loadBreeds: jest.fn(),
  };

  render(
    <DogsContext.Provider value={mockValue}>
      <BreedFilter />
    </DogsContext.Provider>
  );

  const select = screen.getByRole("listbox");
  expect(select).toBeInTheDocument();

  const options = select.querySelectorAll("option");
  expect(options).toHaveLength(2);
  expect(options[0]).toHaveValue("Labrador");
  expect(options[1]).toHaveValue("Poodle");
});
