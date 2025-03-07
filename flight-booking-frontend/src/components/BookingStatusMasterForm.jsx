import React from "react";
import { Form, Input, Button } from "antd";

function BookingStatusMasterForm({ statusData, onSubmit, loading }) {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (statusData) {
      form.setFieldsValue(statusData); // Pre-fill form for editing
    } else {
      form.resetFields(); // Clear form for creating
    }
  }, [statusData, form]);

  const handleSubmit = (values) => {
    onSubmit(values); // Pass values to parent component
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Form.Item
        label="Status Name"
        name="status_name"
        rules={[{ required: true, message: "Please enter the status name" }]}
      >
        <Input />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        {statusData ? "Update Status" : "Create Status"}
      </Button>
    </Form>
  );
}

export default BookingStatusMasterForm;