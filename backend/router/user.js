const express = require("express");
const router = express.Router();
const userController = require("../controller/user");
const auth = require("../middleware/auth");
const { upload } = require("../middleware/multer");

// Public routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/forgot-password", userController.sendResetPasswordToken);
router.post("/reset-password", userController.resetPassword);

// Protected routes
router.get("/profile", auth, userController.getProfile);
router.post("/profile", auth, userController.updateProfile);
router.post("/logout", auth, userController.logout);
router.patch("/toggle-email", auth, userController.toggleSendEmail);
router.post("/upload", auth, upload.single("file"), userController.uploadImage);
router.post("/account", auth, userController.resetPassword);

module.exports = router;
