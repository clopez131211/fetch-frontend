import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { DogsProvider } from "./contexts/DogsContext";
import LoginPage from "./pages/LoginPage";
import SearchPage from "./pages/SearchPage";

import "./index.css";
import "./App.css";
import "./Spinner.css";

function App() {
  return (
    <Router>
      <UserProvider>
        <DogsProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </DogsProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
