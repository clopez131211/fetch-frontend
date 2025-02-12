import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { login as apiLogin, logout as apiLogout } from "../services/api";

// Define the User type
interface User {
  email: string;
  // Add other user properties as needed
}

// Define the context value type
interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  login: (name: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (name: string, email: string) => {
    try {
      // Call the API login passing an object with "name" and "email"
      await apiLogin({ name, email });
      // Since the API returns only an auth cookie, use the provided email
      setUser({ email }); // Use the email provided during login
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value: UserContextType = { user, setUser, login, logout };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
