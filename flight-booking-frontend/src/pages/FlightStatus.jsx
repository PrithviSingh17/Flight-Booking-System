import React, { useEffect, useState } from "react";
import { Table, Button, Modal, message, Popconfirm } from "antd";
import API from "../services/api";
import FlightStatusForm from "../components/FlightStatusForm";

function FlightStatus() {
  const [statuses, setStatuses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);

  useEffect(() => {
    fetchFlightStatuses();
  }, []);

  const fetchFlightStatuses = async () => {
    try {
      const res = await API.get("/flight-status", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token
        },
      });
      console.log("Flight Status Data:", res.data); // Debug log
      setStatuses(res.data);
    } catch (err) {
      console.error("Error fetching flight statuses:", err);
      message.error("Failed to load flight statuses.");
    }
  };

  const handleDelete = async (statusId) => {
    try {
      await API.delete(`/flight-status/${statusId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token
        },
      });
      message.success("Flight status deleted successfully.");
      fetchFlightStatuses();
    } catch (err) {
      console.error("Error deleting flight status:", err);
      message.error("Failed to delete flight status.");
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingStatus) {
        // Update flight status
        await API.put(`/flight-status/${editingStatus.status_id}`, values, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token
          },
        });
        message.success("Flight status updated successfully.");
      } else {
        // Create flight status
        await API.post(
          "/flight-status/", // Use the correct endpoint
          values,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token
            },
          }
        );
        message.success("Flight status created successfully.");
      }
      fetchFlightStatuses(); // Refresh the data
      setIsModalOpen(false); // Close the modal
      setEditingStatus(null); // Reset editing state
    } catch (err) {
      console.error("Error saving flight status:", err);
      message.error("Failed to save flight status.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Flight Status Management</h2>

      {/* Create Flight Status Button */}
      <Button
        type="primary"
        onClick={() => {
          setEditingStatus(null);
          setIsModalOpen(true);
        }}
        style={{ marginBottom: "20px" }}
      >
        Create Flight Status
      </Button>

      {/* Flight Status Table */}
      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 p-2">Status ID</th>
            <th className="border border-gray-400 p-2">Flight ID</th>
            <th className="border border-gray-400 p-2">Airline Number</th>
            <th className="border border-gray-400 p-2">Status</th>
            <th className="border border-gray-400 p-2">Last Updated</th>
            <th className="border border-gray-400 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {statuses.length > 0 ? (
            statuses.map((status) => (
              <tr key={status.status_id} className="text-center">
                <td className="border border-gray-400 p-2">{status.status_id}</td>
                <td className="border border-gray-400 p-2">{status.flight_id}</td>
                <td className="border border-gray-400 p-2">
                  {status.Flight?.flight_number || "N/A"}
                </td>
                <td className="border border-gray-400 p-2">{status.status_name_id}</td>
                <td className="border border-gray-400 p-2">
                  {new Date(status.updated_at).toLocaleString()}
                </td>
                <td className="border border-gray-400 p-2">
                  <Button
                    type="link"
                    onClick={() => {
                      setEditingStatus(status);
                      setIsModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Popconfirm
                    title="Are you sure you want to delete this flight status?"
                    onConfirm={() => handleDelete(status.status_id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="link" danger>
                      Delete
                    </Button>
                  </Popconfirm>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-4">
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Create/Edit Flight Status Modal */}
      <Modal
        title={editingStatus ? "Edit Flight Status" : "Create Flight Status"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingStatus(null);
        }}
        footer={null}
      >
        <FlightStatusForm
          onSubmit={handleFormSubmit}
          initialValues={editingStatus}
        />
      </Modal>
    </div>
  );
}

export default FlightStatus;