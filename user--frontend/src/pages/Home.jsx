import React, { useState } from "react";
import { Button, Form, Input, DatePicker, Table, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "../styles/Home.css";
import IndianCitiesCarousel from "../components/IndianCitiesCarousel";
import logo from "../assets/logo1.png";

const Home = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { departureCity, arrivalCity, departureDate } = values;

      const res = await API.get("/flights/search", {
        params: {
          departure_city: departureCity,
          arrival_city: arrivalCity,
          departure_date: departureDate?.format("YYYY-MM-DD"),
        },
      });

      const formattedFlights = res.data.map((flight) => ({
        ...flight,
        departure_time: formatTime(flight.departure_time),
        arrival_time: formatTime(flight.arrival_time),
      }));

      setFlights(formattedFlights);
      setShowResults(true);
      message.success("Flights found!");
    } catch (err) {
      message.error("No flights found for the given criteria.");
      setFlights([]);
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    message.success("Logged out successfully!");
    window.location.reload(); // Refresh the page to reflect logged-out state
  };

  const columns = [
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
              Sign In /  Sign Up
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="hero-section"></div>

      {/* Search Bar Section */}
      <div className="search-section">
        <Form layout="inline" onFinish={onFinish} className="search-form">
          <Form.Item name="departureCity" rules={[{ required: true }]}>
            <Input placeholder="Departure City" className="search-input" />
          </Form.Item>
          <Form.Item name="arrivalCity" rules={[{ required: true }]}>
            <Input placeholder="Arrival City" className="search-input" />
          </Form.Item>
          <Form.Item name="departureDate" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} className="search-input" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="search-button">
              Search Flights
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* Flight Search Results */}
      {showResults && (
        <div className="flight-results">
          <Table
            columns={columns}
            dataSource={flights}
            rowKey="flight_id"
            loading={loading}
            pagination={{ pageSize: 5 }}
          />
        </div>
      )}

      {/* Indian Cities Carousel */}
      <IndianCitiesCarousel />
    </div>
  );
};

export default Home;