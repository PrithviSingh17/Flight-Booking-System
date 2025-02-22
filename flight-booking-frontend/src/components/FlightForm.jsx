import { useEffect } from "react";
import { Form, Input, Button, DatePicker } from "antd";
import dayjs from "dayjs";

function FlightForm({ flightData, onSubmit, loading }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (flightData) {
      form.setFieldsValue({
        ...flightData,
        departure_time: dayjs(flightData.departure_time),
        arrival_time: dayjs(flightData.arrival_time),
        duration: flightData.duration, // Duration in minutes
      });
    } else {
      form.resetFields();
    }
  }, [flightData, form]);

  // ✅ Calculate duration in minutes
  const calculateDuration = () => {
    const values = form.getFieldsValue();
    if (values.departure_time && values.arrival_time) {
      const depTime = values.departure_time.toDate();
      const arrTime = values.arrival_time.toDate();
      const diffMinutes = Math.max(Math.round((arrTime - depTime) / 60000), 0);

      form.setFieldsValue({
        duration: diffMinutes, // Set duration in minutes
      });
    }
  };

  const handleSubmit = (values) => {
    const payload = {
      ...values,
      departure_time: values.departure_time.toISOString(),
      arrival_time: values.arrival_time.toISOString(),
      duration: values.duration, // Send duration in minutes
    };
    console.log("Payload being sent to backend:", payload); // Debugging
    onSubmit(payload);
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Form.Item label="Flight Number" name="flight_number" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Airline Name" name="airline_name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Departure Airport Name" name="departure_airport_name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Departure Airport Code" name="departure_airport_code" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Departure City" name="departure_city" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Arrival Airport Name" name="arrival_airport_name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Arrival Airport Code" name="arrival_airport_code" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Arrival City" name="arrival_city" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      {/* ✅ Auto-update duration only when times change */}
      <Form.Item label="Departure Time" name="departure_time" rules={[{ required: true }]}>
        <DatePicker showTime onChange={calculateDuration} />
      </Form.Item>
      <Form.Item label="Arrival Time" name="arrival_time" rules={[{ required: true }]}>
        <DatePicker showTime onChange={calculateDuration} />
      </Form.Item>

      {/* ✅ Hidden field to store duration in minutes */}
      <Form.Item name="duration" hidden>
        <Input type="number" />
      </Form.Item>

      <Form.Item label="Price" name="price" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading}>
        {flightData ? "Update Flight" : "Create Flight"}
      </Button>
    </Form>
  );
}

export default FlightForm;