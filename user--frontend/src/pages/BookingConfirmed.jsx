import React from "react";
import { useLocation } from "react-router-dom";
import { 
  Card, 
  Button, 
  Typography, 
  Divider, 
  Row, 
  Col, 
  Tag,
  Space,
  Image,
  Steps
} from "antd";
import { 
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
  DollarOutlined,
  QrcodeOutlined
} from '@ant-design/icons';
import moment from "moment";
import "../styles/BookingConfirmed.css";
import indigoLogo from "../assets/indigo.png";
import airIndiaLogo from "../assets/airindia.jpg";
import spicejetLogo from "../assets/spicejet.png";
import vistaraLogo from "../assets/vistara.jpg";
import goFirstLogo from "../assets/gofirst.jpg";
 // Your existing logo map

 const airlineLogoMap = {
   "IndiGo": indigoLogo,
   "Air India": airIndiaLogo,
   "SpiceJet": spicejetLogo,
   "Vistara": vistaraLogo,
   "GoAir": goFirstLogo,
 };
 
const { Title, Text } = Typography;

const BookingConfirmed = () => {
  const { state } = useLocation();
  const bookingRef = `FLY${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

  // Generate sample QR code (in a real app, use a QR generator library)
  const generateQRCode = () => {
    return (
      <div className="qr-placeholder">
        <QrcodeOutlined style={{ fontSize: 80, color: '#1890ff' }} />
        <Text type="secondary">Booking ID: {bookingRef}</Text>
      </div>
    );
  };

  const getAirlineLogo = (airlineName) => {
    return airlineLogoMap[airlineName] || airlineLogoMap["IndiGo"];
  };

  const renderFlightSegment = (flight, isReturn = false) => (
    <Card 
      className="flight-ticket-segment"
      style={{ 
        borderLeft: `4px solid ${isReturn ? '#722ed1' : '#1890ff'}`,
        marginBottom: 16
      }}
    >
      <Row gutter={16}>
        <Col span={4}>
          <Image
            src={getAirlineLogo(flight?.airline_name)}
            preview={false}
            width={60}
          />
        </Col>
        <Col span={20}>
          <div className="flight-header">
            <Text strong style={{ fontSize: 18 }}>{flight?.airline_name}</Text>
            <Tag color={isReturn ? 'purple' : 'blue'}>
              {isReturn ? 'RETURN' : 'OUTBOUND'}
            </Tag>
          </div>
          
          <Row gutter={16} style={{ marginTop: 12 }}>
            <Col span={10}>
              <div className="flight-time">
                <Text strong style={{ fontSize: 20 }}>
                  {moment(flight?.departure_time).format("HH:mm")}
                </Text>
                <Text type="secondary">
                  {moment(flight?.departure_time).format("ddd, D MMM")}
                </Text>
              </div>
              <div className="flight-airport">
                <Text strong>{flight?.departure_city}</Text>
                <Text type="secondary">({flight?.departure_airport_code})</Text>
              </div>
            </Col>
            
            <Col span={4} className="flight-duration">
              <Text type="secondary">
                {Math.floor(flight?.duration / 60)}h {flight?.duration % 60}m
              </Text>
              <Divider className="duration-line" />
            </Col>
            
            <Col span={10}>
              <div className="flight-time">
                <Text strong style={{ fontSize: 20 }}>
                  {moment(flight?.arrival_time).format("HH:mm")}
                </Text>
                <Text type="secondary">
                  {moment(flight?.arrival_time).format("ddd, D MMM")}
                </Text>
              </div>
              <div className="flight-airport">
                <Text strong>{flight?.arrival_city}</Text>
                <Text type="secondary">({flight?.arrival_airport_code})</Text>
              </div>
            </Col>
          </Row>
          
          <Divider dashed style={{ margin: '12px 0' }} />
          
          <Row gutter={16}>
            <Col span={8}>
              <Space>
                <IdcardOutlined />
                <Text>Flight: {flight?.flight_number}</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space>
                <UserOutlined />
                <Text>Class: Economy</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space>
                <CalendarOutlined />
                <Text>Date: {moment(flight?.departure_time).format("D MMM YYYY")}</Text>
              </Space>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );

  return (
    <div className="booking-confirmed-container">
      <Card className="confirmation-header">
        <Row align="middle" gutter={16}>
          <Col>
            <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a' }} />
          </Col>
          <Col flex="auto">
            <Title level={2} style={{ marginBottom: 0 }}>Booking Confirmed!</Title>
            <Text type="secondary">Your e-ticket has been generated</Text>
          </Col>
          <Col>
            <Tag icon={<ClockCircleOutlined />} color="gold">
              {moment().format("D MMM YYYY, h:mm A")}
            </Tag>
          </Col>
        </Row>
      </Card>

      <Steps
        current={2}
        items={[
          {
            title: 'Booked',
            description: moment().subtract(10, 'minutes').format("h:mm A")
          },
          {
            title: 'Paid',
            description: moment().subtract(5, 'minutes').format("h:mm A")
          },
          {
            title: 'Confirmed',
            description: 'E-ticket issued'
          }
        ]}
        style={{ margin: '24px 0' }}
      />

      <Row gutter={24}>
        <Col span={16}>
          {renderFlightSegment(state?.flightDetails?.outbound)}
          {state?.flightDetails?.return && renderFlightSegment(state?.flightDetails?.return, true)}
          
          <Card title="Passenger Details" style={{ marginTop: 16 }}>
            {state?.passengers?.map((passenger, index) => (
              <div key={index} className="passenger-detail">
                <Row gutter={16}>
                  <Col span={6}>
                    <Space>
                      <UserOutlined />
                      <Text strong>{passenger.name}</Text>
                    </Space>
                  </Col>
                  <Col span={4}>
                    <Text>{passenger.age} years</Text>
                  </Col>
                  <Col span={6}>
                    <Text>{passenger.contact_number}</Text>
                  </Col>
                  <Col span={8}>
                    <Text type="secondary">{passenger.email || 'No email provided'}</Text>
                  </Col>
                </Row>
                {passenger.seat_number && (
                  <Tag color="blue" style={{ marginTop: 8 }}>
                    Seat: {passenger.seat_number}
                  </Tag>
                )}
              </div>
            ))}
          </Card>
        </Col>
        
        <Col span={8}>
          <Card className="receipt-card">
            <Title level={4} style={{ marginBottom: 24 }}>
              <DollarOutlined /> Payment Receipt
            </Title>
            
            <div className="receipt-detail">
              <Text strong>Booking Reference:</Text>
              <Text copyable>{bookingRef}</Text>
            </div>
            
            <div className="receipt-detail">
              <Text strong>Payment Status:</Text>
              <Tag color="green">Paid</Tag>
            </div>
            
            <div className="receipt-detail">
              <Text strong>Payment Date:</Text>
              <Text>{moment().format("D MMM YYYY, h:mm A")}</Text>
            </div>
            
            <Divider dashed style={{ margin: '16px 0' }} />
            
            <div className="price-breakdown">
              <div className="price-row">
                <Text>Base Fare ({state?.passengers?.length} pax):</Text>
                <Text>₹{state?.fareDetails?.baseFare?.toLocaleString('en-IN')}</Text>
              </div>
              <div className="price-row">
                <Text>Taxes & Fees:</Text>
                <Text>₹{state?.fareDetails?.taxes?.total?.toLocaleString('en-IN')}</Text>
              </div>
              <div className="price-row total">
                <Text strong>Total Paid:</Text>
                <Text strong>₹{state?.fareDetails?.totalAmount?.toLocaleString('en-IN')}</Text>
              </div>
            </div>
            
            <Divider dashed style={{ margin: '16px 0' }} />
            
            {generateQRCode()}
            
            <Button 
              type="primary" 
              block 
              style={{ marginTop: 16 }}
              onClick={() => window.print()}
            >
              Print Ticket
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BookingConfirmed;