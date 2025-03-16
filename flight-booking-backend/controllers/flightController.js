const Flight = require("../models/Flight");
const { Op } = require("sequelize");


exports.createFlight = async (req, res) => {
  try {
    const userId = req.user.user_id; // Ensure this is correctly populated
    console.log("User ID from token:", userId); // Debug log

    const newFlight = await Flight.create({
      ...req.body,
      created_by: userId,
      modified_by: userId,
    });

    res.status(201).json(newFlight);
  } catch (error) {
    console.error("Error creating flight:", error);
    res.status(500).json({ error: "Failed to create flight" });
  }
};


exports.getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.findAll();
    res.status(200).json(flights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findByPk(req.params.id);
    if (!flight) return res.status(404).json({ error: "Flight not found" });
    res.status(200).json(flight);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findByPk(req.params.id);
    if (!flight) return res.status(404).json({ error: "Flight not found" });

    await flight.update(req.body);
    res.status(200).json(flight);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findByPk(req.params.id);
    if (!flight) return res.status(404).json({ error: "Flight not found" });

    await flight.destroy();
    res.status(200).json({ message: "Flight deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


 // Import Sequelize operators

exports.searchFlights = async (req, res) => {
  try {
    const { departure_city, arrival_city, departure_date } = req.query;

    // Validate required fields
    if (!departure_city || !arrival_city) {
      return res.status(400).json({ error: "Both departure_city and arrival_city are required" });
    }

    // Build the where clause
    const whereClause = {
      departure_city,
      arrival_city,
    };

    // Add departure date filter if provided
    if (departure_date) {
      whereClause.departure_time = {
        [Op.gte]: new Date(departure_date), // Filter flights after the departure date
      };
    }

    // Fetch flights from the database
    const flights = await Flight.findAll({
      where: whereClause,
    });

    // Handle no flights found
    if (flights.length === 0) {
      return res.status(404).json({ error: "No flights found for the given criteria" });
    }

    // Return the flights
    res.status(200).json(flights);
  } catch (error) {
    console.error("Error searching flights:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
  