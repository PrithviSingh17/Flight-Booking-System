const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");


router.post("/", authenticateUser, paymentController.createPayment);


router.get("/", authenticateUser, authorizeRole(["admin"]), paymentController.getAllPayments);


router.get("/:id", authenticateUser, paymentController.getPaymentById);


router.put("/:id", authenticateUser, paymentController.updatePayment);

router.delete("/:id", authenticateUser, authorizeRole(["admin"]), paymentController.deletePayment);

module.exports = router;