const express = require("express");
const router = express.Router();
const airportController = require("../controllers/airportController");
const { authenticateUser } = require("../middleware/authMiddleware");

// Get all airports
router.get("/airports", authenticateUser, airportController.getAllAirports);

// Search airports by city name
router.get("/airports/search", authenticateUser, airportController.searchAirportsByCity);

module.exports = router;