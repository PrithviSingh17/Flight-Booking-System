import React, { useEffect } from "react"; // Import useEffect
import { Form, Input, Button } from "antd";

function FlightStatusForm({ onSubmit, initialValues }) {
  const [form] = Form.useForm();

  // Use useEffect to set initial values
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues); // Set initial values if editing
    } else {
      form.resetFields(); // Reset form if creating
    }
  }, [initialValues, form]);

  return (
    <Form layout="vertical" form={form} onFinish={onSubmit}>
      <Form.Item label="Flight ID" name="flight_id" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Status" name="status_name_id" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        {initialValues ? "Update" : "Create"}
      </Button>
    </Form>
  );
}

export default FlightStatusForm;