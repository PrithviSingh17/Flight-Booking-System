const Passenger = require("../models/Passenger");
const Booking = require("../models/Booking");


exports.createPassenger = async (req, res) => {
    try {
        const { booking_id, passengers } = req.body;

        if (!booking_id || !Array.isArray(passengers) || passengers.length === 0) {
            return res.status(400).json({ error: "Invalid request. Ensure booking_id and passengers array are provided." });
        }

        
        const passengersData = passengers.map(p => ({
            ...p,
            booking_id,
            created_by: req.user.id,
            modified_by: req.user.id
        }));

        
        const newPassengers = await Passenger.bulkCreate(passengersData);

        res.status(201).json({ message: "Passengers added successfully", passengers: newPassengers });
    } catch (error) {
        console.error("Error Adding Passengers:", error);
        res.status(500).json({ error: error.message });
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
