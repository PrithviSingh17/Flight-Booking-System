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

 const getDateRange = (dateString) => {
  const date = new Date(dateString);
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);
  return { startDate, endDate };
};

exports.searchFlights = async (req, res) => {
  try {
    const { departure_city, arrival_city, departure_date, return_date, trip_type } = req.query;

    // Validate required fields
    if (!departure_city || !arrival_city) {
      return res.status(400).json({ error: "Both departure_city and arrival_city are required" });
    }

    // Build the where clause for outbound flights
    const whereClause = {
      departure_city,
      arrival_city,
    };

    // Add departure date filter if provided
    if (departure_date) {
      const { startDate, endDate } = getDateRange(departure_date);
      whereClause.departure_time = {
        [Op.between]: [startDate, endDate] // Filter flights on the exact departure date
      };
    }

    // Fetch outbound flights from the database
    const outboundFlights = await Flight.findAll({
      where: whereClause,
    });

    // Handle no outbound flights found
    if (outboundFlights.length === 0) {
      return res.status(404).json({ error: "No outbound flights found for the given criteria" });
    }

    let returnFlights = [];
    // Fetch return flights only if trip_type is "return" and return_date is provided
    if (trip_type === "return" && return_date) {
      const { startDate, endDate } = getDateRange(return_date);
      const returnWhereClause = {
        departure_city: arrival_city,
        arrival_city: departure_city,
        departure_time: {
          [Op.between]: [startDate, endDate] // Filter flights on the exact return date
        },
      };

      returnFlights = await Flight.findAll({
        where: returnWhereClause,
      });

      // Handle no return flights found
      if (returnFlights.length === 0) {
        return res.status(404).json({ 
          outboundFlights,
          error: "No return flights found for the given criteria" 
        });
      }
    }

    // Return the flights
    res.status(200).json({
      outboundFlights,
      returnFlights,
    });
  } catch (error) {
    console.error("Error searching flights:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
  