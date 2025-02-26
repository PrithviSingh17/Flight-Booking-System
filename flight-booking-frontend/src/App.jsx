import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import "./styles/global.css"; // Import global styles

function App() {
  // Check if the user is logged in (token exists in sessionStorage)
  const isLoggedIn = !!sessionStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Redirect root path to /login or /admin based on login status */}
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/admin" /> : <Navigate to="/login" />}
        />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;