const Booking = require("../models/Booking");
const { Op } = require("sequelize");
const BookingStatusMaster = require("../models/BookingStatusMaster"); 


// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        
        console.log("Received Payment Status:", req.body.payment_status); // Log received data
        console.log("Type of payment_status:", typeof req.body.payment_status);
        const { user_id, flight_id, booking_status_id, payment_status, booking_date } = req.body;

        const newBooking = await Booking.create({
            user_id,
            flight_id,
            booking_status_id,
            payment_status: payment_status ?? 'Pending',
            booking_date,
            created_by: user_id,  // Set created_by as the logged-in user
            modified_by: user_id  // Initially, modified_by is also the creator
        });
        res.status(201).json(newBooking);
    } catch (error) {
        console.error("Error Creating Booking:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get all bookings (Admin Only)
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get booking details by ID
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

// Update booking (Admin Only)
exports.updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { booking_status_id, payment_status, modified_by } = req.body;

        // Log the payment_status to ensure it's correct
        console.log("DEBUG: Payment Status ->", payment_status);

        const booking = await Booking.findByPk(id);
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        // Normalize payment_status (if necessary)
        const validPaymentStatuses = ['Success', 'Failed', 'Pending'];
        if (payment_status && !validPaymentStatuses.includes(payment_status)) {
            return res.status(400).json({ error: `Invalid payment status. Allowed values: ${validPaymentStatuses.join(', ')}` });
        }

        // Update only the fields that are provided
        await booking.update({
            booking_status_id: booking_status_id ?? booking.booking_status_id,
            payment_status: payment_status ?? booking.payment_status, // Ensure it updates properly
            modified_by: modified_by ?? booking.modified_by
        });

        res.status(200).json(booking);
    } catch (error) {
        console.error("Error Updating Booking:", error);
        res.status(500).json({ error: error.message });
    }
};

// Cancel a booking (Delete)
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

  
