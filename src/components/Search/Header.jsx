// components/Search/Header.js
import React from "react";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="welcome-text">Welcome, {user?.name}</div>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </header>
  );
};

export default Header;
