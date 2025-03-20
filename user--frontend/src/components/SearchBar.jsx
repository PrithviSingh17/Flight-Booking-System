import React from "react";
import { Form, DatePicker, Select, Button } from "antd";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const SearchBar = ({ initialValues }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm(); // Add form instance

  // Set initial values when the component mounts or initialValues prop changes
  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const onFinish = (values) => {
    const { departureCity, arrivalCity, departureDate, returnDate, passengers } = values;

    // Navigate to the SearchResults page with search parameters
    navigate(
      `/search-results?departureCity=${departureCity}&arrivalCity=${arrivalCity}&departureDate=${departureDate?.format(
        "YYYY-MM-DD"
      )}&returnDate=${returnDate?.format("YYYY-MM-DD")}&passengers=${passengers}`
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
      form={form} // Connect the form instance
      layout="inline"
      onFinish={onFinish}
      className="search-form"
      initialValues={initialValues} // Set initial values
    >
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
      <Form.Item name="returnDate">
        <DatePicker style={{ width: "100%" }} className="search-input" placeholder="Return Date" />
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