const PaymentMethodMaster = require("../models/PaymentMethodMaster");

// Create a new payment method
exports.createPaymentMethod = async (req, res) => {
    try {
        console.log("Request Payload:", req.body);
      const newPaymentMethod = await PaymentMethodMaster.create({
        method_name: req.body.method_name,
        created_by: req.user.user_id,
        modified_by: req.user.user_id,
      });
      res.status(201).json(newPaymentMethod);
    } catch (error) {
      console.error("Error Creating Payment Method:", error);
      res.status(500).json({ error: error.message });
    }
  };

// Get all payment methods
exports.getAllPaymentMethods = async (req, res) => {
    try {
        const paymentMethods = await PaymentMethodMaster.findAll();
        res.status(200).json(paymentMethods);
    } catch (error) {
        console.error("Error Fetching Payment Methods:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get payment method by ID
exports.getPaymentMethodById = async (req, res) => {
    try {
        const { id } = req.params;
        const paymentMethod = await PaymentMethodMaster.findByPk(id);

        if (!paymentMethod) return res.status(404).json({ error: "Payment Method not found" });

        res.status(200).json(paymentMethod);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update payment method
exports.updatePaymentMethod = async (req, res) => {
    try {
        const { id } = req.params;
        const { method_name } = req.body;

        const paymentMethod = await PaymentMethodMaster.findByPk(id);
        if (!paymentMethod) {
            return res.status(404).json({ error: "Payment Method not found" });
        }

        await paymentMethod.update({
            method_name,
            modified_by: req.user.user_id
        });

        res.status(200).json({ message: "Payment Method updated successfully", paymentMethod });
    } catch (error) {
        console.error("Error Updating Payment Method:", error);
        res.status(500).json({ error: error.message });
    }
};

// Delete payment method
exports.deletePaymentMethod = async (req, res) => {
    try {
        const { id } = req.params;
        const paymentMethod = await PaymentMethodMaster.findByPk(id);
        if (!paymentMethod) return res.status(404).json({ error: "Payment Method not found" });

        await paymentMethod.destroy();
        res.status(200).json({ message: "Payment Method deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};