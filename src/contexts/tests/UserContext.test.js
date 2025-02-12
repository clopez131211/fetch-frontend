import React, { useEffect } from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { UserProvider, useUser } from "../UserContext";
import { logout as apiLogout } from "../../services/api";

jest.mock("../../services/api", () => ({
  logout: jest.fn().mockResolvedValue({ ok: true }),
}));

// Component to capture the context's current values.
const TestComponent = ({ onRender }) => {
  const { user, setUser, logout } = useUser();
  useEffect(() => {
    onRender({ user, setUser, logout });
  }, [user, setUser, logout, onRender]);
  return null;
};

test("provides default context values", () => {
  let contextValues;
  const handleRender = (values) => {
    contextValues = values;
  };

  render(
    <UserProvider>
      <TestComponent onRender={handleRender} />
    </UserProvider>
  );

  expect(contextValues.user).toBeNull();
  expect(typeof contextValues.setUser).toBe("function");
  expect(typeof contextValues.logout).toBe("function");
});

// Component to simulate setting a user and then logging out.
const LogoutTestComponent = () => {
  const { user, setUser, logout } = useUser();
  return (
    <div>
      <div data-testid="user">{user ? user.name : "No User"}</div>
      <button onClick={() => setUser({ name: "Test User" })}>Login</button>
      <button onClick={async () => await logout()}>Logout</button>
    </div>
  );
};

test("logout resets user and calls apiLogout", async () => {
  render(
    <UserProvider>
      <LogoutTestComponent />
    </UserProvider>
  );

  // Set a user.
  fireEvent.click(screen.getByText("Login"));
  expect(screen.getByTestId("user").textContent).toBe("Test User");

  // Trigger logout.
  await act(async () => {
    fireEvent.click(screen.getByText("Logout"));
  });

  expect(apiLogout).toHaveBeenCalled();
  expect(screen.getByTestId("user").textContent).toBe("No User");
});