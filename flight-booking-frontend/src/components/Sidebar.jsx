import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white h-full p-5">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav>
        <ul>
          <li className="mb-4">
            <Link to="/flights" className="hover:text-gray-300">Flights</Link>
          </li>
          <li className="mb-4">
            <Link to="/flight-status" className="hover:text-gray-300">Flight Status</Link>
          </li>
          <li className="mb-4">
            <Link to="/users" className="hover:text-gray-300">Users</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
