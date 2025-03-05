const express = require("express");
const router = express.Router();
const flightStatusController = require("../controllers/flightStatusController");
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

router.get("/", authenticateUser, flightStatusController.getAllFlightStatus);


router.get("/:status_id", authenticateUser, flightStatusController.getFlightStatusById);


router.post("/", authenticateUser, authorizeRole("Admin"), flightStatusController.createFlightStatus);


router.put("/:status_id", authenticateUser, authorizeRole("Admin"), flightStatusController.updateFlightStatus);


router.delete("/:status_id", authenticateUser, authorizeRole("Admin"), flightStatusController.deleteFlightStatus);

module.exports = router;


