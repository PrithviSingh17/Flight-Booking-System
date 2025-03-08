import React, { useEffect, useState } from "react";
import { Table, Button, message, Popconfirm, Modal, Input } from "antd";
import API from "../services/api";
import BookingStatusMasterForm from "../components/BookingStatusMasterForm";

function BookingStatusMaster() {
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

  const handleFormSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        created_by: values.created_by || editingStatus?.created_by,
        modified_by: values.modified_by || editingStatus?.modified_by,
      };

      if (editingStatus) {
        payload.status_id = editingStatus.status_id;
        await API.put(`/booking-status/${editingStatus.status_id}`, payload);
        message.success("Status updated successfully.");
      } else {
        await API.post("/booking-status", payload);
        message.success("Status created successfully.");
      }
      fetchStatuses();
      setIsModalOpen(false);
      setEditingStatus(null);
    } catch (err) {
      console.error("Error saving status:", err);
      message.error("Failed to save status.");
    }
  };

  const handleDelete = async (statusId) => {
    try {
      await API.delete(`/booking-status/${statusId}`);
      message.success("Status deleted successfully.");
      fetchStatuses();
    } catch (err) {
      console.error("Error deleting status:", err);
      message.error("Failed to delete status.");
    }
  };

  const filteredStatuses = statuses.filter((status) =>
    status.status_name.toLowerCase().includes(statusNameFilter.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Booking Status Master</h2>

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
        style={{ marginBottom: "20px" , marginLeft: "10px"}}
      >
        Create Status
      </Button>

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
          {filteredStatuses.map((status) => (
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