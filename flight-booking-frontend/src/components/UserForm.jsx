import React, { useEffect } from "react";
import { Form, Input, Button , Select} from "antd";

function UserForm({ onSubmit, initialValues }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
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
      <Form.Item label="Role" name="role" rules={[{ required: true }]}>
        <Select>
          <Select.Option value="Admin">Admin</Select.Option>
          <Select.Option value="User">User</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Created By" name="created_by" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Modified By" name="modified_by" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        {initialValues ? "Update" : "Create"}
      </Button>
    </Form>
  );
}

export default UserForm;