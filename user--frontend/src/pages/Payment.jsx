import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Card, 
  Button, 
  Typography, 
  Divider, 
  Steps, 
  message, 
  Spin,
  Radio,
  Row,
  Col, 
  Checkbox
} from "antd";
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined,
  CreditCardOutlined,
  IdcardOutlined,
  QrcodeOutlined,
  BankOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import API from "../services/api";
import "../styles/Payment.css";
import moment from "moment";
import indigoLogo from "../assets/indigo.png";
import airIndiaLogo from "../assets/airindia.jpg";
import spicejetLogo from "../assets/spicejet.png";
import vistaratLogo from "../assets/vistara.jpg";
import goFirstLogo from "../assets/gofirst.jpg";

const airlineLogoMap = {
  "IndiGo": indigoLogo,
  "Air India": airIndiaLogo,
  "SpiceJet": spicejetLogo,
  "Vistara": vistaratLogo,
  "GoAir": goFirstLogo,
};

const { Title, Text } = Typography;
const { Step } = Steps;

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  const getAirlineLogo = (airlineName) => {
    return airlineLogoMap[airlineName] || airlineLogoMap["IndiGo"];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [methodsResponse] = await Promise.all([
          API.get('/payment-methods'),
        ]);
        
        setPaymentMethods(methodsResponse.data);
      } catch (error) {
        message.error("Failed to load payment methods");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePayment = async () => {
    try {
        if (!selectedMethod) {
            throw new Error("Please select a payment method");
        }

        // First update payment method
        await API.put(`/payments/${state.bookingData.payment_id}`, {
            payment_method_id: selectedMethod,
            payment_status: 'Success' // Demo - change to Success
        });

        // Then navigate to confirmation
        navigate("/booking-confirmed", { 
            state: {
                ...state,
                paymentStatus: 'Success'
            } 
        });
    } catch (error) {
        message.error(error.response?.data?.error || "Payment failed");
    }
};

  if (loading) return <Spin size="large" className="loading-spinner" />;

  return (
    <div className="payment-container">
      <Steps current={1}>
        <Step title="Booking" />
        <Step title="Payment" />
        <Step title="Confirmation" />
      </Steps>

      <div className="payment-content">
        <Row gutter={24}>
          <Col span={16}>
            {/* Flight Details Card */}
            <Card className="flight-details-card">
              <Title level={4}>Flight Details</Title>
              
              {/* Outbound Flight */}
              <div className="flight-card">
                <div className="airline-logo">
                  <img 
                    src={getAirlineLogo(state.flightDetails.outbound.airline_name)} 
                    alt={state.flightDetails.outbound.airline_name}
                  />
                </div>
                <div className="flight-info">
                  <div className="flight-header">
                    <Text strong>{state.flightDetails.outbound.airline_name}</Text>
                    <Text type="secondary">{state.flightDetails.outbound.flight_number}</Text>
                  </div>
                  <div className="flight-timings">
                    <div className="departure">
                      <Text strong>{moment(state.flightDetails.outbound.departure_time).format("h:mm A")}</Text>
                      <Text>{state.flightDetails.outbound.departure_city} ({state.flightDetails.outbound.departure_airport_code})</Text>
                    </div>
                    <div className="duration">
                      <Text type="secondary">
                        {Math.floor(state.flightDetails.outbound.duration / 60)}h {state.flightDetails.outbound.duration % 60}m
                      </Text>
                    </div>
                    <div className="arrival">
                      <Text strong>{moment(state.flightDetails.outbound.arrival_time).format("h:mm A")}</Text>
                      <Text>{state.flightDetails.outbound.arrival_city} ({state.flightDetails.outbound.arrival_airport_code})</Text>
                    </div>
                  </div>
                  <div className="flight-date">
                    <Text>{moment(state.flightDetails.outbound.departure_time).format("ddd, D MMM'YY")}</Text>
                  </div>
                </div>
              </div>

              {/* Return Flight if exists */}
              {state.flightDetails.return && (
                <>
                  <Divider />
                  <div className="flight-card">
                    <div className="airline-logo">
                      <img 
                        src={getAirlineLogo(state.flightDetails.return.airline_name)} 
                        alt={state.flightDetails.return.airline_name}
                      />
                    </div>
                    <div className="flight-info">
                      <div className="flight-header">
                        <Text strong>{state.flightDetails.return.airline_name}</Text>
                        <Text type="secondary">{state.flightDetails.return.flight_number}</Text>
                      </div>
                      <div className="flight-timings">
                        <div className="departure">
                          <Text strong>{moment(state.flightDetails.return.departure_time).format("h:mm A")}</Text>
                          <Text>{state.flightDetails.return.departure_city} ({state.flightDetails.return.departure_airport_code})</Text>
                        </div>
                        <div className="duration">
                          <Text type="secondary">
                            {Math.floor(state.flightDetails.return.duration / 60)}h {state.flightDetails.return.duration % 60}m
                          </Text>
                        </div>
                        <div className="arrival">
                          <Text strong>{moment(state.flightDetails.return.arrival_time).format("h:mm A")}</Text>
                          <Text>{state.flightDetails.return.arrival_city} ({state.flightDetails.return.arrival_airport_code})</Text>
                        </div>
                      </div>
                      <div className="flight-date">
                        <Text>{moment(state.flightDetails.return.departure_time).format("ddd, D MMM'YY")}</Text>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Passenger Details */}
              <Divider />
              <div className="passenger-details">
                <div className="passenger-details-header">
                  <UserOutlined />
                  <Text strong>Passenger Details</Text>
                </div>
                <div className="passenger-info">
                  <div className="passenger-info-item">
                    <UserOutlined />
                    <Text>{state.passengers[0].name}</Text>
                  </div>
                  <div className="passenger-info-item">
                    <MailOutlined />
                    <Text>{state.passengers[0].email}</Text>
                  </div>
                  <div className="passenger-info-item">
                    <PhoneOutlined />
                    <Text>+91-{state.passengers[0].contact_number}</Text>
                  </div>
                </div>
              </div>
            </Card>

            {/* Add-ons */}
            <Card className="add-ons-card">
              <Title level={4}>Additional Services</Title>
              <div className="add-on-option">
                <Checkbox onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedAddOns([...selectedAddOns, 'flight_protection']);
                  } else {
                    setSelectedAddOns(selectedAddOns.filter(item => item !== 'flight_protection'));
                  }
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <SafetyOutlined style={{ fontSize: 18, color: '#52c41a', marginTop: 2 }} />
                    <div>
                      <Text strong>Flight Delay Protection</Text><br />
                      <Text type="secondary">Get hassle-free compensation of ₹1000 if your flight is delayed by one hour or more</Text><br />
                      <Text type="secondary">Add @ ₹1.99 per person</Text>
                    </div>
                  </div>
                </Checkbox>
              </div>
            </Card>

            {/* Payment Options */}
            <Card className="payment-options-card">
              <Title level={4}>Payment Options</Title>
              <Radio.Group 
                onChange={(e) => setSelectedMethod(e.target.value)} 
                value={selectedMethod}
              >
                {paymentMethods.map(method => (
                  <Radio key={method.method_id} value={method.method_id} style={{ width: '100%', marginBottom: 8 }}>
                    <div className="payment-method">
                      {method.method_name === "Credit Card" && <CreditCardOutlined style={{ fontSize: 20 }} />}
                      {method.method_name === "Debit Card" && <IdcardOutlined style={{ fontSize: 20 }} />}
                      {method.method_name === "UPI" && <QrcodeOutlined style={{ fontSize: 20 }} />}
                      {method.method_name === "Net Banking" && <BankOutlined style={{ fontSize: 20 }} />}
                      <Text style={{ marginLeft: 12 }}>{method.method_name}</Text>
                    </div>
                  </Radio>
                ))}
              </Radio.Group>
            </Card>
          </Col>

          <Col span={8}>
            <Card className="price-summary-card">
              <Title level={4}>Price Summary</Title>
              <div className="price-row">
                <Text>Base Fare ({state.passengers.length} {state.passengers.length > 1 ? 'passengers' : 'passenger'}):</Text>
                <Text>₹{state.fareDetails?.baseFare?.toLocaleString('en-IN')}</Text>
              </div>
              <div className="price-row">
                <Text>Taxes & Fees:</Text>
                <Text>₹{state.fareDetails?.taxes?.total?.toLocaleString('en-IN')}</Text>
              </div>
              {selectedAddOns.includes('flight_protection') && (
                <div className="price-row">
                  <Text>Flight Protection:</Text>
                  <Text>₹{(state.passengers.length * 1.99).toLocaleString('en-IN')}</Text>
                </div>
              )}
              <Divider />
              <div className="price-row total">
                <Text strong>Total Amount:</Text>
                <Text strong>
                  ₹{(
                    state.fareDetails?.totalAmount + 
                    (selectedAddOns.includes('flight_protection') ? state.passengers.length * 1.99 : 0)
                  ).toLocaleString('en-IN')}
                </Text>
              </div>
              <Button 
                type="primary" 
                size="large" 
                block
                onClick={handlePayment}
                disabled={!selectedMethod}
                className="pay-now-button"
              >
                Pay Now
              </Button>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Payment;