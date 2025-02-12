jest.mock("../../services/api", () => ({
  login: jest.fn(),
}));

import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "../LoginPage";
import { UserProvider } from "../../contexts/UserContext";

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("submits form with credentials", async () => {
    const { login } = require("../../services/api");
    login.mockResolvedValue({ ok: true });

    render(
      <UserProvider>
        <LoginPage />
      </UserProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@test.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(login).toHaveBeenCalledWith("John", "john@test.com");
  });
});
