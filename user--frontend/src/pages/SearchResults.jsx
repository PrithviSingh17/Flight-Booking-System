import React, { useState, useEffect } from "react";
import { Checkbox, InputNumber, Button, message, Select } from "antd";
import { useLocation, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import SearchBar from "../components/SearchBar";
import moment from "moment";
import "../styles/SearchResults.css";
import logo from "../assets/logo1.png";
import "../styles/Home.css";

const { Option } = Select;

const SearchResults = () => {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [maxPrice, setMaxPrice] = useState(null);
  const [sortBy, setSortBy] = useState("price");
  const location = useLocation();
  const navigate = useNavigate();

  // Extract search parameters from the URL
  const searchParams = new URLSearchParams(location.search);
  const departureCity = searchParams.get("departureCity");
  const arrivalCity = searchParams.get("arrivalCity");
  const departureDate = searchParams.get("departureDate");
  const returnDate = searchParams.get("returnDate");
  const passengers = searchParams.get("passengers");
  const tripType = searchParams.get("tripType");

  // Prepare initialValues for the SearchBar
  const initialValues = {
    departureCity,
    arrivalCity,
    departureDate: departureDate ? moment(departureDate) : null,
    returnDate: returnDate ? moment(returnDate) : null,
    passengers: passengers ? parseInt(passengers, 10) : 1,
    tripType: tripType || "one-way", // Default to "one-way"
  };

  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        // Fetch flights based on search parameters
        const response = await API.get("/flights/search", {
          params: {
            departure_city: departureCity,
            arrival_city: arrivalCity,
            departure_date: departureDate,
            return_date: returnDate,
            trip_type: tripType,
            passengers: passengers,
          },
        });

        // Format and combine flights
        const formattedOutboundFlights = response.data.outboundFlights.map((flight) => ({
          ...flight,
          type: "Outbound",
          departure_time: formatTime(flight.departure_time),
          arrival_time: formatTime(flight.arrival_time),
          departure_timestamp: new Date(flight.departure_time).getTime(), // Add timestamp for sorting
        }));

        let formattedReturnFlights = [];
        if (tripType === "return" && response.data.returnFlights) {
          formattedReturnFlights = response.data.returnFlights.map((flight) => ({
            ...flight,
            type: "Return",
            departure_time: formatTime(flight.departure_time),
            arrival_time: formatTime(flight.arrival_time),
            departure_timestamp: new Date(flight.departure_time).getTime(), // Add timestamp for sorting
          }));
        }

        const allFlights = [...formattedOutboundFlights, ...formattedReturnFlights];
        setFlights(allFlights);
        setFilteredFlights(allFlights);
      } catch (err) {
        message.error("No flights found for the given criteria.");
        setFlights([]);
        setFilteredFlights([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [departureCity, arrivalCity, departureDate, returnDate, passengers, tripType]);

  // Handle airline selection
  const handleAirlineSelection = (checkedValues) => {
    setSelectedAirlines(checkedValues);
    applyFilters(checkedValues, maxPrice);
  };

  // Handle max price change
  const handleMaxPriceChange = (value) => {
    setMaxPrice(value);
    applyFilters(selectedAirlines, value);
  };

  // Apply filters
  const applyFilters = (airlines, price) => {
    let filtered = flights;
    if (airlines.length > 0 && !airlines.includes("All")) {
      filtered = filtered.filter((flight) => airlines.includes(flight.airline_name));
    }
    if (price) {
      filtered = filtered.filter((flight) => flight.price <= price);
    }
    setFilteredFlights(filtered);
  };

  // Handle sorting
  const handleSort = (value) => {
    setSortBy(value);
    let sorted = [...filteredFlights];
    if (value === "price") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (value === "departure_time") {
      sorted.sort((a, b) => a.departure_timestamp - b.departure_timestamp); // Sort by timestamp
    }
    setFilteredFlights(sorted);
  };

  // Get unique airline names
  const airlineOptions = [...new Set(flights.map((flight) => flight.airline_name))];

  // Logout function
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    message.success("Logged out successfully!");
    window.location.reload();
  };

  return (
    <div className="search-results">
      {/* Header and Search Bar Section */}
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

      <div className="search-results">
        <div className="search-section">
          <SearchBar initialValues={initialValues} />
        </div>

        <div className="results-container">
          {/* Filters Sidebar */}
          <div className="filters-sidebar">
            <h3>Filters</h3>
            <div className="filter-group">
              <h4>Airlines</h4>
              <Checkbox.Group
                options={["All", ...airlineOptions]}
                value={selectedAirlines}
                onChange={handleAirlineSelection}
              />
            </div>
            <div className="filter-group">
              <h4>Max Price</h4>
              <InputNumber
                placeholder="Enter max price"
                style={{ width: "100%" }}
                onChange={handleMaxPriceChange}
              />
            </div>
          </div>

          {/* Flight Results */}
          <div className="flight-results">
            <h2>Search Results</h2>
            <div className="sort-section">
              <span>Sort by:</span>
              <Select defaultValue="price" style={{ width: 150 }} onChange={handleSort}>
                <Option value="price">Price</Option>
                <Option value="departure_time">Departure Time</Option>
              </Select>
            </div>
            {filteredFlights.length > 0 ? (
              filteredFlights.map((flight) => (
                <div className="flight-card" key={flight.flight_id}>
                  <div className="flight-info">
                    <div className="airline">{flight.airline_name}</div>
                    <div className="route">
                      {flight.departure_city} → {flight.arrival_city}
                    </div>
                    <div className="timings">
                      {flight.departure_time} - {flight.arrival_time}
                    </div>
                  </div>
                  <div className="price">₹{flight.price}</div> {/* Updated to ₹ symbol */}
                  <Button
                    className="book-button"
                    type="primary"
                    onClick={() => navigate(`/book-flight/${flight.flight_id}`)}
                  >
                    Book Now
                  </Button>
                </div>
              ))
            ) : (
              <div className="no-results">No flights found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;