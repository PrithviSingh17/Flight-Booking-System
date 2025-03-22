import React from "react";
import { Form, DatePicker, Select, Button, Radio } from "antd";
import { useNavigate } from "react-router-dom";
import "../styles/SearchBar.css"; // Import the CSS file

const { Option } = Select;

const SearchBar = ({ initialValues }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [tripType, setTripType] = React.useState(initialValues?.tripType || "one-way"); // Default to "one-way"

  // Set initial values when the component mounts or initialValues prop changes
  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setTripType(initialValues.tripType || "one-way");
    }
  }, [initialValues, form]);

  // Handle trip type change
  const handleTripTypeChange = (e) => {
    const newTripType = e.target.value;
    setTripType(newTripType);

    // Clear return date if switching to "one-way"
    if (newTripType === "one-way") {
      form.setFieldsValue({ returnDate: null });
    }
  };

  const onFinish = (values) => {
    const { departureCity, arrivalCity, departureDate, returnDate, passengers } = values;

    // Navigate to the SearchResults page with search parameters
    navigate(
      `/search-results?departureCity=${departureCity}&arrivalCity=${arrivalCity}&departureDate=${departureDate?.format(
        "YYYY-MM-DD"
      )}&returnDate=${returnDate?.format("YYYY-MM-DD")}&passengers=${passengers}&tripType=${tripType}`
    );
  };

  // List of cities for dropdown
  const cities = [
    "New Delhi",
    "Bengaluru",
    "Chennai",
    "Hyderabad",
    "Kolkata",
    "Pune",
    "Ahmedabad",
    "Goa",
    "Kochi",
    "Jaipur",
    "Lucknow",
    "Bhubaneswar",
    "Srinagar",
    "Vijayawada",
    "Thiruvananthapuram",
    "Chandigarh",
    "Mumbai",
    "Siliguri",
  ];

  // Passengers options (1 to 10)
  const passengersOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <Form
      form={form}
      layout="inline"
      onFinish={onFinish}
      className="search-form"
      initialValues={initialValues}
    >
      {/* Trip Type Radio Group */}
      <Form.Item name="tripType" initialValue={tripType}>
        <Radio.Group onChange={handleTripTypeChange} className="trip-type-radio-group">
          <Radio value="one-way" className="trip-radio">
            One Way
          </Radio>
          <Radio value="return" className="trip-radio">
            Return Trip
          </Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item name="departureCity" rules={[{ required: true, message: "Please select departure city!" }]}>
        <Select showSearch placeholder="Departure City" className="search-input" optionFilterProp="children">
          {cities.map((city) => (
            <Option key={city} value={city}>
              {city}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="arrivalCity" rules={[{ required: true, message: "Please select arrival city!" }]}>
        <Select showSearch placeholder="Arrival City" className="search-input" optionFilterProp="children">
          {cities.map((city) => (
            <Option key={city} value={city}>
              {city}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="departureDate" rules={[{ required: true, message: "Please select departure date!" }]}>
        <DatePicker style={{ width: "100%" }} className="search-input" placeholder="Departure Date" />
      </Form.Item>
      {/* Conditionally render Return Date based on tripType */}
      <Form.Item
        name="returnDate"
        rules={[
          {
            required: tripType === "return",
            message: "Please select return date!",
          },
        ]}
      >
        <DatePicker
          style={{ width: "100%" }}
          className="search-input"
          placeholder="Return Date"
          disabled={tripType === "one-way"} // Disable if tripType is "one-way"
        />
      </Form.Item>
      <Form.Item name="passengers" rules={[{ required: true, message: "Please select number of passengers!" }]}>
        <Select placeholder="Passengers" className="search-input">
          {passengersOptions.map((num) => (
            <Option key={num} value={num}>
              {num}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="search-button">
          Search Flights
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SearchBar;