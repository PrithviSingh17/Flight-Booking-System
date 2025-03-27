import React from "react";
import { Form, DatePicker, Select, Button, Radio } from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "../styles/SearchBar.css";

const { Option } = Select;

const SearchBar = ({ initialValues }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [tripType, setTripType] = React.useState("one-way");

  // Store dates as moment objects in state
  const [dates, setDates] = React.useState({
    departureDate: null,
    returnDate: null
  });

  React.useEffect(() => {
    if (initialValues) {
      const departureMoment = initialValues.departureDate ? moment(initialValues.departureDate) : null;
      const returnMoment = initialValues.returnDate ? moment(initialValues.returnDate) : null;
      
      setDates({
        departureDate: departureMoment,
        returnDate: returnMoment
      });

      const initialTripType = returnMoment ? "return" : "one-way";
      setTripType(initialTripType);

      form.setFieldsValue({
        ...initialValues,
        departureDate: departureMoment,
        returnDate: returnMoment,
        tripType: initialTripType
      });
    }
  }, [initialValues, form]);

  const handleTripTypeChange = (e) => {
    const newTripType = e.target.value;
    setTripType(newTripType);
    
    if (newTripType === "one-way") {
      form.setFieldsValue({ returnDate: null });
      setDates(prev => ({ ...prev, returnDate: null }));
    }
  };

  const handleReturnDateChange = (date) => {
    setDates(prev => ({ ...prev, returnDate: date }));
    if (date) {
      setTripType("return");
      form.setFieldsValue({ tripType: "return" });
    }
  };

  const handleDepartureDateChange = (date) => {
    setDates(prev => ({ ...prev, departureDate: date }));
    const returnDate = form.getFieldValue('returnDate');
    if (returnDate && returnDate.isBefore(date, 'day')) {
      form.setFieldsValue({ returnDate: null });
      setDates(prev => ({ ...prev, returnDate: null }));
    }
  };

  const onFinish = (values) => {
    const { departureCity, arrivalCity, passengers } = values;
    const finalTripType = dates.returnDate ? "return" : "one-way";

    navigate(
      `/search-results?departureCity=${departureCity}&arrivalCity=${arrivalCity}&departureDate=${
        dates.departureDate?.format("YYYY-MM-DD") || ""
      }&returnDate=${dates.returnDate?.format("YYYY-MM-DD") || ""}&passengers=${passengers}&tripType=${finalTripType}`
    );
  };

  const cities = [
    "New Delhi", "Bengaluru", "Chennai", "Hyderabad", "Kolkata",
    "Pune", "Ahmedabad", "Goa", "Kochi", "Jaipur",
    "Lucknow", "Bhubaneswar", "Srinagar", "Vijayawada",
    "Thiruvananthapuram", "Chandigarh", "Mumbai", "Siliguri",
  ];

  const passengersOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <Form
      form={form}
      layout="inline"
      onFinish={onFinish}
      className="search-form"
      initialValues={{
        tripType: "one-way",
        passengers: 1
      }}
    >
      <Form.Item name="tripType">
        <Radio.Group onChange={handleTripTypeChange} className="trip-type-radio-group">
          <Radio.Button value="one-way" className="trip-radio-button">One Way</Radio.Button>
          <Radio.Button value="return" className="trip-radio-button">Return Trip</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item name="departureCity" rules={[{ required: true, message: "Please select departure city!" }]}>
        <Select showSearch placeholder="Departure City" className="search-input">
          {cities.map(city => (
            <Option key={city} value={city}>{city}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="arrivalCity" rules={[{ required: true, message: "Please select arrival city!" }]}>
        <Select showSearch placeholder="Arrival City" className="search-input">
          {cities.map(city => (
            <Option key={city} value={city}>{city}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="departureDate" rules={[{ required: true, message: "Please select departure date!" }]}>
        <DatePicker 
          className="search-input date-picker"
          placeholder="Departure Date"
          format="YYYY-MM-DD"
          value={dates.departureDate}
          onChange={handleDepartureDateChange}
          disabledDate={current => current && current < moment().startOf('day')}
          getPopupContainer={trigger => trigger.parentNode}
        />
      </Form.Item>

      <Form.Item name="returnDate">
        <DatePicker
          className={`search-input date-picker ${tripType === "one-way" ? "hidden-return" : ""}`}
          placeholder="Return Date"
          format="YYYY-MM-DD"
          value={dates.returnDate}
          onChange={handleReturnDateChange}
          disabledDate={current => {
            if (!dates.departureDate) return current && current < moment().startOf('day');
            return current && (
              current < moment().startOf('day') ||
              current < dates.departureDate.clone().startOf('day')
            );
          }}
          getPopupContainer={trigger => trigger.parentNode}
        />
      </Form.Item>

      <Form.Item name="passengers" rules={[{ required: true, message: "Please select number of passengers!" }]}>
        <Select placeholder="Passengers" className="search-input">
          {passengersOptions.map(num => (
            <Option key={num} value={num}>{num}</Option>
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