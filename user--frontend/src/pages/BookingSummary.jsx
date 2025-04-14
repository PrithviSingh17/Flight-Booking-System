import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { 
  Card, 
  Button, 
  Typography, 
  Divider, 
  Collapse, 
  Form, 
  Input, 
  InputNumber,
  Select, 
  message, 
  Spin,
  Row,
  Col,
  Tag,
  Space,
  Radio,
  ConfigProvider,
  theme,
  DatePicker
} from "antd";
import { 
  InfoCircleOutlined,
  CarryOutOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import API from "../services/api";
import moment from "moment";
import "../styles/BookingSummary.css";

// Import airline logos
import indigoLogo from "../assets/indigo.png";
import airIndiaLogo from "../assets/airindia.jpg";
import spicejetLogo from "../assets/spicejet.png";
import vistaraLogo from "../assets/vistara.jpg";
import goFirstLogo from "../assets/gofirst.jpg";

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

// Color palette
const colors = {
  primary: "#4361ee",
  secondary: "#3f37c9",
  accent: "#4895ef",
  light: "#f8f9fa",
  dark: "#212529",
  success: "#4cc9f0",
  warning: "#f72585",
  info: "#7209b7"
};

// Airline logo mapping
const airlineLogoMap = {
  "IndiGo": indigoLogo,
  "Air India": airIndiaLogo,
  "SpiceJet": spicejetLogo,
  "Vistara": vistaraLogo,
  "GoAir": goFirstLogo,
};

const getAirlineLogo = (airlineName) => {
  // Normalize the airline name
  const normalized = airlineName.toLowerCase().trim();
  
  // Map normalized names to logo
  const logoMap = {
    'indigo': indigoLogo,
    'air india': airIndiaLogo,
    'spicejet': spicejetLogo,
    'vistara': vistaratLogo,
    'goair': goFirstLogo,
  };
  
  return logoMap[normalized] || indigoLogo; // Default to IndiGo if no match
};

// Helper function to calculate age from date of birth
const calculateAge = (dob) => {
  if (!dob) return null;
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Tax calculation based on Indian flight taxes (as of 2023)
const calculateTaxes = (baseFare, passengers) => {
  // GST (5% of base fare)
  const gst = baseFare * 0.05;
  // Passenger Service Fee (₹200 per passenger)
  const psf = passengers * 200;
  // User Development Fee (₹150 per passenger for domestic)
  const udf = passengers * 150;
  // Convenience fee (₹100 per booking)
  const convenienceFee = 100;
  
  return {
    gst,
    psf,
    udf,
    convenienceFee,
    total: gst + psf + udf + convenienceFee
  };
};

const BookingSummary = () => {
  const { flightId, returnFlightId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [passengers, setPassengers] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [flightDetails, setFlightDetails] = useState({ 
    outbound: null, 
    return: null 
  });

  const validatePassengerFields = () => {
    const errors = {};
    let isValid = true;

    passengers.forEach((passenger, index) => {
      if (!passenger.first_name?.trim()) {
        errors[`first_name_${index}`] = 'Please enter first name';
        isValid = false;
      }
      if (!passenger.last_name?.trim()) {
        errors[`last_name_${index}`] = 'Please enter last name';
        isValid = false;
      }
      if (!passenger.date_of_birth) {
        errors[`dob_${index}`] = 'Please select date of birth';
        isValid = false;
      }
      if (!passenger.contact_number || passenger.contact_number.length !== 10) {
        errors[`contact_${index}`] = 'Please enter valid 10-digit contact number';
        isValid = false;
      }
      if (passenger.email && !/^\S+@\S+\.\S+$/.test(passenger.email)) {
        errors[`email_${index}`] = 'Please enter valid email';
        isValid = false;
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  // Calculate base fare and taxes
  const baseFare = flightDetails.outbound?.price * passengers.length + 
                  (flightDetails.return ? flightDetails.return.price * passengers.length : 0);
  const taxes = calculateTaxes(baseFare, passengers.length);
  const totalAmount = baseFare + taxes.total;

  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        setLoading(true);
        
        const [outboundResponse, returnResponse] = await Promise.all([
          API.get(`/flights/${flightId}`),
          returnFlightId ? API.get(`/flights/${returnFlightId}`) : Promise.resolve(null)
        ]);

        setFlightDetails({
          outbound: outboundResponse.data,
          return: returnResponse?.data || null
        });

        const passengerCount = state?.passengers || 1;
        setPassengers(Array(passengerCount).fill().map(() => ({
          first_name: '',
          last_name: '',
          gender: 'Male',
          date_of_birth: null,
          contact_number: '',
          passport_number: '',
          nationality: '',
          email: '',
          special_requests: '',
          seat_number: ''
        })));

      } catch (error) {
        message.error("Failed to fetch flight details");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchFlightDetails();
  }, [flightId, returnFlightId, state?.passengers, navigate]);

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
  };

  const handleDateChange = (date, dateString, index) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index].date_of_birth = date ? date.toDate() : null;
    setPassengers(updatedPassengers);
  };

  const handleProceedToPayment = async () => {
    try {
      // Validate all fields first
      const isValid = validatePassengerFields();
      if (!isValid) {
        message.warning('Please fill all required fields correctly');
        return;
      }
  
      // Format passengers data to match backend expectations
      const formattedPassengers = passengers.map(p => ({
        name: `${p.first_name} ${p.last_name}`.trim(),
        age: calculateAge(p.date_of_birth),
        gender: p.gender,
        date_of_birth: p.date_of_birth ? moment(p.date_of_birth).format("YYYY-MM-DD") : null,
        contact_number: String(p.contact_number).replace(/\D/g, ''), // Ensure only numbers
        email: p.email || null,
        passport_number: p.passport_number || null,
        nationality: p.nationality || null,
        special_requests: p.special_requests || null
      }));
  
      // Prepare the complete payload
      const payload = {
        flight_id: flightId,
        return_flight_id: returnFlightId || null,
        passengers: formattedPassengers,
        fare_details: {
          base_fare: baseFare,
          taxes: taxes,
          total_amount: totalAmount
        },
        payment_status: 'Pending' // Explicit payment status
      };
  
      console.log('Submitting booking payload:', payload); // Debug log
  
      const response = await API.post("/bookings/complete", payload);
  
      navigate("/payment", {
        state: {
          bookingData: response.data,
          flightDetails,
          passengers: formattedPassengers,
          fareDetails: {
            baseFare,
            taxes,
            totalAmount
          }
        }
      });
  
    } catch (error) {
      console.error("Booking error details:", {
        message: error.message,
        response: error.response?.data,
        request: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });
      
      const errorMessage = error.response?.data?.errors 
        ? Object.values(error.response.data.errors).join(', ')
        : error.response?.data?.message 
          ? error.response.data.message
          : "Booking failed. Please try again.";
      
      message.error(errorMessage);
    }
  };

  const renderFlightSegment = (flight, isReturn = false) => {
    if (!flight) return null;
    
    return (
      <Card 
        className="flight-segment-card"
        style={{ 
          marginBottom: 24,
          borderLeft: `4px solid ${colors.primary}`,
          background: 'white'
        }}
      >
        <div className="flight-header">
          <div className="route-info">
            <Text strong className="route-title" style={{ color: colors.dark }}>
              {flight.departure_city} → {flight.arrival_city}
            </Text>
            <div className="route-subinfo">
              <Tag color={colors.accent}>
                {moment(flight.departure_time).format("dddd, MMM D")}
              </Tag>
              <Tag color={colors.info}>
                Non Stop · {Math.floor(flight.duration / 60)}h {flight.duration % 60}m
              </Tag>
            </div>
          </div>
          <div className="flight-actions">
            <Button type="link" className="action-link" style={{ color: colors.warning }}>
              Cancellation Fees Apply
            </Button>
            <Button type="link" className="action-link" style={{ color: colors.primary }}>
              View Fare Rules
            </Button>
          </div>
        </div>
    
        <Divider className="flight-divider" style={{ borderColor: colors.light }} />
    
        <div className="flight-content">
          <div className="airline-info">
            <img 
              src={getAirlineLogo(flight.airline_name)} 
              alt={flight.airline_name}
              className="airline-logo"
              style={{ border: `1px solid ${colors.light}`, borderRadius: 4 }}
            />
            <div className="airline-details">
              <Text strong className="airline-name" style={{ color: colors.dark }}>
                {flight.airline_name}
              </Text>
              <Text type="secondary" className="flight-number" style={{ color: colors.accent }}>
                {flight.flight_number}
              </Text>
              <Text type="secondary" className="aircraft-type" style={{ color: colors.accent }}>
                Airbus A321
              </Text>
            </div>
          </div>
    
          <div className="timeline-container">
            <div className="timeline-departure">
              <Text strong className="timeline-time" style={{ color: colors.primary }}>
                {moment(flight.departure_time).format("HH:mm")}
              </Text>
              <Text className="timeline-city" style={{ color: colors.dark }}>
                {flight.departure_city}
              </Text>
              <Text className="timeline-airport" style={{ color: colors.accent }}>
                {flight.departure_airport_code}, Terminal T2
              </Text>
            </div>
    
            <div className="timeline-duration">
              <Text className="duration-text" style={{ color: colors.info }}>
                {Math.floor(flight.duration / 60)}h {flight.duration % 60}m
              </Text>
              <Divider className="duration-divider" style={{ borderColor: colors.light }} />
              <Text className="duration-label" style={{ color: colors.info }}>
                Non Stop
              </Text>
            </div>
    
            <div className="timeline-arrival">
              <Text strong className="timeline-time" style={{ color: colors.primary }}>
                {moment(flight.arrival_time).format("HH:mm")}
              </Text>
              <Text className="timeline-city" style={{ color: colors.dark }}>
                {flight.arrival_city}
              </Text>
              <Text className="timeline-airport" style={{ color: colors.accent }}>
                {flight.arrival_airport_code}, Terminal T1
              </Text>
            </div>
          </div>
        </div>
    
        <Divider className="flight-divider" style={{ borderColor: colors.light }} />
    
        <div className="baggage-info">
          <Row gutter={16}>
            <Col span={12}>
              <Space>
                <CarryOutOutlined className="baggage-icon" style={{ color: colors.success }} />
                <Text className="baggage-text" style={{ color: colors.dark }}>
                  Cabin Baggage: 7kg (1 piece only)
                </Text>
              </Space>
            </Col>
            <Col span={12}>
              <Space>
                <ShoppingOutlined className="baggage-icon" style={{ color: colors.success }} />
                <Text className="baggage-text" style={{ color: colors.dark }}>
                  Check-In Baggage: 15kg (1 piece only)
                </Text>
              </Space>
            </Col>
          </Row>
          <div className="baggage-promo">
            <Text className="promo-text" style={{ color: colors.accent }}>
              Got excess baggage? Don't stress, buy extra baggage allowance!
            </Text>
            <Button 
              type="link" 
              className="promo-link" 
              style={{ color: colors.primary }}
            >
              ADD BAGGAGE
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: colors.primary,
          borderRadius: 8,
          colorBgContainer: '#ffffff',
        },
      }}
    >
      <div className="booking-summary-container" style={{ background: '#f5f7fa' }}>
        <Title level={2} className="page-title" style={{ color: colors.dark }}>
          Review Your Booking
        </Title>
        
        <div className="flight-summary-section">
          {renderFlightSegment(flightDetails.outbound)}
          {flightDetails.return && renderFlightSegment(flightDetails.return, true)}
        </div>
        
        <Card 
          title="Passenger Details" 
          className="passenger-details-card"
          headStyle={{ background: colors.primary, color: 'white', borderRadius: '8px 8px 0 0' }}
          extra={
            <Text type="secondary" className="passenger-count" style={{ color: 'white' }}>
              {passengers.length} {passengers.length > 1 ? 'Passengers' : 'Passenger'}
            </Text>
          }
        >
          <Collapse accordion className="passenger-details-collapse">
            {passengers.map((passenger, index) => (
              <Panel 
                header={`Passenger ${index + 1}`} 
                key={index} 
                className="passenger-panel"
                style={{ borderColor: colors.light }}
              >
                <Form form={form} layout="vertical" className="passenger-form">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="First Name"
                        name={`first_name_${index}`}
                        validateStatus={validationErrors[`first_name_${index}`] ? 'error' : ''}
                        help={validationErrors[`first_name_${index}`]}
                        rules={[{ required: true, message: 'Please enter first name' }]}
                      >
                        <Input
                          value={passenger.first_name}
                          onChange={(e) => handlePassengerChange(index, 'first_name', e.target.value)}
                          style={{ borderColor: colors.light }}
                          placeholder="First name"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Last Name"
                        name={`last_name_${index}`}
                        validateStatus={validationErrors[`last_name_${index}`] ? 'error' : ''}
                        help={validationErrors[`last_name_${index}`]}
                        rules={[{ required: true, message: 'Please enter last name' }]}
                      >
                        <Input
                          value={passenger.last_name}
                          onChange={(e) => handlePassengerChange(index, 'last_name', e.target.value)}
                          style={{ borderColor: colors.light }}
                          placeholder="Last name"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        label="Gender"
                        name={`gender_${index}`}
                        validateStatus={validationErrors[`gender_${index}`] ? 'error' : ''}
                        help={validationErrors[`gender_${index}`]}
                        rules={[{ required: true, message: 'Please select gender' }]}
                      >
                        <Radio.Group
                          value={passenger.gender}
                          onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                        >
                          <Radio value="Male" style={{ color: colors.dark }}>Male</Radio>
                          <Radio value="Female" style={{ color: colors.dark }}>Female</Radio>
                          <Radio value="Other" style={{ color: colors.dark }}>Other</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col span={16}>
                      <Form.Item
                        label="Date of Birth"
                        name={`dob_${index}`}
                        validateStatus={validationErrors[`dob_${index}`] ? 'error' : ''}
                        help={validationErrors[`dob_${index}`] || (
                          passenger.date_of_birth ? `Age: ${calculateAge(passenger.date_of_birth)} years` : ''
                        )}
                        rules={[{ required: true, message: 'Please select date of birth' }]}
                      >
                        <DatePicker
                          format="YYYY-MM-DD"
                          value={passenger.date_of_birth ? moment(passenger.date_of_birth) : null}
                          onChange={(date, dateString) => handleDateChange(date, dateString, index)}
                          disabledDate={(current) => current && current > moment().endOf('day')}
                          style={{ width: '100%' }}
                          placeholder="Select date of birth"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Contact Number"
                        name={`contact_${index}`}
                        validateStatus={validationErrors[`contact_${index}`] ? 'error' : ''}
                        help={validationErrors[`contact_${index}`]}
                        rules={[
                          { required: true, message: 'Please enter 10-digit contact number' },
                          { len: 10, message: 'Must be 10 digits' }
                        ]}
                      >
                        <Input
                          type="number"
                          value={passenger.contact_number}
                          onChange={(e) => handlePassengerChange(index, 'contact_number', e.target.value)}
                          addonBefore="+91"
                          placeholder="Mobile number"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Email (Optional)"
                        name={`email_${index}`}
                        rules={[
                          { 
                            type: 'email', 
                            message: 'Please enter valid email (e.g., name@example.com)' 
                          }
                        ]}
                      >
                        <Input
                          value={passenger.email}
                          onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                          placeholder="Email for booking confirmation"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Divider orientation="left" style={{ marginTop: 0 }}>Passport Information (Optional)</Divider>
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Passport Number"
                        name={`passport_number_${index}`}
                      >
                        <Input
                          value={passenger.passport_number}
                          onChange={(e) => handlePassengerChange(index, 'passport_number', e.target.value)}
                          placeholder="For international flights"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Nationality"
                        name={`nationality_${index}`}
                      >
                        <Input
                          value={passenger.nationality}
                          onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value)}
                          placeholder="Your nationality"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    label="Special Requests (Optional)"
                    name={`special_requests_${index}`}
                    tooltip={{ title: 'Dietary requirements, wheelchair assistance, etc.', icon: <InfoCircleOutlined /> }}
                  >
                    <Input.TextArea
                      rows={2}
                      value={passenger.special_requests}
                      onChange={(e) => handlePassengerChange(index, 'special_requests', e.target.value)}
                      placeholder="Any special requirements?"
                    />
                  </Form.Item>
                </Form>
              </Panel>
            ))}
          </Collapse>
        </Card>
        
        <Card 
          className="price-summary-card"
          style={{ borderTop: `4px solid ${colors.primary}` }}
        >
          <Title level={4} className="price-title" style={{ color: colors.dark }}>
            Fare Summary
          </Title>
          <div className="price-details">
            <div className="price-row">
              <Text className="price-label" style={{ color: colors.dark }}>
                Base Fare ({passengers.length} {passengers.length > 1 ? 'passengers' : 'passenger'}):
              </Text>
              <Text className="price-value" style={{ color: colors.dark }}>
                ₹{baseFare.toLocaleString('en-IN')}
              </Text>
            </div>
            <div className="price-row">
              <Text className="price-label" style={{ color: colors.dark }}>
                GST (5%):
              </Text>
              <Text className="price-value" style={{ color: colors.dark }}>
                ₹{taxes.gst.toLocaleString('en-IN')}
              </Text>
            </div>
            <div className="price-row">
              <Text className="price-label" style={{ color: colors.dark }}>
                Passenger Service Fee:
              </Text>
              <Text className="price-value" style={{ color: colors.dark }}>
                ₹{taxes.psf.toLocaleString('en-IN')}
              </Text>
            </div>
            <div className="price-row">
              <Text className="price-label" style={{ color: colors.dark }}>
                User Development Fee:
              </Text>
              <Text className="price-value" style={{ color: colors.dark }}>
                ₹{taxes.udf.toLocaleString('en-IN')}
              </Text>
            </div>
            <div className="price-row">
              <Text className="price-label" style={{ color: colors.dark }}>
                Convenience Fee:
              </Text>
              <Text className="price-value" style={{ color: colors.dark }}>
                ₹{taxes.convenienceFee.toLocaleString('en-IN')}
              </Text>
            </div>
            <Divider className="price-divider" style={{ borderColor: colors.light }} />
            <div className="price-row total">
              <Text strong className="total-label" style={{ color: colors.dark }}>
                Total Amount:
              </Text>
              <Text strong className="total-value" style={{ color: colors.primary }}>
                ₹{totalAmount.toLocaleString('en-IN')}
              </Text>
            </div>
          </div>
          
          <Divider className="terms-divider" style={{ borderColor: colors.light }} />
          
          <div className="terms-conditions">
            <Text type="secondary" className="terms-text" style={{ color: colors.accent }}>
              By proceeding, I agree to the Terms & Conditions, Privacy Policy and User Agreement
            </Text>
          </div>
          
          <Button 
            type="primary" 
            size="large" 
            block
            onClick={handleProceedToPayment}
            className="proceed-button"
            style={{ 
              background: colors.primary,
              height: '48px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Proceed to Payment
          </Button>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default BookingSummary;