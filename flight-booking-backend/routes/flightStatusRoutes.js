const express = require("express");
const router = express.Router();
const flightStatusController = require("../controllers/flightStatusController");
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");


console.log(flightStatusController);


// 🟢 Get All Flight Status (User & Admin)
router.get("/", authenticateUser, flightStatusController.getAllFlightStatus);

// 🟢 Get Flight Status by ID (User & Admin)
router.get("/:status_id", authenticateUser, flightStatusController.getFlightStatusById);

// 🔴 Create Flight Status (Admin Only)
router.post("/", authenticateUser, authorizeRole("Admin"), flightStatusController.createFlightStatus);

// 🟡 Update Flight Status (Admin Only)
router.put("/:status_id", authenticateUser, authorizeRole("Admin"), flightStatusController.updateFlightStatus);

// 🔴 Delete Flight Status (Admin Only)
router.delete("/:status_id", authenticateUser, authorizeRole("Admin"), flightStatusController.deleteFlightStatus);

module.exports = router;


