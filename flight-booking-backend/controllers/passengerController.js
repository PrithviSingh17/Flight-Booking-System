const Passenger = require("../models/Passenger");
const Booking = require("../models/Booking");
const sequelize = require("../config/db");


exports.createPassengersForBooking = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { booking_id, return_booking_id, passengers } = req.body;

        // Validate booking exists
        const [booking, returnBooking] = await Promise.all([
            Booking.findByPk(booking_id, { transaction }),
            return_booking_id ? Booking.findByPk(return_booking_id, { transaction }) : null
        ]);

        if (!booking || (return_booking_id && !returnBooking)) {
            await transaction.rollback();
            return res.status(404).json({ 
                error: "Booking not found",
                solution: "Verify booking IDs before passenger creation"
            });
        }

        // Atomic passenger creation
        const outboundPassengers = passengers.map(p => ({
            ...p,
            booking_id,
            created_by: req.user.user_id
        }));

        const createdPassengers = await Passenger.bulkCreate(outboundPassengers, { 
            transaction,
            returning: true 
        });

        // For roundtrips
        if (returnBooking) {
            const returnPassengers = passengers.map(p => ({
                ...p,
                booking_id: return_booking_id,
                created_by: req.user.user_id
            }));
            await Passenger.bulkCreate(returnPassengers, { transaction });
        }

        await transaction.commit();
        res.status(201).json({
            success: true,
            passenger_count: createdPassengers.length,
            booking_ids: {
                outbound: booking_id,
                return: return_booking_id || null
            }
        });

    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            error: "Passenger creation failed",
            details: error.message,
            recovery_advice: "Retry with same booking IDs"
        });
    }
};

exports.getAllPassengers = async (req, res) => {
    try {
        const passengers = await Passenger.findAll();
        res.status(200).json(passengers);
    } catch (error) {
        console.error("Error Fetching Passengers:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getPassengerById = async (req, res) => {
    try {
        const { id } = req.params;
        const passenger = await Passenger.findByPk(id, { include: Booking });

        if (!passenger) return res.status(404).json({ error: "Passenger not found" });

        res.status(200).json(passenger);
    } catch (error) {
        console.error("Error Fetching Passenger:", error);
        res.status(500).json({ error: error.message });
    }
};


exports.updatePassenger = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, gender, seat_number, passport_number, nationality, date_of_birth, contact_number, email, special_requests, frequent_flyer_number, baggage_weight } = req.body;

        const passenger = await Passenger.findByPk(id);
        if (!passenger) return res.status(404).json({ error: "Passenger not found" });

        await passenger.update({
            name,
            age,
            gender,
            seat_number,
            passport_number,
            nationality,
            date_of_birth,
            contact_number,
            email,
            special_requests,
            frequent_flyer_number,
            baggage_weight,
            modified_by: req.user.id
        });

        res.status(200).json({ message: "Passenger updated successfully", passenger });
    } catch (error) {
        console.error("Error Updating Passenger:", error);
        res.status(500).json({ error: error.message });
    }
};


exports.deletePassenger = async (req, res) => {
    try {
        const { id } = req.params;
        const passenger = await Passenger.findByPk(id);
        if (!passenger) return res.status(404).json({ error: "Passenger not found" });

        await passenger.destroy();
        res.status(200).json({ message: "Passenger deleted successfully" });
    } catch (error) {
        console.error("Error Deleting Passenger:", error);
        res.status(500).json({ error: error.message });
    }
};
