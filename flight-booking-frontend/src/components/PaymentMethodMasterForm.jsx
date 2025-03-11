import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";

function PaymentMethodMasterForm({ methodData, onSubmit, loading }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (methodData) {
      form.setFieldsValue({
        method_name: methodData.method_name,
      });
    } else {
      form.resetFields();
    }
  }, [methodData, form]);

  const handleSubmit = (values) => {
    onSubmit(values);
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Form.Item label="Method Name" name="method_name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading}>
        {methodData ? "Update Method" : "Create Method"}
      </Button>
    </Form>
  );
}

export default PaymentMethodMasterForm;