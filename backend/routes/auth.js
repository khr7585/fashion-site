const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  signup,
  login,
  logout,
  getMe,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyToken, getMe);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
module.exports = router;