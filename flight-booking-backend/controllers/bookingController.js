const Booking = require("../models/Booking");
const Passenger = require("../models/Passenger");
const { Op } = require("sequelize");
const BookingStatusMaster = require("../models/BookingStatusMaster"); 


// Create a new booking
exports.createBooking = async (req, res) => {
    const transaction = await sequelize.transaction(); // Start transaction
    try {
        const { flight_id, user_id, total_price, passengers, payment_status } = req.body; 

        // ✅ Step 1: Create Booking
        const newBooking = await Booking.create(
            {
                flight_id,
                user_id,
                booking_status_id: 2, // Default: Pending
                payment_status,
                created_by: req.user.id,
                modified_by: req.user.id
            },
            { transaction }
        );

        // ✅ Step 2: Auto-Add Passengers (if provided)
        if (passengers && passengers.length > 0) {
            const passengerData = passengers.map(passenger => ({
                booking_id: newBooking.booking_id, // Link to the newly created booking
                name: passenger.name,
                age: passenger.age,
                gender: passenger.gender,
                seat_number: passenger.seat_number,
                passport_number: passenger.passport_number,
                nationality: passenger.nationality,
                date_of_birth: passenger.date_of_birth,
                contact_number: passenger.contact_number,
                email: passenger.email,
                special_requests: passenger.special_requests,
                frequent_flyer_number: passenger.frequent_flyer_number,
                baggage_weight: passenger.baggage_weight,
                created_by: req.user.id,
                modified_by: req.user.id
            }));

            // ✅ Bulk Insert into Passengers Table
            await Passenger.bulkCreate(passengerData, { transaction });
        }

        await transaction.commit(); // ✅ Commit transaction if all goes well
        res.status(201).json({ message: "Booking created successfully", booking: newBooking });
    } catch (error) {
        await transaction.rollback(); // ❌ Rollback transaction on error
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

        const booking = await Booking.findByPk(id);
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
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

  
exports.getLatestBooking = async (req, res) => {
    try {
        const latestBooking = await Booking.findOne({
            order: [["created_at", "DESC"]]
        });

        if (!latestBooking) {
            return res.status(404).json({ error: "No bookings found" });
        }

        res.status(200).json(latestBooking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
