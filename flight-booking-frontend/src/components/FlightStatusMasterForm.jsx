import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";

function FlightStatusMasterForm({ statusData, onSubmit, loading }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (statusData) {
      form.setFieldsValue({
        status_name: statusData.status_name,
      });
    } else {
      form.resetFields();
    }
  }, [statusData, form]);

  const handleSubmit = (values) => {
    onSubmit(values);
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Form.Item label="Status Name" name="status_name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading}>
        {statusData ? "Update Status" : "Create Status"}
      </Button>
    </Form>
  );
}

export default FlightStatusMasterForm;