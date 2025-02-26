import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ConfigProvider } from "antd";
import theme from "./styles/theme"; // Import custom theme

// Create a root for ReactDOM
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app with Ant Design's ConfigProvider
root.render(
  <React.StrictMode>
    <ConfigProvider theme={theme}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);