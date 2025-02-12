import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import BreedFilter from "../BreedFilter";
import { DogsProvider } from "../../../contexts/DogsContext";

test("displays breed options", () => {
  const mockBreeds = ["Labrador", "Poodle"];

  render(
    <DogsProvider
      value={{
        breeds: mockBreeds,
        searchParams: { breeds: [] },
        setSearchParams: jest.fn(),
        loadBreeds: jest.fn(),
      }}
    >
      <BreedFilter />
    </DogsProvider>
  );

  const select = screen.getByRole("listbox");
  expect(select).toBeInTheDocument();

  const options = select.querySelectorAll("option");
  expect(options).toHaveLength(2);
  expect(options[0]).toHaveValue("Labrador");
  expect(options[1]).toHaveValue("Poodle");
});
