const express = require("express");
const router = express.Router();
const userController = require("../controller/user");
const auth = require("../middleware/auth");

// Public routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/forgot-password", userController.sendResetPasswordToken);
router.post("/reset-password", userController.resetPassword);

// Protected routes
router.get("/profile", auth, userController.getProfile);
router.put("/profile", auth, userController.updateProfile);
router.post("/logout", auth, userController.logout);
router.patch("/toggle-email", auth, userController.toggleSendEmail);

module.exports = router;
