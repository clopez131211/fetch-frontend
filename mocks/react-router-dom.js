import React from "react";

export const useNavigate = () => jest.fn();

export const BrowserRouter = ({ children }) => <div>{children}</div>;
export const Routes = ({ children }) => <>{children}</>;
export const Route = ({ children }) => <>{children}</>;
export const Link = ({ children }) => <>{children}</>;
export const Navigate = () => <></>;

export default {
  useNavigate,
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
};