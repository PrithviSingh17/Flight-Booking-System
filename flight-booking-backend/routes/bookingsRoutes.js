const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");


router.post("/", authenticateUser, bookingController.createBookingWithPassengers);

router.get("/", authenticateUser, authorizeRole(["admin"]), bookingController.getAllBookings);


router.get("/:id", authenticateUser, bookingController.getBookingById);
router.get("/:id", authenticateUser, bookingController.getBookingsByUserId);

router.put("/:id", authenticateUser, authorizeRole(["admin"]), bookingController.updateBooking);

router.delete("/:id", authenticateUser, bookingController.cancelBooking);


module.exports = router;
