import React from "react";
import { Result, Button } from "antd"; // Use Ant Design's Result component for a clean error message
import { useNavigate } from "react-router-dom";

function Forbidden() {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    // Clear the token from sessionStorage (optional, but recommended)
    sessionStorage.removeItem("token");
    // Navigate to the login page
    navigate("/Login", { replace: true });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Result
        status="403" // 403 is the HTTP status code for "Forbidden"
        title="Access Denied"
        subTitle="You are not authorized to view this page."
        extra={
          <Button type="primary" onClick={handleGoToLogin}>
            Go to Login
          </Button>
        }
      />
    </div>
  );
}

export default Forbidden;