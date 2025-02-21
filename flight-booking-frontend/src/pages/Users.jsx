import { useEffect, useState } from "react";
import API from "../services/api";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Fetching Users...");
        const res = await API.get("/users");
        console.log("Users Data Fetched:", res.data); // Debug log
        if (Array.isArray(res.data)) {
          setUsers(res.data); // ✅ Ensure data is an array
        } else {
          console.error("Unexpected API response format:", res.data);
        }
      } catch (err) {
        console.error("Error fetching users:", err.response?.data || err.message);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Users Management</h2>
      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 p-2">User ID</th>
            <th className="border border-gray-400 p-2">Name</th>
            <th className="border border-gray-400 p-2">Email</th>
            <th className="border border-gray-400 p-2">Phone</th>
            <th className="border border-gray-400 p-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.user_id} className="text-center">
                <td className="border border-gray-400 p-2">{user.user_id || "N/A"}</td>
                <td className="border border-gray-400 p-2">{user.name || "N/A"}</td>
                <td className="border border-gray-400 p-2">{user.email || "N/A"}</td>
                <td className="border border-gray-400 p-2">{user.phone || "N/A"}</td>
                <td className="border border-gray-400 p-2">{user.role || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-4 text-red-500">No Users Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
