const FlightStatus = require('../models/FlightStatus');

exports.getAllFlightStatuses = async (req, res) => {
    try {
        const flightStatuses = await FlightStatus.getAll();
        res.json(flightStatuses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFlightStatusById = async (req, res) => {
    try {
        const flightStatus = await FlightStatus.getById(req.params.id);
        if (!flightStatus) return res.status(404).json({ error: "Flight status not found" });
        res.json(flightStatus);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createFlightStatus = async (req, res) => {
    try {
        const newFlightStatus = await FlightStatus.create(req.body);
        res.status(201).json(newFlightStatus);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateFlightStatus = async (req, res) => {
    try {
        const updatedFlightStatus = await FlightStatus.update(req.params.id, req.body.status_name_id, req.body.updated_at);
        if (!updatedFlightStatus) return res.status(404).json({ error: "Flight status not found" });
        res.json(updatedFlightStatus);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteFlightStatus = async (req, res) => {
    try {
        const deletedFlightStatus = await FlightStatus.delete(req.params.id);
        if (!deletedFlightStatus) return res.status(404).json({ error: "Flight status not found" });
        res.json(deletedFlightStatus);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
