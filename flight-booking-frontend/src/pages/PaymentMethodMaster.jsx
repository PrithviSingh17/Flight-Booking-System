import React, { useEffect, useState, useRef } from "react";
import { Table, Button, message, Popconfirm, Modal, Input } from "antd";
import API from "../services/api";
import PaymentMethodMasterForm from "../components/PaymentMethodMasterForm";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { CSSTransition } from "react-transition-group";
import "../styles/Animations.css";

function PaymentMethodMaster() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [methodNameFilter, setMethodNameFilter] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [formKey, setFormKey] = useState(0); // Add a key to force form reset
  const nodeRef = useRef(null);

  useEffect(() => {
    setShowContent(true);
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    setLoading(true);
    try {
      const res = await API.get("/payment-methods");
      if (res.data) {
        setPaymentMethods(res.data);
      } else {
        throw new Error("No data returned from the API");
      }
    } catch (err) {
      console.error("Error fetching payment methods:", err);
      message.error("Failed to load payment methods.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/payment-methods/${id}`);
      message.success("Payment method deleted successfully.");
      fetchPaymentMethods();
    } catch (err) {
      console.error("Error deleting payment method:", err);
      message.error("Failed to delete payment method.");
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingMethod) {
        await API.put(`/payment-methods/${editingMethod.method_id}`, values);
        message.success("Payment method updated successfully.");
      } else {
        await API.post("/payment-methods", values);
        message.success("Payment method created successfully.");
      }
      fetchPaymentMethods();
      setIsModalOpen(false);
      setEditingMethod(null);
    } catch (err) {
      console.error("Error saving payment method:", err);
      message.error("Failed to save payment method.");
    }
  };

  const filteredPaymentMethods = paymentMethods.filter((method) =>
    method.method_name.toLowerCase().includes(methodNameFilter.toLowerCase())
  );

  return (
    <CSSTransition
      in={true}
      timeout={300}
      classNames="slide-in-left"
      unmountOnExit
    >
      <div ref={nodeRef}>
        <h2 className="text-xl font-bold mb-4">Payment Method Master</h2>

        <Input
          placeholder="Search by method name"
          value={methodNameFilter}
          onChange={(e) => setMethodNameFilter(e.target.value)}
          style={{ marginBottom: "20px", width: "200px" }}
        />

        <Button
          type="primary"
          onClick={() => {
            setEditingMethod(null); // Reset editingMethod to null for creation
            setIsModalOpen(true);
            setFormKey((prevKey) => prevKey + 1); // Increment key to reset form
          }}
          style={{ marginBottom: "20px", marginLeft: "10px" }}
          icon={<PlusOutlined />}
        >
          Create Payment Method
        </Button>

        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 p-2">Method ID</th>
              <th className="border border-gray-400 p-2">Method Name</th>
              <th className="border border-gray-400 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPaymentMethods.map((method) => (
              <tr key={method.method_id} className="text-center">
                <td className="border border-gray-400 p-2">{method.method_id}</td>
                <td className="border border-gray-400 p-2">{method.method_name}</td>
                <td className="border border-gray-400 p-2">
                  <Button
                    type="link"
                    onClick={() => {
                      setEditingMethod(method); // Set editingMethod for editing
                      setIsModalOpen(true);
                      setFormKey((prevKey) => prevKey + 1); // Increment key to reset form
                    }}
                    icon={<EditOutlined />}
                  >
                    Edit
                  </Button>
                  <Popconfirm
                    title="Are you sure you want to delete this method?"
                    onConfirm={() => handleDelete(method.method_id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="link" danger icon={<DeleteOutlined />}>
                      Delete
                    </Button>
                  </Popconfirm>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal
          title={editingMethod ? "Edit Payment Method" : "Create Payment Method"}
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingMethod(null); // Reset editingMethod when modal is closed
          }}
          footer={null}
        >
          <PaymentMethodMasterForm
            key={formKey} // Use key to force form reset
            methodData={editingMethod} // Pass editingMethod to the form
            onSubmit={handleFormSubmit}
            loading={loading}
          />
        </Modal>
      </div>
    </CSSTransition>
  );
}

export default PaymentMethodMaster;