import React from "react";
import { useLocation } from "react-router-dom";
import { Result, Button, Typography, Card, Divider } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import "../styles/BookingConfirmed.css";

const { Title, Text } = Typography;

const BookingConfirmed = () => {
  const { state } = useLocation();

  return (
    <div className="booking-confirmed-container">
      <Result
        icon={<SmileOutlined />}
        title="Your booking is confirmed!"
        subTitle={`Booking reference: #${Math.floor(Math.random() * 1000000)}`}
        extra={[
          <Button type="primary" key="dashboard" href="/dashboard">
            Go to Dashboard
          </Button>,
          <Button key="home" href="/">
            Back to Home
          </Button>,
        ]}
      />

      <Card className="booking-details-card">
        <Title level={4}>Booking Details</Title>
        <div className="flight-details">
          <div className="flight-segment">
            <Text strong>Outbound Flight</Text>
            <div>{state?.flightDetails?.outbound?.airline_name} - {state?.flightDetails?.outbound?.flight_number}</div>
            <div>
              {state?.flightDetails?.outbound?.departure_city} → {state?.flightDetails?.outbound?.arrival_city}
            </div>
          </div>

          {state?.flightDetails?.return && (
            <>
              <Divider />
              <div className="flight-segment">
                <Text strong>Return Flight</Text>
                <div>{state?.flightDetails?.return?.airline_name} - {state?.flightDetails?.return?.flight_number}</div>
                <div>
                  {state?.flightDetails?.return?.departure_city} → {state?.flightDetails?.return?.arrival_city}
                </div>
              </div>
            </>
          )}
        </div>

        <Divider />

        <div className="passenger-details">
          <Text strong>Passengers:</Text>
          {state?.passengers?.map((passenger, index) => (
            <div key={index} className="passenger">
              {passenger.name} ({passenger.age} years)
            </div>
          ))}
        </div>

        <Divider />

        <div className="price-summary">
          <Text strong>Total Paid:</Text>
          <Text strong>₹{(state?.bookingData?.amount || 0) + (state?.passengers?.length * 200 || 0)}</Text>
        </div>
      </Card>
    </div>
  );
};

export default BookingConfirmed;