import React, { useEffect, useState } from "react";
import { Table, Button, Modal, message, Popconfirm, Input } from "antd";
import API from "../services/api";
import FlightStatusForm from "../components/FlightStatusForm";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { CSSTransition } from "react-transition-group";
import "../styles/Animations.css";

function FlightStatus() {
  const [statuses, setStatuses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  const [flightNumberFilter, setFlightNumberFilter] = useState("");

  useEffect(() => {
    fetchFlightStatuses();
  }, []);

  const fetchFlightStatuses = async () => {
    try {
      const res = await API.get("/flight-status", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
        await API.put(`/flight-status/${editingStatus.status_id}`, values, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        message.success("Flight status updated successfully.");
      } else {
        await API.post("/flight-status/", values, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        message.success("Flight status created successfully.");
      }
      fetchFlightStatuses();
      setIsModalOpen(false);
      setEditingStatus(null);
    } catch (err) {
      console.error("Error saving flight status:", err);
      message.error("Failed to save flight status.");
    }
  };

  const filteredStatuses = statuses.filter((status) =>
    status.flight?.flight_number?.toLowerCase().includes(flightNumberFilter.toLowerCase())
  );

  return (
    <CSSTransition
  in={true}
  timeout={300}
  classNames="slide-in-left"
  unmountOnExit
>
    <div>
      <h2 className="text-xl font-bold mb-4">Flight Status Management</h2>

      <Input
        placeholder="Search by flight number"
        value={flightNumberFilter}
        onChange={(e) => setFlightNumberFilter(e.target.value)}
        style={{ marginBottom: "20px", width: "200px" }}
      />

      <Button
        type="primary"
        onClick={() => {
          setEditingStatus(null);
          setIsModalOpen(true);
        }}
        style={{ marginBottom: "20px",  marginLeft: "10px" }}
        icon={<PlusOutlined />}
      >
        Create Status Master
      </Button>

      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 p-2">FLightStatusID</th>
            <th className="border border-gray-400 p-2">Flight ID</th>
            <th className="border border-gray-400 p-2">Flight Number</th>
            <th className="border border-gray-400 p-2">Status</th>
            <th className="border border-gray-400 p-2">Last Updated</th>
            <th className="border border-gray-400 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStatuses.length > 0 ? (
            filteredStatuses.map((status) => (
              <tr key={status.status_id} className="text-center">
                <td className="border border-gray-400 p-2">{status.status_id}</td>
                <td className="border border-gray-400 p-2">{status.flight_id}</td>
                <td className="border border-gray-400 p-2">
                  {status.flight?.flight_number || "N/A"}
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
                    icon={<EditOutlined />}
                  >
                    Edit
                  </Button>
                  <Popconfirm
                    title="Are you sure you want to delete this flight status?"
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
    </CSSTransition>
  );
}

export default FlightStatus;