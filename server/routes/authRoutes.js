const express = require("express");
const router = express.Router();
const { authLimiter } = require("../middleware/rateLimiter");

const {
  register,
  login,
  adminLogin,
  verifyOtp,
  resendOtp,
  googleAuth,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", authLimiter, login);
router.post("/admin/login", authLimiter, adminLogin);
router.post("/verify-otp", authLimiter, verifyOtp);
router.post("/resend-otp", authLimiter, resendOtp);
router.post("/google", googleAuth);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
