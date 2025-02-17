const Flight = require("../models/Flight");


// Create a Flight
exports.createFlight = async (req, res) => {
  try {
    const flight = await Flight.create(req.body);
    res.status(201).json(flight);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Flights
exports.getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.findAll();
    res.status(200).json(flights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Flight by ID
exports.getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findByPk(req.params.id);
    if (!flight) return res.status(404).json({ error: "Flight not found" });
    res.status(200).json(flight);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Flight
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

// Delete a Flight
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
// Search Flights by Departure & Arrival City
exports.searchFlights = async (req, res) => {
    try {
      const { departure_city, arrival_city } = req.query;
  
      if (!departure_city || !arrival_city) {
        return res.status(400).json({ error: "Both departure_city and arrival_city are required" });
      }
  
      const flights = await Flight.findAll({
        where: {
          departure_city,
          arrival_city
        }
      });
  
      if (flights.length === 0) {
        return res.status(404).json({ error: "No flights found for the given cities" });
      }
  
      res.status(200).json(flights);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  