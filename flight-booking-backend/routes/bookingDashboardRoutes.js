const express = require("express");
const router = express.Router();
const bookingDashboardController = require("../controllers/bookingDashboardController");
const { authenticateUser } = require("../middleware/authMiddleware");

// Get comprehensive dashboard data
router.get("/", authenticateUser, bookingDashboardController.getDashboardData);

// Get booking details
router.get("/bookings/:booking_id", authenticateUser, bookingDashboardController.getBookingDetails);
router.put("/profile", authenticateUser, bookingDashboardController.updateProfile);
router.delete("/bookings/:booking_id", authenticateUser, bookingDashboardController.cancelBooking);
module.exports = router;