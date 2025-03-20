import React from "react";
import { Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar"; // Import the SearchBar component
import IndianCitiesCarousel from "../components/IndianCitiesCarousel";
import logo from "../assets/logo1.png";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    message.success("Logged out successfully!");
    window.location.reload();
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img src={logo} alt="Flight Booking Logo" className="logo-img" />
        </div>
        <nav className="nav-links">
          <Link to="/about-us">About Us </Link>
          <Link to="/contact-us">Contact Us </Link>
          <Link to="/help">Help</Link>
        </nav>
        <div className="auth-buttons">
          {sessionStorage.getItem("token") ? (
            <>
              <Button type="primary" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
              <Button type="primary" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button type="primary" onClick={() => navigate("/auth")}>
              Sign In / Sign Up
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="hero-section"></div>

      {/* Search Bar Section */}
      <div className="search-section">
        <SearchBar /> {/* Use the SearchBar component here */}
      </div>

      {/* Indian Cities Carousel */}
      <IndianCitiesCarousel />
    </div>
  );
};

export default Home;