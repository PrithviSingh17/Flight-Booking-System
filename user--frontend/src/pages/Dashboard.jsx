import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get("/bookings"); // Replace with your bookings API endpoint
      setBookings(res.data);
    } catch (err) {
      message.error("Failed to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Flight Number",
      dataIndex: "flight_number",
      key: "flight_number",
    },
    {
      title: "Departure",
      dataIndex: "departure_city",
      key: "departure_city",
    },
    {
      title: "Arrival",
      dataIndex: "arrival_city",
      key: "arrival_city",
    },
    {
      title: "Booking Date",
      dataIndex: "booking_date",
      key: "booking_date",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  return (
    <div className="dashboard-container">
      <h1>Your Bookings</h1>
      <Table
        columns={columns}
        dataSource={bookings}
        rowKey="booking_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
      <Button type="primary" onClick={() => navigate("/")}>
        Back to Home
      </Button>
    </div>
  );
};

export default Dashboard;