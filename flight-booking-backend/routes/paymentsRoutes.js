const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

// ✅ Create a Payment (User can make a payment)
router.post("/", authenticateUser, paymentController.createPayment);

// ✅ Get All Payments (Admin Only)
router.get("/", authenticateUser, authorizeRole(["admin"]), paymentController.getAllPayments);

// ✅ Get Payment by ID
router.get("/:id", authenticateUser, paymentController.getPaymentById);

// ✅ Update Payment Status (Admin Only)
router.put("/:id", authenticateUser, authorizeRole(["admin"]), paymentController.updatePayment);

// ✅ Delete Payment (Admin Only)
router.delete("/:id", authenticateUser, authorizeRole(["admin"]), paymentController.deletePayment);

module.exports = router;