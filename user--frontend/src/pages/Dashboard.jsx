import React, { useState, useEffect } from 'react';
import { 
    Tabs, 
    Card, 
    Table, 
    Avatar, 
    Tag, 
    Descriptions, 
    Button, 
    Statistic, 
    message, 
    Form, 
    Input, 
    Space,
    Modal,
    Image,
    Typography,
    Divider,
    Row,
    Col
} from 'antd';
import { 
    UserOutlined, 
    ClockCircleOutlined, 
    HistoryOutlined, 
    SettingOutlined, 
    EditOutlined, 
    SaveOutlined,
    IdcardOutlined,
    CalendarOutlined,
    CloseOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Dashboard.css';
import logo from '../assets/logo1.png';
import indigoLogo from "../assets/indigo.png";
import airIndiaLogo from "../assets/airindia.jpg";
import spicejetLogo from "../assets/spicejet.png";
import vistaraLogo from "../assets/vistara.jpg";
import goFirstLogo from "../assets/gofirst.jpg";
import moment from 'moment';

const { Countdown } = Statistic;
const { Item } = Form;
const { Text, Title } = Typography;

const airlineLogoMap = {
  "IndiGo": indigoLogo,
  "Air India": airIndiaLogo,
  "SpiceJet": spicejetLogo,
  "Vistara": vistaraLogo,
  "GoAir": goFirstLogo,
};

const BookingDetailsModal = ({ booking, visible, onCancel, loading }) => {
    const getAirlineLogo = (airlineName) => {
        return airlineLogoMap[airlineName] || indigoLogo; // default to indigo if not found
    };

    return (
        <Modal
            title={`Booking #${booking?.booking_id}`}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={800}
        >
            {booking && (
                <Card 
                    extra={
                        <Button 
                            type="text" 
                            icon={<CloseOutlined />} 
                            onClick={onCancel}
                        />
                    }
                >
                    <Row gutter={16}>
                        <Col span={4}>
                            <Image
                                src={getAirlineLogo(booking.airline)}
                                preview={false}
                                width={60}
                            />
                        </Col>
                        <Col span={20}>
                            <div className="flight-header">
                                <Text strong style={{ fontSize: 18 }}>{booking.airline}</Text>
                                <Tag color={booking.status === 'Confirmed' ? 'green' : 'orange'}>
                                    {booking.status}
                                </Tag>
                            </div>
                            
                            <Row gutter={16} style={{ marginTop: 12 }}>
                                <Col span={10}>
                                    <div className="flight-time">
                                        <Text strong style={{ fontSize: 20 }}>
                                            {moment(booking.departure_time).format("HH:mm")}
                                        </Text>
                                        <Text type="secondary">
                                            {moment(booking.departure_time).format("ddd, D MMM")}
                                        </Text>
                                    </div>
                                    <div className="flight-airport">
                                        <Text strong>{booking.departure_city}</Text>
                                        <Text type="secondary">({booking.departure_airport_code})</Text>
                                    </div>
                                </Col>
                                
                                <Col span={4} className="flight-duration">
                                    <Text type="secondary">
                                        {booking.duration}
                                    </Text>
                                    <Divider className="duration-line" />
                                </Col>
                                
                                <Col span={10}>
                                    <div className="flight-time">
                                        <Text strong style={{ fontSize: 20 }}>
                                            {moment(booking.arrival_time).format("HH:mm")}
                                        </Text>
                                        <Text type="secondary">
                                            {moment(booking.arrival_time).format("ddd, D MMM")}
                                        </Text>
                                    </div>
                                    <div className="flight-airport">
                                        <Text strong>{booking.arrival_city}</Text>
                                        <Text type="secondary">({booking.arrival_airport_code})</Text>
                                    </div>
                                </Col>
                            </Row>
                            
                            <Divider dashed style={{ margin: '12px 0' }} />
                            
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Space>
                                        <IdcardOutlined />
                                        <Text>Flight: {booking.flight_number}</Text>
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
                                        <Text>Date: {moment(booking.departure_time).format("D MMM YYYY")}</Text>
                                    </Space>
                                </Col>
                            </Row>

                            <Divider />

                            <Title level={5}>Passengers ({booking.passenger_count})</Title>
                            {booking.passengers?.map((passenger, index) => (
                                <div key={index} style={{ marginBottom: 8 }}>
                                    <Text strong>{passenger.name}</Text>
                                    {passenger.seat_number && (
                                        <Tag style={{ marginLeft: 8 }}>Seat: {passenger.seat_number}</Tag>
                                    )}
                                </div>
                            ))}

                            <Divider />

                            <Row justify="end">
                                <Button 
                                    type="primary" 
                                    onClick={() => window.print()}
                                >
                                    Print Ticket
                                </Button>
                            </Row>
                        </Col>
                    </Row>
                </Card>
            )}
        </Modal>
    );
};

export default function Dashboard() {
    const [data, setData] = useState({ user: null, upcoming: [], history: [], stats: {} });
    const [loading, setLoading] = useState(true);
    const [editingProfile, setEditingProfile] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [cancellingId, setCancellingId] = useState(null);
    const [cancelling, setCancelling] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);
    useEffect(() => {
        console.log('Current bookings state:', {
          upcoming: data.upcoming,
          history: data.history
        });
      }, [data]);
      
      useEffect(() => {
        console.log('Cancelling state changed:', cancelling);
      }, [cancelling]);
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const res = await API.get('/dashboard');
            setData(res.data);
            form.setFieldsValue(res.data.user);
        } catch (err) {
            message.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        message.success('Logged out successfully!');
        navigate('/');
    };

    const handleProfileUpdate = async (values) => {
        try {
            const res = await API.put('/dashboard/profile', values);
            setData(prev => ({
                ...prev,
                user: {
                    ...prev.user,
                    ...res.data.user
                }
            }));
            message.success('Profile updated successfully');
            setEditingProfile(false);
        } catch (err) {
            message.error(err.response?.data?.error || 'Failed to update profile');
        }
    };

    const handleCancelBooking = async (bookingId) => {
        try {
            setCancelling(true);
            await API.delete(`/dashboard/bookings/${bookingId}`);
            message.success('Booking cancelled successfully');
            fetchDashboardData(); // Refresh the data
            setModalVisible(false); // Close the modal if open
            setSelectedBooking(null); // Clear selected booking
        } catch (err) {
            message.error(err.response?.data?.error || 'Failed to cancel booking');
        } finally {
            setCancelling(false);
        }
    };

    const columns = [
        {
            title: 'Flight',
            render: (_, record) => (
                <div className="flight-info">
                    <strong>{record.flight_number}</strong>
                    <div>{record.airline}</div>
                </div>
            )
        },
        {
            title: 'Route',
            render: (_, record) => (
                <div className="route-info">
                    {record.departure_city} → {record.arrival_city}
                    <div className="text-muted">
                        {moment(record.departure_time).format("D MMM YYYY, h:mm A")}
                    </div>
                </div>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: status => (
                <Tag color={status === 'Confirmed' ? 'green' : 'orange'}>
                    {status}
                </Tag>
            )
        },
        {
            title: 'Action',
            render: (_, record) => (
              <Space>
                <Button 
                  type="link"
                  onClick={() => {
                    setSelectedBooking(record);
                    setModalVisible(true);
                  }}
                >
                  View
                </Button>
                {record.status === 'Confirmed' && (
                  <Button 
                    type="link" 
                    danger
                    onClick={async (e) => {
                      e.stopPropagation();
                      setCancellingId(record.booking_id);
                      try {
                        await API.delete(`/dashboard/bookings/${record.booking_id}`);
                        message.success('Cancelled!');
                        fetchDashboardData();
                      } catch (err) {
                        message.error(err.response?.data?.error || 'Failed');
                      } finally {
                        setCancellingId(null);
                      }
                    }}
                    loading={cancellingId === record.booking_id}
                  >
                    Cancel
                  </Button>
                )}
              </Space>
            )
          }
    ];
    
    const profileTabContent = editingProfile ? (
        <Card 
            title="Edit Profile"
            extra={
                <Button type="text" onClick={() => setEditingProfile(false)}>
                    Cancel
                </Button>
            }
        >
            <Form
                form={form}
                onFinish={handleProfileUpdate}
                layout="vertical"
            >
                <Item
                    name="name"
                    label="Full Name"
                    rules={[{ required: true, message: 'Please input your name' }]}
                >
                    <Input />
                </Item>
                <Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Please input your email' },
                        { type: 'email', message: 'Please enter a valid email' }
                    ]}
                >
                    <Input />
                </Item>
                <Item
                    name="phone"
                    label="Phone Number"
                    rules={[{ required: true, message: 'Please input your phone number' }]}
                >
                    <Input />
                </Item>
                <Item>
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                        Save Changes
                    </Button>
                </Item>
            </Form>
        </Card>
    ) : (
        <Card 
            title="User Profile" 
            loading={!data.user}
            extra={
                <Button 
                    type="primary" 
                    icon={<EditOutlined />}
                    onClick={() => setEditingProfile(true)}
                >
                    Edit Profile
                </Button>
            }
        >
            {data.user && (
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Name">{data.user.name}</Descriptions.Item>
                    <Descriptions.Item label="Email">{data.user.email}</Descriptions.Item>
                    <Descriptions.Item label="Phone">{data.user.phone}</Descriptions.Item>
                    <Descriptions.Item label="Member Since">
                        {new Date(data.user.created_at).toLocaleDateString()}
                    </Descriptions.Item>
                </Descriptions>
            )}
        </Card>
    );

    const tabItems = [
        {
            key: 'upcoming',
            label: (
                <span>
                    <ClockCircleOutlined /> Upcoming ({data.stats.upcomingCount || 0})
                </span>
            ),
            children: (
                <Table
                    columns={columns}
                    dataSource={data.upcoming}
                    rowKey="booking_id"
                    loading={loading}
                />
            )
        },
        {
            key: 'history',
            label: (
                <span>
                    <HistoryOutlined /> History ({data.stats.pastCount || 0})
                </span>
            ),
            children: (
                <Table
                    columns={columns}
                    dataSource={data.history}
                    rowKey="booking_id"
                    loading={loading}
                />
            )
        },
        {
            key: 'profile',
            label: (
                <span>
                    <SettingOutlined /> Profile
                </span>
            ),
            children: profileTabContent
        }
    ];

    return (
        <div className="dashboard-container">
            <header className="header">
                <div className="logo" onClick={() => navigate("/")}>
                    <img src={logo} alt="Flight Booking Logo" className="logo-img" />
                </div>
                <nav className="nav-links">
                    <Link to="/about-us">About Us</Link>
                    <Link to="/contact-us">Contact Us</Link>
                    <Link to="/help">Help</Link>
                </nav>
                <div className="auth-buttons">
                    <Button type="primary" onClick={() => navigate('/')}>
                        Home
                    </Button>
                    <Button type="primary" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </header>

            <div className="dashboard-header">
                <Avatar size={64} icon={<UserOutlined />} />
                <div>
                    <h1>Welcome back, {data.user?.name || 'User'}!</h1>
                    <div className="stats">
                        <Statistic title="Total Bookings" value={data.stats.totalBookings} />
                        <Statistic title="Upcoming Trips" value={data.stats.upcomingCount} />
                        <Statistic title="Past Trips" value={data.stats.pastCount} />
                    </div>
                </div>
            </div>
            
            <Tabs 
                defaultActiveKey="upcoming" 
                items={tabItems} 
                className="dashboard-tabs"
                onChange={() => window.scrollTo(0, 0)}
            />

            <BookingDetailsModal
                booking={selectedBooking}
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                loading={cancelling && selectedBooking?.booking_id}
            />
        </div>
    );
}