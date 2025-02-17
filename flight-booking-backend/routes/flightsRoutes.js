const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware"); 


router.post("/create", authenticateUser, authorizeRole(["admin"]), flightController.createFlight);


router.get("/", flightController.getAllFlights);


router.get("/search", flightController.searchFlights);  


router.get("/:id", flightController.getFlightById);


router.put("/:id", authenticateUser, authorizeRole(["admin"]), flightController.updateFlight);


router.delete("/:id", authenticateUser, authorizeRole(["admin"]), flightController.deleteFlight);

module.exports = router;
