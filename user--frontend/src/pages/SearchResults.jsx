import React, { useState, useEffect } from "react";
import { Table, Button, message } from "antd";
import { useLocation, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import SearchBar from "../components/SearchBar";
import moment from "moment"; // Import moment
import "../styles/SearchResults.css";
import logo from "../assets/logo1.png";
import "../styles/Home.css";

const SearchResults = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
  
    // Extract search parameters from the URL
    const searchParams = new URLSearchParams(location.search);
    const departureCity = searchParams.get("departureCity");
    const arrivalCity = searchParams.get("arrivalCity");
    const departureDate = searchParams.get("departureDate");
    const returnDate = searchParams.get("returnDate");
    const passengers = searchParams.get("passengers");
  
    // Prepare initialValues for the SearchBar
    const initialValues = {
      departureCity,
      arrivalCity,
      departureDate: departureDate ? moment(departureDate) : null,
      returnDate: returnDate ? moment(returnDate) : null,
      passengers: passengers ? parseInt(passengers, 10) : 1,
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
          const outboundResponse = await API.get("/flights/search", {
            params: {
              departure_city: departureCity,
              arrival_city: arrivalCity,
              departure_date: departureDate,
              passengers: passengers,
            },
          });
  
          let returnFlights = [];
          if (returnDate) {
            const returnResponse = await API.get("/flights/search", {
              params: {
                departure_city: arrivalCity,
                arrival_city: departureCity,
                departure_date: returnDate,
                passengers: passengers,
              },
            });
            returnFlights = returnResponse.data;
          }
  
          // Format and combine flights
          const formattedOutboundFlights = outboundResponse.data.map((flight) => ({
            ...flight,
            type: "Outbound",
            departure_time: formatTime(flight.departure_time),
            arrival_time: formatTime(flight.arrival_time),
          }));
  
          const formattedReturnFlights = returnFlights.map((flight) => ({
            ...flight,
            type: "Return",
            departure_time: formatTime(flight.departure_time),
            arrival_time: formatTime(flight.arrival_time),
          }));
  
          setFlights([...formattedOutboundFlights, ...formattedReturnFlights]);
        } catch (err) {
          message.error("No flights found for the given criteria.");
          setFlights([]);
        } finally {
          setLoading(false);
        }
      };
  
      fetchFlights();
    }, [departureCity, arrivalCity, departureDate, returnDate, passengers]);

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Flight Number",
      dataIndex: "flight_number",
      key: "flight_number",
    },
    {
      title: "Airline",
      dataIndex: "airline_name",
      key: "airline_name",
    },
    {
      title: "Departure",
      dataIndex: "departure_city",
      key: "departure_city",
    },
    {
      title: "Arrival",
      dataIndex: "arrival_city",
      key: "arrival_city",
    },
    {
      title: "Departure Time",
      dataIndex: "departure_time",
      key: "departure_time",
    },
    {
      title: "Arrival Time",
      dataIndex: "arrival_time",
      key: "arrival_time",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" onClick={() => navigate(`/book-flight/${record.flight_id}`)}>
          Book Now
        </Button>
      ),
    },
  ];

  return (
    <div className="search-results">
      {/* Search Bar Section */}
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
      {/* Search Bar Section */}
      <div className="search-section">
        <SearchBar initialValues={initialValues} />
      </div>

      {/* Flight Results */}
      <div className="flight-results">
        <h2>Search Results</h2>
        <Table
          columns={columns}
          dataSource={flights}
          rowKey="flight_id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
    </div>
  );
};

export default SearchResults;