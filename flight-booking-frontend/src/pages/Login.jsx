import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { Form, Input, Button, Card } from "antd";
import "../styles/Login.css"; // Custom CSS for the login page

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Redirect if already logged in (token in sessionStorage)
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      navigate("/admin", { replace: true });
    }
  }, []);

  const handleLogin = async (values) => {
    try {
      const res = await API.post("/users/login", values); // Use `values` from the form
      console.log("Login Successful:", res.data);
      sessionStorage.setItem("token", res.data.token); // Store token in sessionStorage
      navigate("/admin", { replace: true }); // Redirect to admin dashboard
    } catch (err) {
      alert("Login failed: " + err.response?.data?.error);
    }
  };

  return (
    <div className="login-container">
      {/* Background Image */}
      <div className="background-image"></div>

      {/* Login Card */}
      <Card className="login-card">
        <h2 className="welcome-message">Hi Admin</h2>
        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Login;