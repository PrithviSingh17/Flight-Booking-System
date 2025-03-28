const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const User = require("../models/User");
const PaymentMethodMaster = require("../models/PaymentMethodMaster");


// Create a new payment
exports.createPayment = async (req, res) => {
    try {
        const newPayment = await Payment.create({
            booking_id: req.body.booking_id,
            user_id: req.body.user_id,
            amount: req.body.amount,
            payment_method_id: req.body.payment_method_id,
            payment_status: req.body.payment_status ?? 'Pending',
            created_by: req.user.user_id,
            modified_by: req.user.user_id
        });

        res.status(201).json(newPayment);
    } catch (error) {
        console.error("Error Creating Payment:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get all payments
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll({
            include: [
                { model: Booking },
                { model: User },
                { model: PaymentMethodMaster }
            ]
        });
        res.status(200).json(payments);
    } catch (error) {
        console.error("Error Fetching Payments:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findByPk(id, {
            include: [
                { model: Booking },
                { model: User },
                { model: PaymentMethodMaster }
            ]
        });

        if (!payment) return res.status(404).json({ error: "Payment not found" });

        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update payment
exports.updatePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { payment_status, amount, payment_method_id } = req.body;

        const payment = await Payment.findByPk(id);
        if (!payment) {
            return res.status(404).json({ error: "Payment not found" });
        }

        await payment.update({
            payment_status,
            amount,
            payment_method_id,
            modified_by: req.user.user_id
        });

        res.status(200).json({ message: "Payment updated successfully", payment });
    } catch (error) {
        console.error("Error Updating Payment:", error);
        res.status(500).json({ error: error.message });
    }
};

// Delete payment
exports.deletePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findByPk(id);
        if (!payment) return res.status(404).json({ error: "Payment not found" });

        await payment.destroy();
        res.status(200).json({ message: "Payment deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};