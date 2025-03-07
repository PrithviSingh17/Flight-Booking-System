const Airport = require("../models/Airport");
const { Op } = require("sequelize");

// Get all airports
exports.getAllAirports = async (req, res) => {
  try {
    const airports = await Airport.findAll({
      attributes: ["airport_code", "airport_name", "city", "state", "country"],
    });
    res.status(200).json(airports);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch airports" });
  }
};

// Search airports by city name
exports.searchAirportsByCity = async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: "City name is required" });
  }

  try {
    const airports = await Airport.findAll({
      where: {
        city: {
          [Op.iLike]: `%${city}%`, // Case-insensitive search
        },
      },
      attributes: ["airport_code", "airport_name", "city", "state", "country"],
    });

    if (airports.length === 0) {
      return res.status(404).json({ message: "No airports found for the given city" });
    }

    res.status(200).json(airports);
  } catch (error) {
    res.status(500).json({ error: "Failed to search airports" });
  }
};

exports.updateAirport = async (req, res) => {
  const { airport_code } = req.params;
  const { airport_name, city, state, country } = req.body;

  if (!airport_code) {
    return res.status(400).json({ error: "Airport code is required" });
  }

  try {
    // Find the airport by its code
    const airport = await Airport.findOne({ where: { airport_code } });

    if (!airport) {
      return res.status(404).json({ error: "Airport not found" });
    }

    // Update the airport details
    airport.airport_name = airport_name || airport.airport_name;
    airport.city = city || airport.city;
    airport.state = state || airport.state;
    airport.country = country || airport.country;
    airport.modified_by = req.user.id; // Assuming you have user info in req.user

    await airport.save(); // Save the updated airport

    res.status(200).json(airport);
  } catch (error) {
    console.error("Error updating airport:", error);
    res.status(500).json({ error: "Failed to update airport" });
  }
};


// Create a new airport
exports.createAirport = async (req, res) => {
  console.log("Authenticated User ID:", req.user.user_id); // Debug log
  const { airport_code, airport_name, city, state, country } = req.body;

  // Validate required fields
  if (!airport_code || !airport_name || !city || !state || !country) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if the airport already exists
    const existingAirport = await Airport.findOne({ where: { airport_code } });
    if (existingAirport) {
      return res.status(400).json({ error: "Airport with this code already exists" });
    }

    // Create the new airport
    const newAirport = await Airport.create({
      airport_code,
      airport_name,
      city,
      state,
      country,
      created_by: req.user.user_id, // Use user_id
      modified_by: req.user.user_id, // Use user_id
    });

    console.log("New Airport Created:", newAirport); // Debug log
    res.status(201).json(newAirport);
  } catch (error) {
    console.error("Error creating airport:", error);
    res.status(500).json({ error: "Failed to create airport" });
  }
};

// Delete an airport
exports.deleteAirport = async (req, res) => {
  const { airport_code } = req.params;

  if (!airport_code) {
    return res.status(400).json({ error: "Airport code is required" });
  }

  try {
    const airport = await Airport.findOne({ where: { airport_code } });

    if (!airport) {
      return res.status(404).json({ error: "Airport not found" });
    }

    await airport.destroy();
    res.status(200).json({ message: "Airport deleted successfully" });
  } catch (error) {
    console.error("Error deleting airport:", error);
    res.status(500).json({ error: "Failed to delete airport" });
  }
};