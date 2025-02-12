jest.mock("../../services/api", () => ({
  login: jest.fn(),
}));

import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "../LoginPage";

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("submits form with credentials", async () => {
    const { login } = require("../../services/api");
    login.mockResolvedValue({ ok: true });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@test.com" },
    });
    fireEvent.click(screen.getByText("Login"));

    expect(login).toHaveBeenCalledWith("John", "john@test.com");
  });
});
