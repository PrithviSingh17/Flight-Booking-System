import React, { useEffect, useState } from "react";
import { Table, Button, Modal, message, Popconfirm } from "antd";
import API from "../services/api";
import UserForm from "../components/UserForm";

function Users() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token
        },
      });
      console.log("Users Data Fetched:", res.data); // Debug log
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      message.error("Failed to load users.");
    }
  };

  const handleDelete = async (userId) => {
    try {
      await API.delete(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token
        },
      });
      message.success("User deleted successfully.");
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      message.error("Failed to delete user.");
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      console.log("Payload being sent to backend:", values); // Debug log
      await API.post(
        "/users/register",
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      message.success("User created successfully.");
      fetchUsers();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error creating user:", err.response?.data || err.message); // Debug log
      message.error("Failed to create user.");
    }
  };
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Users Management</h2>

      {/* Create User Button */}
      <Button
        type="primary"
        onClick={() => {
          setIsModalOpen(true);
        }}
        style={{ marginBottom: "20px" }}
      >
        Create User
      </Button>

      {/* Users Table */}
      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 p-2">User ID</th>
            <th className="border border-gray-400 p-2">Name</th>
            <th className="border border-gray-400 p-2">Email</th>
            <th className="border border-gray-400 p-2">Phone</th>
            <th className="border border-gray-400 p-2">Role</th>
            <th className="border border-gray-400 p-2">Actions</th>
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
                <td className="border border-gray-400 p-2">
                  <Popconfirm
                    title="Are you sure you want to delete this user?"
                    onConfirm={() => handleDelete(user.user_id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="link" danger>
                      Delete
                    </Button>
                  </Popconfirm>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-4 text-red-500">
                No Users Found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Create User Modal */}
      <Modal
        title="Create User"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        footer={null}
      >
        <UserForm onSubmit={handleFormSubmit} />
      </Modal>
    </div>
  );
}

export default Users;