import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ Only run once when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/admin", { replace: true }); // Prevents adding a new entry to history
    }
  }, []); // 🔹 Empty dependency array ensures this runs once

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/users/login", { email, password });
      console.log("Login Response:", res.data);
      localStorage.setItem("token", res.data.token);
      navigate("/admin", { replace: true }); // Redirect after login
    } catch (err) {
      alert("Login failed: " + err.response?.data?.error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
