import React, { useEffect, useState } from "react";
import { Table, Button, message, Popconfirm, Modal, Input } from "antd";
import API from "../services/api";
import AirportForm from "../components/AirportForm";

function Airports() {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAirport, setEditingAirport] = useState(null);
  const [cityFilter, setCityFilter] = useState("");

  useEffect(() => {
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    setLoading(true);
    try {
      const res = await API.get("/airports/airports");
      if (res.data) {
        setAirports(res.data);
      } else {
        throw new Error("No data returned from the API");
      }
    } catch (err) {
      console.error("Error fetching airports:", err);
      message.error("Failed to load airports.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (airportCode) => {
    try {
      await API.delete(`/airports/airports/${airportCode}`);
      message.success("Airport deleted successfully.");
      fetchAirports();
    } catch (err) {
      console.error("Error deleting airport:", err);
      message.error("Failed to delete airport.");
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingAirport) {
        await API.put(`/airports/airports/${editingAirport.airport_code}`, values);
        message.success("Airport updated successfully.");
      } else {
        await API.post("/airports/airports", values);
        message.success("Airport created successfully.");
      }
      fetchAirports();
      setIsModalOpen(false);
      setEditingAirport(null);
    } catch (err) {
      console.error("Error saving airport:", err);
      message.error("Failed to save airport.");
    }
  };

  const filteredAirports = airports.filter((airport) =>
    airport.city.toLowerCase().includes(cityFilter.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Airports Management</h2>

      <Input
        placeholder="Search by city"
        value={cityFilter}
        onChange={(e) => setCityFilter(e.target.value)}
        style={{ marginBottom: "20px", width: "200px" }}
      />

      <Button
        type="primary"
        onClick={() => {
          setEditingAirport(null);
          setIsModalOpen(true);
        }}
        style={{ marginBottom: "20px", marginLeft: "10px"}}
      >
        Create Airport
      </Button>

      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 p-2">Airport Code</th>
            <th className="border border-gray-400 p-2">Airport Name</th>
            <th className="border border-gray-400 p-2">City</th>
            <th className="border border-gray-400 p-2">State</th>
            <th className="border border-gray-400 p-2">Country</th>
            <th className="border border-gray-400 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAirports.map((airport) => (
            <tr key={airport.airport_code} className="text-center">
              <td className="border border-gray-400 p-2">{airport.airport_code}</td>
              <td className="border border-gray-400 p-2">{airport.airport_name}</td>
              <td className="border border-gray-400 p-2">{airport.city}</td>
              <td className="border border-gray-400 p-2">{airport.state}</td>
              <td className="border border-gray-400 p-2">{airport.country}</td>
              <td className="border border-gray-400 p-2">
                <Button
                  type="link"
                  onClick={() => {
                    setEditingAirport(airport);
                    setIsModalOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Popconfirm
                  title="Are you sure you want to delete this airport?"
                  onConfirm={() => handleDelete(airport.airport_code)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" danger>
                    Delete
                  </Button>
                </Popconfirm>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        title={editingAirport ? "Edit Airport" : "Create Airport"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingAirport(null);
        }}
        footer={null}
      >
        <AirportForm airportData={editingAirport} onSubmit={handleFormSubmit} loading={loading} />
      </Modal>
    </div>
  );
}

export default Airports;