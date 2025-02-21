import { useEffect, useState } from "react";
import API from "../services/api";

function FlightStatus() {
  const [statuses, setStatuses] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      console.error("No token found! User must log in.");
      return;
    }

    const fetchFlightStatuses = async () => {
      try {
        const res = await API.get("/flight-status");
        console.log("Flight Status Data:", res.data); // Debug log
        setStatuses(res.data);
      } catch (err) {
        console.error("Error fetching flight statuses:", err);
      }
    };

    fetchFlightStatuses();
  }, [token]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Flight Status Management</h2>
      {token ? (
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 p-2">Status ID</th>
              <th className="border border-gray-400 p-2">Flight ID</th>
              <th className="border border-gray-400 p-2">Status</th>
              <th className="border border-gray-400 p-2">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {statuses.length > 0 ? (
              statuses.map((status) => (
                <tr key={status.status_id} className="text-center">
                  <td className="border border-gray-400 p-2">{status.status_id}</td>
                  <td className="border border-gray-400 p-2">{status.flight_id}</td>
                  <td className="border border-gray-400 p-2">{status.status_name_id}</td>
                  <td className="border border-gray-400 p-2">
                    {new Date(status.updated_at).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4">No Data Found</td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <p className="text-red-500">Unauthorized: Please log in.</p>
      )}
    </div>
  );
}

export default FlightStatus;
