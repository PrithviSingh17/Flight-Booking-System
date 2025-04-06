const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const User = require("../models/User");
const PaymentMethodMaster = require("../models/PaymentMethodMaster");
const sequelize= require("../config/db");

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
// In paymentController.js - enhance updatePayment
// Update payment
exports.updatePayment = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { payment_status } = req.body;

        // Status constants
        const STATUS_CONFIRMED = 1;
        const STATUS_PENDING = 2;

        // 1. Find payment with its booking
        const payment = await Payment.findByPk(id, {
            include: [Booking],
            transaction
        });

        if (!payment) {
            await transaction.rollback();
            return res.status(404).json({ error: "Payment not found" });
        }

        // 2. Update payment status
        await payment.update({ payment_status }, { transaction });

        // 3. Update the outbound booking
        // When payment succeeds, set to CONFIRMED (1)
        // When payment fails or pending, set to PENDING (2)
        const newBookingStatus = payment_status === 'Success' ? STATUS_CONFIRMED : STATUS_PENDING;
        await payment.Booking.update({
            payment_status: payment_status,
            booking_status_id: newBookingStatus
        }, { transaction });

        // 4. For round trips: Find and update return booking
        if (payment.Booking.is_roundtrip) {
            const returnBooking = await Booking.findOne({
                where: { roundtrip_id: payment.booking_id },
                transaction
            });
            
            if (returnBooking) {
                await returnBooking.update({
                    payment_status: payment_status,
                    booking_status_id: newBookingStatus
                }, { transaction });
            }
        }

        await transaction.commit();
        res.status(200).json({ 
            success: true,
            message: "Payment and bookings updated"
        });

    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ 
            error: "Update failed",
            details: error.message 
        });
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