const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware"); 

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

router.get("/", authenticateUser, authorizeRole(["admin"]), userController.getAllUsers);
router.get("/:id", authenticateUser, userController.getUserById);
router.put("/:id", authenticateUser, userController.updateUser);
router.delete("/:id", authenticateUser, authorizeRole(["admin"]), userController.deleteUser);

module.exports = router;
