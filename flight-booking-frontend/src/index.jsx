import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ConfigProvider } from "antd";
import theme from "./styles/theme"; // Import custom theme
import "./styles/Animations.css"; // Import animations
import "./styles/CustomStyles.css"; // Import custom styles
import "./styles/GlobalOverrides.css"; // Import overrides
import '@ant-design/v5-patch-for-react-19';


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