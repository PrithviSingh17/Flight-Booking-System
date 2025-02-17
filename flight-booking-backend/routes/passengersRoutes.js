const express = require("express");
const router = express.Router();
const passengerController = require("../controllers/passengerController");
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");


router.post("/", authenticateUser, passengerController.createPassenger);


router.get("/", authenticateUser, authorizeRole(["admin"]), passengerController.getAllPassengers);


router.get("/:id", authenticateUser, passengerController.getPassengerById);


router.put("/:id", authenticateUser, passengerController.updatePassenger);


router.delete("/:id", authenticateUser, authorizeRole(["admin"]), passengerController.deletePassenger);

module.exports = router;
