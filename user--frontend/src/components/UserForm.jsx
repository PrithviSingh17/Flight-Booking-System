import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";

const UserForm = ({ onSubmit, initialValues, form }) => {
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields(); // Clear the form when initialValues is null
    }
  }, [initialValues, form]);

  return (
    <Form layout="vertical" form={form} onFinish={onSubmit}>
      <Form.Item label="Name" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
        <Input />
      </Form.Item>
      <Form.Item
        label="Phone"
        name="phone"
        rules={[
          { required: true },
          { len: 10, message: "Phone number must be exactly 10 digits" },
        ]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item label="Password" name="password" rules={[{ required: true }]}>
        <Input.Password />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Register
      </Button>
    </Form>
  );
};

export default UserForm;