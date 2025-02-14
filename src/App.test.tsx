import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import React from "react";

jest.mock("react-router-dom", () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  MemoryRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: ({ element }: { element: React.ReactNode }) => element,
  Navigate: () => <div>Redirecting...</div>,
}));

jest.mock("./contexts/UserContext", () => ({
  UserProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="user-provider">{children}</div>
  ),
}));

jest.mock("./contexts/DogsContext", () => ({
  DogsProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dogs-provider">{children}</div>
  ),
}));

jest.mock("./pages/LoginPage", () => () => <div>Login Page</div>);
jest.mock("./pages/SearchPage", () => () => <div>Search Page</div>);

const { MemoryRouter } = require("react-router-dom");

describe("App", () => {
  it("renders login page by default", () => {
    render(<App />);
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("renders providers in correct order", () => {
    render(<App />);
    const userProvider = screen.getByTestId("user-provider");
    const dogsProvider = screen.getByTestId("dogs-provider");
    expect(userProvider).toContainElement(dogsProvider);
  });

  it("navigates to login page from root", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("renders search page on /search route", () => {
    render(
      <MemoryRouter initialEntries={["/search"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Search Page")).toBeInTheDocument();
  });
});