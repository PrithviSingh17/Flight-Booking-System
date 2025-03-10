import React, { useEffect, useState } from "react";
import { Table, Button, message, Popconfirm, Modal, Input } from "antd";
import API from "../services/api";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { CSSTransition } from "react-transition-group";
import "../styles/Animations.css";
import BookingStatusMasterForm from "../components/BookingStatusMasterForm";

function BookingStatusMaster() {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  const [statusNameFilter, setStatusNameFilter] = useState("");
  const [formKey, setFormKey] = useState(0); // Add a key to force form reset

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
      if (editingStatus) {
        // For updates, send only the necessary fields (status_name)
        await API.put(`/booking-status/${editingStatus.status_id}`, {
          status_name: values.status_name,
        });
        message.success("Status updated successfully.");
      } else {
        // For creation, send only the necessary fields (status_name)
        await API.post("/booking-status", {
          status_name: values.status_name,
        });
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
    <CSSTransition
      in={true}
      timeout={300}
      classNames="slide-in-left"
      unmountOnExit
    >
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
            setEditingStatus(null); // Reset editingStatus to null for creation
            setIsModalOpen(true);
            setFormKey((prevKey) => prevKey + 1); // Increment key to reset form
          }}
          style={{ marginBottom: "20px", marginLeft: "10px" }}
          icon={<PlusOutlined />}
        >
          Create Booking Status
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
                      setEditingStatus(status); // Set editingStatus for editing
                      setIsModalOpen(true);
                      setFormKey((prevKey) => prevKey + 1); // Increment key to reset form
                    }}
                    icon={<EditOutlined />}
                  >
                    Edit
                  </Button>
                  <Popconfirm
                    title="Are you sure you want to delete this status?"
                    onConfirm={() => handleDelete(status.status_id)}
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
          title={editingStatus ? "Edit Status" : "Create Status"}
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingStatus(null); // Reset editingStatus when modal is closed
          }}
          footer={null}
        >
          <BookingStatusMasterForm
            key={formKey} // Use key to force form reset
            statusData={editingStatus} // Pass editingStatus to the form
            onSubmit={handleFormSubmit}
            loading={loading}
          />
        </Modal>
      </div>
    </CSSTransition>
  );
}

export default BookingStatusMaster;