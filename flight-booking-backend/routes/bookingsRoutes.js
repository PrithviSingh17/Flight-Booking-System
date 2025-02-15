const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

// Create a new booking
router.post("/", authenticateUser, bookingController.createBooking);

// Get all bookings (Admin Only)
router.get("/", authenticateUser, authorizeRole(["admin"]), bookingController.getAllBookings);

// Get booking details by ID
router.get("/:id", authenticateUser, bookingController.getBookingById);

// Update booking (Admin Only)
router.put("/:id", authenticateUser, authorizeRole(["admin"]), bookingController.updateBooking);

// Cancel a booking
router.delete("/:id", authenticateUser, bookingController.cancelBooking);


module.exports = router;
