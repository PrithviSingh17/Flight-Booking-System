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