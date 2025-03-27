import React, { useEffect, useState } from "react";
import { Table, Button, message, Popconfirm, Modal, Input, Pagination, Select } from "antd";
import API from "../services/api";
import FlightForm from "../components/FlightForm";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { CSSTransition } from "react-transition-group";
import "../styles/Animations.css";

function Flights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [airlineFilter, setAirlineFilter] = useState("");
  const [departureCityFilter, setDepartureCityFilter] = useState("");
  const [arrivalCityFilter, setArrivalCityFilter] = useState("");
  const [minPriceFilter, setMinPriceFilter] = useState("");
  const [maxPriceFilter, setMaxPriceFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const formatDuration = (minutes) => {
    if (typeof minutes !== "number" || isNaN(minutes)) return "0h 0m";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const res = await API.get("/flights");
      if (res.data) {
        setFlights(res.data);
      } else {
        throw new Error("No data returned from the API");
      }
    } catch (err) {
      console.error("Error fetching flights:", err);
      message.error("Failed to load flights.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/flights/${id}`);
      message.success("Flight deleted successfully.");
      fetchFlights();
    } catch (err) {
      console.error("Error deleting flight:", err);
      message.error("Failed to delete flight.");
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingFlight) {
        await API.put(`/flights/${editingFlight.flight_id}`, values);
        message.success("Flight updated successfully.");
      } else {
        await API.post("/flights/create", values);
        message.success("Flight created successfully.");
      }
      fetchFlights();
      setIsModalOpen(false);
      setEditingFlight(null);
    } catch (err) {
      console.error("Error saving flight:", err);
      message.error("Failed to save flight.");
    }
  };

  const filteredFlights = flights.filter((flight) => {
    const matchesAirline = flight.airline_name.toLowerCase().includes(airlineFilter.toLowerCase());
    const matchesDepartureCity = flight.departure_city.toLowerCase().includes(departureCityFilter.toLowerCase());
    const matchesArrivalCity = flight.arrival_city.toLowerCase().includes(arrivalCityFilter.toLowerCase());
    const matchesMinPrice = minPriceFilter === "" || flight.price >= Number(minPriceFilter);
    const matchesMaxPrice = maxPriceFilter === "" || flight.price <= Number(maxPriceFilter);
    
    return matchesAirline && matchesDepartureCity && matchesArrivalCity && matchesMinPrice && matchesMaxPrice;
  });

  // Calculate the flights to display on the current page
  const indexOfLastFlight = currentPage * pageSize;
  const indexOfFirstFlight = indexOfLastFlight - pageSize;
  const currentFlights = filteredFlights.slice(indexOfFirstFlight, indexOfLastFlight);

  // Get unique cities for filter dropdowns
  const uniqueDepartureCities = [...new Set(flights.map(flight => flight.departure_city))];
  const uniqueArrivalCities = [...new Set(flights.map(flight => flight.arrival_city))];

  return (
    <CSSTransition
      in={true}
      timeout={300}
      classNames="slide-in-left"
      unmountOnExit
    >
      <div>
        <h2 className="text-xl font-bold mb-4">Flights Management</h2>

        <div className="flex flex-wrap gap-4 mb-4">
          <Input
            placeholder="Search by airline"
            value={airlineFilter}
            onChange={(e) => setAirlineFilter(e.target.value)}
            style={{ width: "200px" }}
          />

          <Select
            placeholder="Departure City"
            value={departureCityFilter || undefined}
            onChange={(value) => setDepartureCityFilter(value)}
            style={{ width: "200px" }}
            allowClear
          >
            {uniqueDepartureCities.map(city => (
              <Select.Option key={city} value={city}>
                {city}
              </Select.Option>
            ))}
          </Select>

          <Select
            placeholder="Arrival City"
            value={arrivalCityFilter || undefined}
            onChange={(value) => setArrivalCityFilter(value)}
            style={{ width: "200px" }}
            allowClear
          >
            {uniqueArrivalCities.map(city => (
              <Select.Option key={city} value={city}>
                {city}
              </Select.Option>
            ))}
          </Select>

          

          <Button
            type="primary"
            onClick={() => {
              setEditingFlight(null);
              setIsModalOpen(true);
            }}
            icon={<PlusOutlined />}
          >
            Create Flight
          </Button>
        </div>

        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 p-2">Flight ID</th>
              <th className="border border-gray-400 p-2">Flight Number</th>
              <th className="border border-gray-400 p-2">Airline</th>
              <th className="border border-gray-400 p-2">Departure</th>
              <th className="border border-gray-400 p-2">Arrival</th>
              <th className="border border-gray-400 p-2">Departure Time</th>
              <th className="border border-gray-400 p-2">Arrival Time</th>
              <th className="border border-gray-400 p-2">Duration</th>
              <th className="border border-gray-400 p-2">Price</th>
              <th className="border border-gray-400 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentFlights.map((flight) => (
              <tr key={flight.flight_id} className="text-center">
                <td className="border border-gray-400 p-2">{flight.flight_id}</td>
                <td className="border border-gray-400 p-2">{flight.flight_number}</td>
                <td className="border border-gray-400 p-2">{flight.airline_name || "N/A"}</td>
                <td className="border border-gray-400 p-2">
                  {flight.departure_airport_name} ({flight.departure_airport_code}) - {flight.departure_city}
                </td>
                <td className="border border-gray-400 p-2">
                  {flight.arrival_airport_name} ({flight.arrival_airport_code}) - {flight.arrival_city}
                </td>
                <td className="border border-gray-400 p-2">{new Date(flight.departure_time).toLocaleString()}</td>
                <td className="border border-gray-400 p-2">{new Date(flight.arrival_time).toLocaleString()}</td>
                <td className="border border-gray-400 p-2">
                  {formatDuration(flight.duration)}
                </td>
                <td className="border border-gray-400 p-2">₹{flight.price}</td>
                <td className="border border-gray-400 p-2">
                  <Button
                    type="link"
                    onClick={() => {
                      setEditingFlight(flight);
                      setIsModalOpen(true);
                    }}
                    icon={<EditOutlined />}
                  >
                    Edit
                  </Button>
                  <Popconfirm
                    title="Are you sure you want to delete this flight?"
                    onConfirm={() => handleDelete(flight.flight_id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="link" danger icon={<DeleteOutlined />}>
                      Delete
                    </Button>
                  </Popconfirm>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredFlights.length}
            onChange={(page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            }}
          />
        </div>

        <Modal
          title={editingFlight ? "Edit Flight" : "Create Flight"}
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingFlight(null);
          }}
          footer={null}
        >
          <FlightForm flightData={editingFlight} onSubmit={handleFormSubmit} loading={loading} />
        </Modal>
      </div>
    </CSSTransition>
  );
}

export default Flights;