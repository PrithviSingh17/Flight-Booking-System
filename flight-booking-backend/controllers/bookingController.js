const Booking = require("../models/Booking");
const { Op } = require("sequelize");
const BookingStatusMaster = require("../models/BookingStatusMaster"); 



exports.createBooking = async (req, res) => {
    try {
        
        console.log("Received Payment Status:", req.body.payment_status); 
        console.log("Type of payment_status:", typeof req.body.payment_status);
        const { user_id, flight_id, booking_status_id, payment_status, booking_date } = req.body;

        const newBooking = await Booking.create({
            user_id,
            flight_id,
            booking_status_id,
            payment_status: payment_status ?? 'Pending',
            booking_date,
            created_by: user_id,  
            modified_by: user_id  
        });
        res.status(201).json(newBooking);
    } catch (error) {
        console.error("Error Creating Booking:", error);
        res.status(500).json({ error: error.message });
    }
};


exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findByPk(id);
        if (!booking) return res.status(404).json({ error: "Booking not found" });
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { booking_status_id, payment_status, modified_by } = req.body;

       
        console.log("DEBUG: Payment Status ->", payment_status);

        const booking = await Booking.findByPk(id);
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

       
        const validPaymentStatuses = ['Success', 'Failed', 'Pending'];
        if (payment_status && !validPaymentStatuses.includes(payment_status)) {
            return res.status(400).json({ error: `Invalid payment status. Allowed values: ${validPaymentStatuses.join(', ')}` });
        }

        
        await booking.update({
            booking_status_id: booking_status_id ?? booking.booking_status_id,
            payment_status: payment_status ?? booking.payment_status, 
            modified_by: modified_by ?? booking.modified_by
        });

        res.status(200).json(booking);
    } catch (error) {
        console.error("Error Updating Booking:", error);
        res.status(500).json({ error: error.message });
    }
};


exports.cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findByPk(id);
        if (!booking) return res.status(404).json({ error: "Booking not found" });

        await booking.destroy();
        res.status(200).json({ message: "Booking cancelled successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getBookingWithStatus = async (bookingId) => {
    return await Booking.findByPk(bookingId, {
        include: [{ model: BookingStatusMaster, as: "status", attributes: ["status_name"] }],
    });
};

  
