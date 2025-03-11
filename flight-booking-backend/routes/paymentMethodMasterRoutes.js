const express = require("express");
const router = express.Router();
const paymentMethodMasterController = require("../controllers/paymentMethodMasterController");
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

router.post("/", authenticateUser,authorizeRole(["admin"]), paymentMethodMasterController.createPaymentMethod);
router.get("/", authenticateUser, paymentMethodMasterController.getAllPaymentMethods);
router.get("/:id", authenticateUser, paymentMethodMasterController.getPaymentMethodById);
router.put("/:id", authenticateUser,authorizeRole(["admin"]), paymentMethodMasterController.updatePaymentMethod);
router.delete("/:id", authenticateUser, authorizeRole(["admin"]),paymentMethodMasterController.deletePaymentMethod);

module.exports = router;