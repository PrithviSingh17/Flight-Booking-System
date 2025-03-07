import React, { useEffect, useState } from "react";
import { Table, Button, message, Popconfirm, Modal } from "antd";
import API from "../services/api";
import BookingStatusMasterForm from "../components/BookingStatusMasterForm";

function BookingStatusMaster() {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);

  useEffect(() => {
    fetchStatuses();
  }, []);

  // Fetch all statuses
  const fetchStatuses = async () => {
    setLoading(true);
    try {
      const res = await API.get("/booking-status");
      if (res.data) {
        setStatuses(res.data);
      } else {
        throw new Error("No data returned from the API");
      }
    } catch (err) {
      console.error("Error fetching statuses:", err);
      message.error("Failed to load statuses.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission (create or update)
  const handleFormSubmit = async (values) => {
    try {
      // Add created_by and modified_by fields to the payload
      const payload = {
        ...values,
        created_by: values.created_by || editingStatus?.created_by, // Use existing created_by for updates
        modified_by: values.modified_by || editingStatus?.modified_by, // Use existing modified_by for updates
      };

      if (editingStatus) {
        // For updates, include the status_id in the payload
        payload.status_id = editingStatus.status_id;
        await API.put(`/booking-status/${editingStatus.status_id}`, payload);
        message.success("Status updated successfully.");
      } else {
        // For creation, send the payload as is
        await API.post("/booking-status", payload);
        message.success("Status created successfully.");
      }
      fetchStatuses(); // Refresh the list
      setIsModalOpen(false);
      setEditingStatus(null);
    } catch (err) {
      console.error("Error saving status:", err);
      message.error("Failed to save status.");
    }
  };

  // Delete a status
  const handleDelete = async (statusId) => {
    try {
      await API.delete(`/booking-status/${statusId}`);
      message.success("Status deleted successfully.");
      fetchStatuses(); // Refresh the list
    } catch (err) {
      console.error("Error deleting status:", err);
      message.error("Failed to delete status.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Booking Status Management</h2>

      <Button
        type="primary"
        onClick={() => {
          setEditingStatus(null);
          setIsModalOpen(true);
        }}
        style={{ marginBottom: "20px" }}
      >
        Create Status
      </Button>

      {/* Table with custom CSS */}
      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 p-2">Status ID</th>
            <th className="border border-gray-400 p-2">Status Name</th>
            <th className="border border-gray-400 p-2">Created By</th>
            <th className="border border-gray-400 p-2">Modified By</th>
            <th className="border border-gray-400 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {statuses.map((status) => (
            <tr key={status.status_id} className="text-center">
              <td className="border border-gray-400 p-2">{status.status_id}</td>
              <td className="border border-gray-400 p-2">{status.status_name}</td>
              <td className="border border-gray-400 p-2">{status.created_by}</td>
              <td className="border border-gray-400 p-2">{status.modified_by}</td>
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

      {/* Modal for Create/Edit Status */}
      <Modal
        title={editingStatus ? "Edit Status" : "Create Status"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingStatus(null);
        }}
        footer={null}
      >
        <BookingStatusMasterForm
          statusData={editingStatus}
          onSubmit={handleFormSubmit}
          loading={loading}
        />
      </Modal>
    </div>
  );
}

export default BookingStatusMaster;