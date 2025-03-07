import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Flights from "./Flights";
import FlightStatus from "./FlightStatus";
import Users from "./Users";
import Airports from "./Airports"; 
import BookingStatusMaster from "./BookingStatusMaster";
import { Layout, Menu, theme } from "antd";
import "../styles/global.css"; // Import global styles

const { Header, Sider, Content } = Layout;

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("flights");
  const navigate = useNavigate();

  // Redirect to login if sessionStorage token is missing
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, []);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        style={{ background: "linear-gradient(135deg, #4e54c8, #8f94fb)" }}
      >
        <div className="demo-logo-vertical" style={{ padding: "20px", textAlign: "center" }}>
          <h2 style={{ color: "white", fontSize: "24px", fontWeight: "bold" }}>Admin Panel</h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["flights"]}
          onClick={({ key }) => setActiveTab(key)}
          items={[
            { key: "flights", label: "Flights" },
            { key: "flightStatus", label: "Flight Status" },
            { key: "users", label: "Users" },
            { key: "airports", label: "Airports" },
            { key: "bookingStatus", label: "Booking Status" },
          ]}
        />
      </Sider>

      {/* Main Content */}
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "24px 16px 0" }}>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
            {activeTab === "flights" && <Flights />}
            {activeTab === "flightStatus" && <FlightStatus />}
            {activeTab === "users" && <Users />}
            {activeTab === "airports" && <Airports />}
            {activeTab === "bookingStatus" && <BookingStatusMaster />}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminDashboard;