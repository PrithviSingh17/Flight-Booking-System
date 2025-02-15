const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware"); 

// Create Flight (Admin Only)
router.post("/create", authenticateUser, authorizeRole(["admin"]), flightController.createFlight);

// Get All Flights (Public)
router.get("/", flightController.getAllFlights);

// 🔥 Search Flights by City (Public)
router.get("/search", flightController.searchFlights);  // ✅ Moved above get by ID

// Get Flight by ID (Public)
router.get("/:id", flightController.getFlightById);

// Update Flight (Admin Only)
router.put("/:id", authenticateUser, authorizeRole(["admin"]), flightController.updateFlight);

// Delete Flight (Admin Only)
router.delete("/:id", authenticateUser, authorizeRole(["admin"]), flightController.deleteFlight);

module.exports = router;
