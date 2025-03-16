import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, Card, message, Form } from "antd";
import LoginForm from "../components/LoginForm";
import UserForm from "../components/UserForm";
import API from "../services/api";
import "../styles/Auth.css";

const { TabPane } = Tabs;

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [loginForm] = Form.useForm(); // Form instance for login
  const [registerForm] = Form.useForm(); // Form instance for registration
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      const res = await API.post("/users/login", values);
      sessionStorage.setItem("token", res.data.token);
      message.success("Login successful!");
      navigate("/"); // Redirect to home page after login
    } catch (err) {
      message.error("Login failed: " + err.response?.data?.error);
    }
  };

  const handleRegister = async (values) => {
    try {
      // Add role="User" to the payload
      const payload = { ...values, role: "User" };
      const res = await API.post("/users/register", payload);
      message.success("Registration successful! Please log in.");
      setActiveTab("login"); // Switch to login tab after registration
      registerForm.resetFields(); // Clear the registration form
    } catch (err) {
      message.error("Registration failed: " + err.response?.data?.error);
    }
  };

  return (
    <div className="auth-container">
      {/* Background Image */}
      <div className="background-image"></div>

      {/* Login/Register Card */}
      <Card className="auth-card">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key);
            // Clear forms when switching tabs
            if (key === "login") {
              registerForm.resetFields();
            } else {
              loginForm.resetFields();
            }
          }}
          animated={{ inkBar: true, tabPane: true }} // Add tab animations
        >
          <TabPane tab="Sign In" key="login">
            <LoginForm onSubmit={handleLogin} form={loginForm} />
            <div className="auth-footer">
              Don't have an account?{" "}
              <span onClick={() => setActiveTab("register")}>Register</span>
            </div>
          </TabPane>
          <TabPane tab="Register" key="register">
            <UserForm onSubmit={handleRegister} form={registerForm} />
            <div className="auth-footer">
              Already have an account?{" "}
              <span onClick={() => setActiveTab("login")}>Sign In</span>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;