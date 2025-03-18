import React, { useState } from "react";
import { Button, Form, DatePicker, Table, message, Select } from "antd"; // Remove InputNumber import
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/Home.css";
import IndianCitiesCarousel from "../components/IndianCitiesCarousel";
import logo from "../assets/logo1.png";

const { Option } = Select;

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
      const { departureCity, arrivalCity, departureDate, returnDate, passengers } = values;

      // Fetch outbound flights (departureCity to arrivalCity)
      const outboundResponse = await API.get("/flights/search", {
        params: {
          departure_city: departureCity,
          arrival_city: arrivalCity,
          departure_date: departureDate?.format("YYYY-MM-DD"),
          passengers: passengers,
        },
      });

      let returnFlights = [];
      if (returnDate) {
        // Fetch return flights (arrivalCity to departureCity)
        const returnResponse = await API.get("/flights/search", {
          params: {
            departure_city: arrivalCity,
            arrival_city: departureCity,
            departure_date: returnDate?.format("YYYY-MM-DD"),
            passengers: passengers,
          },
        });
        returnFlights = returnResponse.data;
      }

      // Combine outbound and return flights
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

      // Combine both outbound and return flights into a single array
      const allFlights = [...formattedOutboundFlights, ...formattedReturnFlights];

      setFlights(allFlights);
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
    window.location.reload();
  };

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

  // List of cities for dropdown
  const cities = [
    "New Delhi",
    "Bengaluru",
    "Chennai",
    "Hyderabad",
    "Kolkata",
    "Pune",
    "Ahmedabad",
    "Goa",
    "Kochi",
    "Jaipur",
    "Lucknow",
    "Bhubaneswar",
    "Srinagar",
    "Vijayawada",
    "Thiruvananthapuram",
    "Chandigarh",
    "Mumbai",
    "Siliguri",
  ];

  // Passengers options (1 to 10)
  const passengersOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img src={logo} alt="Flight Booking Logo" className="logo-img" />
        </div>

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
        <Form layout="inline" onFinish={onFinish} className="search-form">
          <Form.Item name="departureCity" rules={[{ required: true, message: "Please select departure city!" }]}>
            <Select
              showSearch
              placeholder="Departure City"
              className="search-input"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {cities.map((city) => (
                <Option key={city} value={city}>
                  {city}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="arrivalCity" rules={[{ required: true, message: "Please select arrival city!" }]}>
            <Select
              showSearch
              placeholder="Arrival City"
              className="search-input"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {cities.map((city) => (
                <Option key={city} value={city}>
                  {city}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="departureDate" rules={[{ required: true, message: "Please select departure date!" }]}>
            <DatePicker style={{ width: "100%" }} className="search-input" placeholder="Departure Date" />
          </Form.Item>
          <Form.Item name="returnDate">
            <DatePicker style={{ width: "100%" }} className="search-input" placeholder="Return Date" />
          </Form.Item>
          <Form.Item name="passengers" rules={[{ required: true, message: "Please select number of passengers!" }]}>
            <Select
              placeholder="Passengers"
              className="search-input"
            >
              {passengersOptions.map((num) => (
                <Option key={num} value={num}>
                  {num}
                </Option>
              ))}
            </Select>
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