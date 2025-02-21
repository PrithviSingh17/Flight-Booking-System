import { useEffect, useState } from "react";
import API from "../services/api";

function Flights() {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await API.get("/flights");
        console.log("Flights Data:", res.data); // Debug log
        setFlights(res.data);
      } catch (err) {
        console.error("Error fetching flights:", err);
      }
    };
    fetchFlights();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Flights Management</h2>
      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 p-2">Flight ID</th>
            <th className="border border-gray-400 p-2">Flight Number</th>
            <th className="border border-gray-400 p-2">Airline</th>
            <th className="border border-gray-400 p-2">Departure</th>
            <th className="border border-gray-400 p-2">Arrival</th>
            <th className="border border-gray-400 p-2">Departure Time</th>
            <th className="border border-gray-400 p-2">Arrival Time</th>
            <th className="border border-gray-400 p-2">Duration</th>
            <th className="border border-gray-400 p-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight) => (
            <tr key={flight.flight_id} className="text-center">
              <td className="border border-gray-400 p-2">{flight.flight_id}</td>
              <td className="border border-gray-400 p-2">{flight.flight_number}</td>
              <td className="border border-gray-400 p-2">{flight.airline_name}</td>
              <td className="border border-gray-400 p-2">
                {flight.departure_airport_name} ({flight.departure_airport_code}) - {flight.departure_city}
              </td>
              <td className="border border-gray-400 p-2">
                {flight.arrival_airport_name} ({flight.arrival_airport_code}) - {flight.arrival_city}
              </td>
              <td className="border border-gray-400 p-2">{new Date(flight.departure_time).toLocaleString()}</td>
              <td className="border border-gray-400 p-2">{new Date(flight.arrival_time).toLocaleString()}</td>
              <td className="border border-gray-400 p-2">
  {typeof flight.duration === "object"
    ? `${flight.duration.hours ?? 0}h ${flight.duration.minutes ?? 0}m`
    : flight.duration}
</td>

              <td className="border border-gray-400 p-2">₹{flight.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Flights;
