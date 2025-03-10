import React, { useEffect, useState } from "react";
import { Table, Button, message, Popconfirm, Modal, Input } from "antd";
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

  const filteredFlights = flights.filter((flight) =>
    flight.airline_name.toLowerCase().includes(airlineFilter.toLowerCase())
  );

  return (
    <CSSTransition
  in={true}
  timeout={300}
  classNames="slide-in-left"
  unmountOnExit
>
    <div>
      <h2 className="text-xl font-bold mb-4">Flights Management</h2>

      <Input
        placeholder="Search by airline"
        value={airlineFilter}
        onChange={(e) => setAirlineFilter(e.target.value)}
        style={{ marginBottom: "20px", width: "200px" }}
      />

      <Button
        type="primary"
        onClick={() => {
          setEditingFlight(null);
          setIsModalOpen(true);
        }}
        style={{ marginBottom: "20px", marginLeft: "10px" }}
        icon={<PlusOutlined />}
      >
        Create Flight
      </Button>

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
          {filteredFlights.map((flight) => (
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