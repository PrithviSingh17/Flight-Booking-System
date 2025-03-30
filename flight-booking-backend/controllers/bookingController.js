const Booking = require("../models/Booking");
const Passenger = require("../models/Passenger");
const Flight = require("../models/Flight");
const Payment = require("../models/Payment");
const sequelize = require("../config/db");
const moment = require('moment');
const BookingStatusMaster = require("../models/BookingStatusMaster");
// Helper function for seat assignment
const generateSeatNumber = () => {
  const letters = 'ABCDEF';
  const randomLetter = letters[Math.floor(Math.random() * letters.length)];
  const randomNumber = Math.floor(Math.random() * 30) + 1; // 1-30
  return `${randomLetter}${randomNumber}`;
};

exports.createCompleteBooking = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { flight_id, return_flight_id, passengers } = req.body;
        const is_roundtrip = !!return_flight_id;

        // Validate flights
        const [outboundFlight, returnFlight] = await Promise.all([
            Flight.findByPk(flight_id, { transaction }),
            is_roundtrip ? Flight.findByPk(return_flight_id, { transaction }) : null
        ]);

        if (!outboundFlight || (is_roundtrip && !returnFlight)) {
            await transaction.rollback();
            return res.status(400).json({ error: "Invalid flight selection" });
        }

        // Convert prices to numbers and calculate totals
        const outboundPrice = Number(outboundFlight.price);
        const outboundTotal = parseFloat((outboundPrice * passengers.length).toFixed(2));

        // Create outbound booking
        const outboundBooking = await Booking.create({
            user_id: req.user.user_id,
            flight_id,
            booking_status_id: 1,
            booking_date: moment().format("YYYY-MM-DD"),
            is_roundtrip,
            total_price: outboundTotal,
            payment_status: 'Pending',
            created_by: req.user.user_id,
            modified_by: req.user.user_id,
            roundtrip_id: null
        }, { transaction });

        let returnBooking = null;
        let returnTotal = 0; // Initialize returnTotal here

        if (is_roundtrip) {
            // Calculate return trip total
            const returnPrice = Number(returnFlight.price);
            returnTotal = parseFloat((returnPrice * passengers.length).toFixed(2));

            // Create return booking
            returnBooking = await Booking.create({
                user_id: req.user.user_id,
                flight_id: return_flight_id,
                booking_status_id: 1,
                booking_date: moment().format("YYYY-MM-DD"),
                is_roundtrip,
                roundtrip_id: outboundBooking.booking_id,
                total_price: returnTotal,
                payment_status: 'Pending',
                created_by: req.user.user_id,
                modified_by: req.user.user_id
            }, { transaction });

            // Update outbound with combined total (as number)
            const combinedTotal = parseFloat((outboundTotal + returnTotal).toFixed(2));
            await outboundBooking.update({
                roundtrip_id: returnBooking.booking_id,
                total_price: combinedTotal
            }, { transaction });
        }

        // Create passengers with seat numbers
        const outboundPassengers = passengers.map(p => ({
            ...p,
            booking_id: outboundBooking.booking_id,
            created_by: req.user.user_id,
            modified_by: req.user.user_id,
            seat_number: generateSeatNumber()
        }));

        await Passenger.bulkCreate(outboundPassengers, { transaction });

        if (is_roundtrip && returnBooking) {
            const returnPassengers = passengers.map(p => ({
                ...p,
                booking_id: returnBooking.booking_id,
                created_by: req.user.user_id,
                modified_by: req.user.user_id,
                seat_number: generateSeatNumber()
            }));
            await Passenger.bulkCreate(returnPassengers, { transaction });
        }

        // Create payment record
        const paymentAmount = is_roundtrip 
            ? parseFloat((outboundTotal + returnTotal).toFixed(2))
            : outboundTotal;

        const payment = await Payment.create({
            booking_id: outboundBooking.booking_id,
            user_id: req.user.user_id,
            amount: paymentAmount,
            payment_method_id: 1,
            payment_status: 'Pending',
            created_by: req.user.user_id
        }, { transaction });

        await transaction.commit();

        res.status(201).json({
            success: true,
            booking_id: outboundBooking.booking_id,
            return_booking_id: returnBooking?.booking_id || null,
            payment_id: payment.payment_id,
            amount: paymentAmount,
            seat_numbers: outboundPassengers.map(p => p.seat_number)
        });

    } catch (error) {
        await transaction.rollback();
        console.error("Booking error:", error);
        res.status(500).json({ 
            error: "Booking failed",
            details: error.message
        });
    }
};

exports.createBookingWithPassengers = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { user_id, flight_id, return_flight_id, passengers, booking_date } = req.body;
        const is_roundtrip = !!return_flight_id;

        // Validate flights exist
        const [outboundFlight, returnFlight] = await Promise.all([
            Flight.findByPk(flight_id, { transaction }),
            is_roundtrip ? Flight.findByPk(return_flight_id, { transaction }) : null
        ]);

        if (!outboundFlight || (is_roundtrip && !returnFlight)) {
            await transaction.rollback();
            return res.status(400).json({ error: "Invalid flight selection" });
        }

        // Roundtrip validation
        if (is_roundtrip) {
            if (outboundFlight.arrival_city !== returnFlight.departure_city || 
                outboundFlight.departure_city !== returnFlight.arrival_city) {
                await transaction.rollback();
                return res.status(400).json({ error: "Return flight must be reverse route" });
            }
        }

        // Create bookings
        const outboundBooking = await Booking.create({
            user_id,
            flight_id,
            booking_status_id: 1, // Confirmed
            booking_date,
            is_roundtrip,
            total_price: outboundFlight.price * passengers.length,
            created_by: req.user.user_id
        }, { transaction });

        let returnBooking = null;
        if (is_roundtrip) {
            returnBooking = await Booking.create({
                user_id,
                flight_id: return_flight_id,
                booking_status_id: 1,
                booking_date,
                is_roundtrip,
                roundtrip_id: outboundBooking.booking_id,
                total_price: returnFlight.price * passengers.length,
                created_by: req.user.user_id
            }, { transaction });

            await outboundBooking.update({ 
                roundtrip_id: returnBooking.booking_id,
                total_price: outboundBooking.total_price + returnBooking.total_price
            }, { transaction });
        }

        await transaction.commit();
        
        // SINGLE RESPONSE - REMOVED THE DUPLICATE RESPONSE
        res.status(201).json({
            success: true,
            outbound_booking: outboundBooking,
            return_booking: returnBooking,
            next_step: `POST /passengers with booking IDs`
        });

    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            error: "Booking creation failed",
            details: error.message,
            system_action: "All database changes rolled back"
        });
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

  
