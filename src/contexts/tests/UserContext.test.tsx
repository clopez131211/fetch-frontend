import React, { useEffect, FC } from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { UserProvider, useUser, UserContextType } from "../UserContext";
import { logout as apiLogout } from "../../services/api";

jest.mock("../../services/api", () => ({
  logout: jest.fn().mockResolvedValue({ ok: true }),
}));

// Define the props for our test component.
interface TestComponentProps {
  onRender: (values: Pick<UserContextType, "user" | "setUser" | "logout">) => void;
}

// Component to capture the context's current values.
const TestComponent: FC<TestComponentProps> = ({ onRender }) => {
  const { user, setUser, logout } = useUser();
  useEffect(() => {
    onRender({ user, setUser, logout });
  }, [user, setUser, logout, onRender]);
  return null;
};

test("provides default context values", () => {
  let contextValues: Pick<UserContextType, "user" | "setUser" | "logout"> = {} as Pick<UserContextType, "user" | "setUser" | "logout">;
  const handleRender = (values: Pick<UserContextType, "user" | "setUser" | "logout">) => {
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
const LogoutTestComponent: FC = () => {
  const { user, setUser, logout } = useUser();
  return (
    <div>
      <div data-testid="user">{user ? (user as any).name : "No User"}</div>
      <button onClick={() => setUser({ name: "Test User" } as any)}>Login</button>
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