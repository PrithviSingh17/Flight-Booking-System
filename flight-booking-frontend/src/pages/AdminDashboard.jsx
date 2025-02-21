import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Flights from "./Flights";
import FlightStatus from "./FlightStatus";
import Users from "./Users";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("flights");
  const navigate = useNavigate();

  // ✅ Prevent infinite loop by using empty dependency array
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true }); // Redirects only once
    }
  }, []); // 🔹 Runs only on mount

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-800 text-white p-5">
        <h2 className="text-2xl font-bold mb-5">Admin Panel</h2>
        <ul>
          <li className="mb-2 cursor-pointer" onClick={() => setActiveTab("flights")}>Flights</li>
          <li className="mb-2 cursor-pointer" onClick={() => setActiveTab("flightStatus")}>Flight Status</li>
          <li className="mb-2 cursor-pointer" onClick={() => setActiveTab("users")}>Users</li>
        </ul>
      </div>

      <div className="w-3/4 p-5">
        {activeTab === "flights" && <Flights />}
        {activeTab === "flightStatus" && <FlightStatus />}
        {activeTab === "users" && <Users />}
      </div>
    </div>
  );
}

export default AdminDashboard;
