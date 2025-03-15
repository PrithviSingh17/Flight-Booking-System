const Booking = require("../models/Booking");
const { Op } = require("sequelize");
const BookingStatusMaster = require("../models/BookingStatusMaster"); 
const Passenger = require("../models/Passenger");

const { sequelize } = require("../config/db");

exports.createBookingWithPassengers = async (req, res) => {
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
        const { user_id, flight_id, booking_status_id, payment_status, booking_date, passengers } = req.body;

        // Validate required fields
        if (!user_id || !flight_id || !booking_status_id || !booking_date || !passengers || passengers.length === 0) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Create the booking
        const booking = await Booking.create(
            {
                user_id,
                flight_id,
                booking_status_id,
                payment_status: payment_status || "Pending", // Default to "Pending"
                booking_date,
                created_by: req.user.user_id,
                modified_by: req.user.user_id,
            },
            { transaction }
        );

        // Add passengers to the booking
        const passengerData = passengers.map((passenger) => ({
            ...passenger,
            booking_id: booking.booking_id,
            created_by: req.user.user_id,
            modified_by: req.user.user_id,
        }));

        await Passenger.bulkCreate(passengerData, { transaction });

        // Commit the transaction
        await transaction.commit();

        // Fetch the booking with passengers to return in the response
        const bookingWithPassengers = await Booking.findOne({
            where: { booking_id: booking.booking_id },
            include: [
                { model: Passenger, as: "passengers" },
                { model: User, as: "user" },
                { model: Flight, as: "flight" },
                { model: BookingStatusMaster, as: "status" },
            ],
        });

        res.status(201).json(bookingWithPassengers);
    } catch (error) {
        // Rollback the transaction in case of error
        await transaction.rollback();
        console.error("Error creating booking:", error);
        res.status(500).json({ message: "Error creating booking", error: error.message });
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
exports.getBookingsByUserId = async (req, res) => {
    try {
        const userId = req.user.user_id; // Get the user ID from the authenticated user
        const bookings = await Booking.findAll({
            where: { user_id: userId },
            include: [
                { model: Passenger, as: "passengers" },
                { model: User, as: "user" },
                { model: Flight, as: "flight" },
                { model: BookingStatusMaster, as: "status" },
            ],
        });

        if (bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found for this user" });
        }

        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: "Error fetching bookings", error: error.message });
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

  
