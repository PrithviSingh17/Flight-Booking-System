import React, { useEffect, useState } from "react";
import { Table, Button, message, Popconfirm, Modal, Input } from "antd";
import API from "../services/api";
import FlightStatusMasterForm from "../components/FlightStatusMasterForm";

function FlightStatusMaster() {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  const [statusNameFilter, setStatusNameFilter] = useState("");

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    setLoading(true);
    try {
      const res = await API.get("/flight-status-master");
      if (res.data) {
        setStatuses(res.data);
      } else {
        throw new Error("No data returned from the API");
      }
    } catch (err) {
      console.error("Error fetching flight statuses:", err);
      message.error("Failed to load flight statuses.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/flight-status-master/${id}`);
      message.success("Flight status deleted successfully.");
      fetchStatuses();
    } catch (err) {
      console.error("Error deleting flight status:", err);
      message.error("Failed to delete flight status.");
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingStatus) {
        await API.put(`/flight-status-master/${editingStatus.status_id}`, values);
        message.success("Flight status updated successfully.");
      } else {
        await API.post("/flight-status-master", values);
        message.success("Flight status created successfully.");
      }
      fetchStatuses();
      setIsModalOpen(false);
      setEditingStatus(null);
    } catch (err) {
      console.error("Error saving flight status:", err);
      message.error("Failed to save flight status.");
    }
  };

  const filteredStatuses = statuses.filter((status) =>
    status.status_name.toLowerCase().includes(statusNameFilter.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Flight Status Master</h2>

      <Input
        placeholder="Search by status name"
        value={statusNameFilter}
        onChange={(e) => setStatusNameFilter(e.target.value)}
        style={{ marginBottom: "20px", width: "200px" }}
      />

      <Button
        type="primary"
        onClick={() => {
          setEditingStatus(null);
          setIsModalOpen(true);
        }}
        style={{ marginBottom: "20px", marginLeft: "10px" }}
      >
        Create Flight Status
      </Button>

      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 p-2">Status ID</th>
            <th className="border border-gray-400 p-2">Status Name</th>
            <th className="border border-gray-400 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStatuses.map((status) => (
            <tr key={status.status_id} className="text-center">
              <td className="border border-gray-400 p-2">{status.status_id}</td>
              <td className="border border-gray-400 p-2">{status.status_name}</td>
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
                  title="Are you sure you want to delete this status?"
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
          ))}
        </tbody>
      </table>

      <Modal
        title={editingStatus ? "Edit Flight Status" : "Create Flight Status"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingStatus(null);
        }}
        footer={null}
      >
        <FlightStatusMasterForm statusData={editingStatus} onSubmit={handleFormSubmit} loading={loading} />
      </Modal>
    </div>
  );
}

export default FlightStatusMaster;