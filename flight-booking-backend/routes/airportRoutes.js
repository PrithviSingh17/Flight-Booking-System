const express = require("express");
const router = express.Router();
const airportController = require("../controllers/airportController");
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

// Get all airports
router.get("/airports", authenticateUser, airportController.getAllAirports);

// Search airports by city name
router.get("/airports/search", authenticateUser, airportController.searchAirportsByCity);


router.post("/airports", authenticateUser, authorizeRole(["admin"]), airportController.createAirport);

router.put("/airports/:airport_code", authenticateUser, authorizeRole(["admin"]),  airportController.updateAirport);

// Delete an airport
router.delete("/airports/:airport_code", authenticateUser,authorizeRole(["admin"]),airportController.deleteAirport);

module.exports = router;