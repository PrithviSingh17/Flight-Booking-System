import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";

function AirportForm({ airportData, onSubmit, loading }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (airportData) {
      form.setFieldsValue(airportData); // Pre-fill form for editing
    } else {
      form.resetFields(); // Clear form for creating
    }
  }, [airportData, form]);

  const handleSubmit = (values) => {
    onSubmit(values); // Pass values to parent component
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Form.Item
        label="Airport Code"
        name="airport_code"
        rules={[{ required: true, message: "Please enter the airport code" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Airport Name"
        name="airport_name"
        rules={[{ required: true, message: "Please enter the airport name" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="City"
        name="city"
        rules={[{ required: true, message: "Please enter the city" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="State"
        name="state"
        rules={[{ required: true, message: "Please enter the state" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Country"
        name="country"
        rules={[{ required: true, message: "Please enter the country" }]}
      >
        <Input />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        {airportData ? "Update Airport" : "Create Airport"}
      </Button>
    </Form>
  );
}

export default AirportForm;