const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");


router.post("/", authenticateUser, bookingController.createBookingWithPassengers);

// New complete booking endpoint (booking + passengers + payment in one transaction)
router.post("/complete", authenticateUser, bookingController.createCompleteBooking);

// Get all bookings (admin only)
router.get("/", authenticateUser, authorizeRole(["admin"]), bookingController.getAllBookings);

// Update booking (admin only)
router.put("/:id", authenticateUser, authorizeRole(["admin"]), bookingController.updateBooking);

// Cancel booking
router.delete("/:id", authenticateUser, bookingController.cancelBooking);


module.exports = router;
