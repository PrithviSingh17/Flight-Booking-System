import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Flights from "./Flights";
import FlightStatus from "./FlightStatus";
import Users from "./Users";
import Airports from "./Airports";
import BookingStatusMaster from "./BookingStatusMaster";
import { Layout, Menu, theme } from "antd"; // Removed message from antd
import FlightStatusMaster from "./FlightStatusMaster";
import PaymentMethodMaster from "./PaymentMethodMaster";
import "../styles/global.css"; // Import global styles
import { CSSTransition } from "react-transition-group";
import "../styles/Animations.css";
import { jwtDecode } from "jwt-decode"; // Correct import syntax

const { Header, Sider, Content } = Layout;

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("flights");
  const [isAdmin, setIsAdmin] = useState(false); // State to track if the user is an admin
  const navigate = useNavigate();

  // Redirect to login if sessionStorage token is missing or user is not an admin
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    // Decode the token to check the role
    const decoded = jwtDecode(token);
    if (decoded.role === "Admin") {
      setIsAdmin(true); // User is an admin
    } else {
      setIsAdmin(false); // User is not an admin
      navigate("/forbidden", { replace: true }); // Redirect non-admin users to /forbidden
    }
  }, [navigate]);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // If the user is not an admin, return null (or a blank div if needed)
  if (!isAdmin) {
    return null; // Return nothing (or you can return a blank div if needed)
  }

  return (
    <CSSTransition in={true} timeout={300} classNames="slide-in-left" unmountOnExit>
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
              { key: "bookingStatus", label: "Booking Status Master" },
              { key: "flightStatusMaster", label: "Flight Status Master" },
              { key: "paymentMethodMaster", label: "Payment Method Master" },
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
              {activeTab === "flightStatusMaster" && <FlightStatusMaster />}
              {activeTab === "paymentMethodMaster" && <PaymentMethodMaster />}
            </div>
          </Content>
        </Layout>
      </Layout>
    </CSSTransition>
  );
}

export default AdminDashboard;