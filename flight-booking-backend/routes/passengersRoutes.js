const express = require("express");
const router = express.Router();
const passengerController = require("../controllers/passengerController");
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

// ✅ Create Passenger (Admin & User)
router.post("/", authenticateUser, passengerController.createPassenger);

// ✅ Get All Passengers (Admin Only)
router.get("/", authenticateUser, authorizeRole(["admin"]), passengerController.getAllPassengers);

// ✅ Get Passenger by ID
router.get("/:id", authenticateUser, passengerController.getPassengerById);

// ✅ Update Passenger
router.put("/:id", authenticateUser, passengerController.updatePassenger);

// ✅ Delete Passenger
router.delete("/:id", authenticateUser, authorizeRole(["admin"]), passengerController.deletePassenger);

module.exports = router;
