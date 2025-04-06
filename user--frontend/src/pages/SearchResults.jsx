import React, { useState, useEffect } from "react";
import { Checkbox, InputNumber, Button, message, Select, Row, Col, Spin } from "antd";
import { useLocation, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import SearchBar from "../components/SearchBar";
import moment from "moment";
import "../styles/SearchResults.css";
import logo from "../assets/logo1.png";
import "../styles/Home.css";

// Import airline logos
import indigoLogo from "../assets/indigo.png";
import airIndiaLogo from "../assets/airindia.jpg";
import spicejetLogo from "../assets/spicejet.png";
import vistaratLogo from "../assets/vistara.jpg";
import goFirstLogo from "../assets/gofirst.jpg";

const { Option } = Select;

const airlineLogoMap = {
  "IndiGo": indigoLogo,
  "Air India": airIndiaLogo,
  "SpiceJet": spicejetLogo,
  "Vistara": vistaratLogo,
  "GoAir": goFirstLogo,
};

const SearchResults = () => {
  const [flights, setFlights] = useState([]);
  const [outboundFlights, setOutboundFlights] = useState([]);
  const [returnFlights, setReturnFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [maxPrice, setMaxPrice] = useState(null);
  const [sortBy, setSortBy] = useState("price");
  const [selectedOutboundFlight, setSelectedOutboundFlight] = useState(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState(null);
  const [passengerCount, setPassengerCount] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const departureCity = searchParams.get("departureCity");
  const arrivalCity = searchParams.get("arrivalCity");
  const departureDate = searchParams.get("departureDate");
  const returnDate = searchParams.get("returnDate");
  const passengers = parseInt(searchParams.get("passengers")) || 1;
  const tripType = searchParams.get("tripType");

  const initialValues = {
    departureCity,
    arrivalCity,
    departureDate: departureDate ? moment(departureDate) : null,
    returnDate: returnDate ? moment(returnDate) : null,
    passengers,
    tripType: tripType || "one-way",
  };

  useEffect(() => {
    setPassengerCount(passengers);
  }, [passengers]);

  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const calculateDuration = (departureTime, arrivalTime) => {
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);
    const durationInMinutes = Math.floor((arrival - departure) / (1000 * 60));
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const getAirlineLogo = (airlineName) => {
    // Normalize the airline name for matching
    const normalized = airlineName.toLowerCase().replace(/\s+/g, '');
    
    // Find the first matching key
    const matchedKey = Object.keys(airlineLogoMap).find(key => 
      key.toLowerCase().replace(/\s+/g, '') === normalized
    );
    
    return matchedKey ? airlineLogoMap[matchedKey] : indigoLogo; // Default to Indigo if no match
  };
  

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        const response = await API.get("/flights/search", {
          params: {
            departure_city: departureCity,
            arrival_city: arrivalCity,
            departure_date: departureDate,
            return_date: returnDate,
            trip_type: tripType,
            passengers,
          },
        });

        const formattedOutboundFlights = response.data.outboundFlights?.map((flight) => ({
          ...flight,
          type: "Outbound",
          departure_time: formatTime(flight.departure_time),
          arrival_time: formatTime(flight.arrival_time),
          departure_timestamp: new Date(flight.departure_time).getTime(),
          duration: calculateDuration(flight.departure_time, flight.arrival_time),
        })) || [];

        let formattedReturnFlights = [];
        if (tripType === "return") {
          formattedReturnFlights = response.data.returnFlights?.map((flight) => ({
            ...flight,
            type: "Return",
            departure_time: formatTime(flight.departure_time),
            arrival_time: formatTime(flight.arrival_time),
            departure_timestamp: new Date(flight.departure_time).getTime(),
            duration: calculateDuration(flight.departure_time, flight.arrival_time),
          })) || [];
        }

        // Set selected flights only if they exist
        if (formattedOutboundFlights.length > 0) {
          const lowestOutbound = [...formattedOutboundFlights].sort((a, b) => a.price - b.price)[0];
          setSelectedOutboundFlight(lowestOutbound);
        } else {
          setSelectedOutboundFlight(null);
        }

        if (tripType === "return") {
          if (formattedReturnFlights.length > 0) {
            const lowestReturn = [...formattedReturnFlights].sort((a, b) => a.price - b.price)[0];
            setSelectedReturnFlight(lowestReturn);
          } else {
            setSelectedReturnFlight(null);
          }
        }

        setOutboundFlights(formattedOutboundFlights);
        setReturnFlights(formattedReturnFlights);
        setFlights([...formattedOutboundFlights, ...formattedReturnFlights]);

        if (formattedOutboundFlights.length === 0 && formattedReturnFlights.length === 0) {
          message.error("No flights found for the given criteria.");
        } else if (tripType === "return" && formattedOutboundFlights.length === 0) {
          message.warning("No outbound flights found, but return flights are available.");
        } else if (tripType === "return" && formattedReturnFlights.length === 0) {
          message.warning("No return flights found, but outbound flights are available.");
        }
      } catch (err) {
        message.error("Error searching for flights. Please try again.");
        setOutboundFlights([]);
        setReturnFlights([]);
        setSelectedOutboundFlight(null);
        setSelectedReturnFlight(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [departureCity, arrivalCity, departureDate, returnDate, passengers, tripType]);

  const handleAirlineSelection = (checkedValues) => {
    setSelectedAirlines(checkedValues);
    applyFilters(checkedValues, maxPrice);
  };

  const handleMaxPriceChange = (value) => {
    setMaxPrice(value);
    applyFilters(selectedAirlines, value);
  };

  const applyFilters = (airlines, price) => {
    let filteredOutbound = flights.filter((flight) => flight.type === "Outbound");
    let filteredReturn = flights.filter((flight) => flight.type === "Return");

    if (airlines.length > 0 && !airlines.includes("All")) {
      filteredOutbound = filteredOutbound.filter((flight) => airlines.includes(flight.airline_name));
      filteredReturn = filteredReturn.filter((flight) => airlines.includes(flight.airline_name));
    }
    if (price) {
      filteredOutbound = filteredOutbound.filter((flight) => flight.price <= price);
      filteredReturn = filteredReturn.filter((flight) => flight.price <= price);
    }

    setOutboundFlights(filteredOutbound);
    setReturnFlights(filteredReturn);

    if (selectedOutboundFlight && !filteredOutbound.some(f => f.flight_id === selectedOutboundFlight.flight_id)) {
      setSelectedOutboundFlight(filteredOutbound.length > 0 ? [...filteredOutbound].sort((a, b) => a.price - b.price)[0] : null);
    }
    if (selectedReturnFlight && !filteredReturn.some(f => f.flight_id === selectedReturnFlight.flight_id)) {
      setSelectedReturnFlight(filteredReturn.length > 0 ? [...filteredReturn].sort((a, b) => a.price - b.price)[0] : null);
    }
  };

  const handleSort = (value) => {
    setSortBy(value);
    let sortedOutbound = [...outboundFlights];
    let sortedReturn = [...returnFlights];

    if (value === "price") {
      sortedOutbound.sort((a, b) => a.price - b.price);
      sortedReturn.sort((a, b) => a.price - b.price);
    } else if (value === "departure_time") {
      sortedOutbound.sort((a, b) => a.departure_timestamp - b.departure_timestamp);
      sortedReturn.sort((a, b) => a.departure_timestamp - b.departure_timestamp);
    }

    setOutboundFlights(sortedOutbound);
    setReturnFlights(sortedReturn);
  };

  const handleFlightSelection = (flight) => {
    if (flight.type === "Outbound") {
      setSelectedOutboundFlight(flight);
    } else {
      setSelectedReturnFlight(flight);
    }
  };

  const handleBookNow = () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      message.warning("Please login to continue with booking");
      navigate("/auth", { 
        state: { 
          from: `/search-results${location.search}`, // Redirect back to search results
          bookingData: {
            outboundFlight: selectedOutboundFlight,
            returnFlight: selectedReturnFlight,
            passengers: passengerCount,
            searchParams: {
              departureCity,
              arrivalCity,
              departureDate,
              returnDate,
              passengers,
              tripType,
            },
          },
        }, 
      });
      return;
    }

    if (!selectedOutboundFlight && !selectedReturnFlight) {
      message.error("Please select at least one flight to book");
      return;
    }

    if (tripType === "one-way" && selectedOutboundFlight) {
      navigate(`/booking-summary/${selectedOutboundFlight.flight_id}`, {
        state: {
          passengers: passengerCount,
          tripType: "one-way"
        }
      });
    } 
    else if (tripType === "return") {
      if (selectedOutboundFlight && selectedReturnFlight) {
        navigate(`/booking-summary/${selectedOutboundFlight.flight_id}/${selectedReturnFlight.flight_id}`, {
          state: {
            passengers: passengerCount,
            tripType: "return"
          }
        });
      }
      else if (selectedOutboundFlight) {
        const confirm = window.confirm("Only outbound flight selected. Continue with one-way trip?");
        if (confirm) {
          navigate(`/booking-summary/${selectedOutboundFlight.flight_id}`, {
            state: {
              passengers: passengerCount,
              tripType: "one-way"
            }
          });
        }
      }
      else if (selectedReturnFlight) {
        message.warning("Please select an outbound flight to complete your booking.");
      }
    }
  };

  const airlineOptions = [...new Set(flights.map((flight) => flight.airline_name))];

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    message.success("Logged out successfully!");
    window.location.reload();
  };

  return (
    <div className="search-results">
      <header className="header">
        <div className="logo" onClick={() => navigate("/")}>
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

        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : (
          <div className="results-container">
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

            <div className="flight-results">
              <h2>Search Results</h2>
              <div className="sort-section">
                <span>Sort by:</span>
                <Select defaultValue="price" style={{ width: 150 }} onChange={handleSort}>
                  <Option value="price">Price</Option>
                  <Option value="departure_time">Departure Time</Option>
                </Select>
              </div>

              <Row gutter={16}>
                <Col span={tripType === "return" ? 12 : 24}>
                  <h3>Outbound Flights</h3>
                  {outboundFlights.length > 0 ? (
                    outboundFlights.map((flight) => (
                      <div 
                        className={`flight-card ${tripType === "one-way" ? "one-way" : ""} ${selectedOutboundFlight?.flight_id === flight.flight_id ? 'selected' : ''}`}
                        key={flight.flight_id}
                        onClick={() => handleFlightSelection(flight)}
                      >
                        <div className="flight-info">
                          <div className="airline-header">
                            <div className="airline-logo">
                              <img
                                src={getAirlineLogo(flight.airline_name)}
                                alt={flight.airline_name}
                              />
                            </div>
                            <div className="airline">{flight.airline_name}</div>
                          </div>
                          
                          <div className="route-container">
                            <div className="timings-container">
                              <div className="timings">
                                <span className="icon">🛫</span>
                                <span>{flight.departure_time}</span>
                              </div>
                              <div className="city-name">{flight.departure_city}</div>
                            </div>
                            
                            <div className="arrow-container">
                              <div className="route-arrow">→</div>
                              <div className="route-duration">{flight.duration}</div>
                            </div>
                            
                            <div className="timings-container">
                              <div className="timings">
                                <span>{flight.arrival_time}</span>
                                <span className="icon">🛬</span>
                              </div>
                              <div className="city-name">{flight.arrival_city}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="price-section">
                          <div className="price">₹{flight.price}</div>
                          <div className="per-adult">per adult</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-results">No outbound flights found.</div>
                  )}
                </Col>

                {tripType === "return" && (
                  <Col span={12}>
                    <h3>Return Flights</h3>
                    {returnFlights.length > 0 ? (
                      returnFlights.map((flight) => (
                        <div 
                          className={`flight-card ${selectedReturnFlight?.flight_id === flight.flight_id ? 'selected' : ''}`}
                          key={flight.flight_id}
                          onClick={() => handleFlightSelection(flight)}
                        >
                          <div className="flight-info">
                            <div className="airline-header">
                              <div className="airline-logo">
                                <img
                                  src={getAirlineLogo(flight.airline_name)}
                                  alt={flight.airline_name}
                                />
                              </div>
                              <div className="airline">{flight.airline_name}</div>
                            </div>
                            
                            <div className="route-container">
                              <div className="timings-container">
                                <div className="timings">
                                  <span className="icon">🛫</span>
                                  <span>{flight.departure_time}</span>
                                </div>
                                <div className="city-name">{flight.departure_city}</div>
                              </div>
                              
                              <div className="arrow-container">
                                <div className="route-arrow">→</div>
                                <div className="route-duration">{flight.duration}</div>
                              </div>
                              
                              <div className="timings-container">
                                <div className="timings">
                                  <span>{flight.arrival_time}</span>
                                  <span className="icon">🛬</span>
                                </div>
                                <div className="city-name">{flight.arrival_city}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="price-section">
                            <div className="price">₹{flight.price}</div>
                            <div className="per-adult">per adult</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-results">No return flights found.</div>
                    )}
                  </Col>
                )}
              </Row>
            </div>
          </div>
        )}

        {(selectedOutboundFlight || selectedReturnFlight) && (
          <div className="bottom-flight-details">
            {selectedOutboundFlight && (
              <div 
                className="flight-detail-card"
                data-airline={selectedOutboundFlight.airline_name}
              >
                <div className="airline-logo">
                  <img
                    src={getAirlineLogo(selectedOutboundFlight.airline_name)}
                    alt={selectedOutboundFlight.airline_name}
                  />
                </div>
                <div className="flight-info">
                  <div className="flight-time">
                    <span>{selectedOutboundFlight.departure_time}</span>
                    <span className="duration">{selectedOutboundFlight.duration}</span>
                    <span>{selectedOutboundFlight.arrival_time}</span>
                  </div>
                  <div className="flight-route">
                    {selectedOutboundFlight.departure_city} → {selectedOutboundFlight.arrival_city}
                  </div>
                  <div className="flight-price">₹{selectedOutboundFlight.price}</div>
                </div>
              </div>
            )}

            {tripType === "return" && selectedReturnFlight && (
              <div 
                className="flight-detail-card"
                data-airline={selectedReturnFlight.airline_name}
              >
                <div className="airline-logo">
                  <img
                    src={getAirlineLogo(selectedReturnFlight.airline_name)}
                    alt={selectedReturnFlight.airline_name}
                  />
                </div>
                <div className="flight-info">
                  <div className="flight-time">
                    <span>{selectedReturnFlight.departure_time}</span>
                    <span className="duration">{selectedReturnFlight.duration}</span>
                    <span>{selectedReturnFlight.arrival_time}</span>
                  </div>
                  <div className="flight-route">
                    {selectedReturnFlight.departure_city} → {selectedReturnFlight.arrival_city}
                  </div>
                  <div className="flight-price">₹{selectedReturnFlight.price}</div>
                </div>
              </div>
            )}

            <Button type="primary" onClick={handleBookNow} className="book-button">
              Book Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;