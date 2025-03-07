const express = require("express");
const router = express.Router();
const bookingStatusController = require("../controllers/bookingStatusController");
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");
// Get all statuses
router.get("/",authenticateUser, bookingStatusController.getAllStatuses);

// Get a single status by ID
router.get("/:id",authenticateUser,  bookingStatusController.getStatusById);

// Create a new status
router.post("/",authenticateUser, bookingStatusController.createStatus);

// Update a status by ID
router.put("/:id",authenticateUser, bookingStatusController.updateStatus);

// Delete a status by ID
router.delete("/:id",authenticateUser,  bookingStatusController.deleteStatus);

module.exports = router;