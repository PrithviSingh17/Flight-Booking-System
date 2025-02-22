import { useEffect } from "react";
import { Form, Input, Button, InputNumber, DatePicker } from "antd";
import dayjs from "dayjs";

function FlightForm({ flightData, onSubmit, loading }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (flightData) {
      form.setFieldsValue({
        ...flightData,
        departure_time: dayjs(flightData.departure_time),
        arrival_time: dayjs(flightData.arrival_time),
      });
    }
  }, [flightData, form]);

  return (
    <Form layout="vertical" form={form} onFinish={onSubmit}>
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
      <Form.Item label="Departure Time" name="departure_time" rules={[{ required: true }]}>
        <DatePicker showTime />
      </Form.Item>
      <Form.Item label="Arrival Time" name="arrival_time" rules={[{ required: true }]}>
        <DatePicker showTime />
      </Form.Item>
      <Form.Item label="Duration (minutes)" name="duration" rules={[{ required: true }]}>
        <InputNumber min={1} />
      </Form.Item>
      <Form.Item label="Price" name="price" rules={[{ required: true }]}>
        <InputNumber min={0} />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        {flightData ? "Update Flight" : "Create Flight"}
      </Button>
    </Form>
  );
}

export default FlightForm;
