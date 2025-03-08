const express = require("express");
const router = express.Router();
const flightStatusMasterController = require("../controllers/flightStatusMasterController");
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

// Get all statuses
router.get("/", authenticateUser, flightStatusMasterController.getAllStatuses);

// Get a single status by ID
router.get("/:id", authenticateUser, flightStatusMasterController.getStatusById);

// Create a new status
router.post("/", authenticateUser, flightStatusMasterController.createStatus);

// Update a status by ID
router.put("/:id", authenticateUser, flightStatusMasterController.updateStatus);

// Delete a status by ID
router.delete("/:id", authenticateUser, flightStatusMasterController.deleteStatus);

module.exports = router;