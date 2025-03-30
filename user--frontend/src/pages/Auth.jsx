import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import { Tabs, Card, message, Form } from "antd";
import LoginForm from "../components/LoginForm";
import UserForm from "../components/UserForm";
import API from "../services/api";
import "../styles/Auth.css";

const { TabPane } = Tabs;

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation(); // Get location state

  const handleLogin = async (values) => {
    try {
      const res = await API.post("/users/login", values);
      sessionStorage.setItem("token", res.data.token);
      message.success("Login successful!");
      
      // Check if we came from "Book Now" flow
      if (location.state?.from) {
        navigate(location.state.from, { 
          state: { bookingData: location.state.bookingData } 
        });
      } else {
        navigate("/"); // Normal login goes to home
      }
    } catch (err) {
      message.error("Login failed: " + err.response?.data?.error);
    }
  };

  const handleRegister = async (values) => {
    try {
      const payload = { ...values, role: "User" };
      const res = await API.post("/users/register", payload);
      message.success("Registration successful! Please log in.");
      setActiveTab("login");
      registerForm.resetFields();
    } catch (err) {
      message.error("Registration failed: " + err.response?.data?.error);
    }
  };

  return (
    <div className="auth-container">
      <div className="background-image"></div>
      <Card className="auth-card">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key);
            if (key === "login") {
              registerForm.resetFields();
            } else {
              loginForm.resetFields();
            }
          }}
          animated={{ inkBar: true, tabPane: true }}
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