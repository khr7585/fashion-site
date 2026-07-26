const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require("../utils/sendEmail");
function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}
function setTokenCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}
function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    isVerified: user.isVerified,
  };
}
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires,
    });
    try {
      await sendVerificationEmail(user.email, verificationToken);
    } catch (emailErr) {
      console.error("Failed to send verification email:", emailErr.message);
    }
    const token = signToken(user._id);
    setTokenCookie(res, token);
    res.status(201).json({
      message: "Account created. Please check your email to verify it.",
      user: publicUser(user),
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required." });
    }
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }
    const token = signToken(user._id);
    setTokenCookie(res, token);
    res.json({ message: "Logged in successfully.", user: publicUser(user) });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};
exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.json({ message: "Logged out successfully." });
};
exports.getMe = async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found." });
  res.json({ user: publicUser(user) });
};
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Token is required." });
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    }).select("+verificationToken +verificationTokenExpires");
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification link." });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    res.json({ message: "Email verified successfully!" });
  } catch (err) {
    console.error("Verify email error:", err);
    res.status(500).json({ message: "Something went wrong." });
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required." });
    const user = await User.findOne({ email: email.toLowerCase() });
    const genericMessage =
      "If an account with that email exists, a reset link has been sent.";
    if (!user) {
      return res.json({ message: genericMessage });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
    await user.save();
    try {
      await sendResetPasswordEmail(user.email, resetToken);
    } catch (emailErr) {
      console.error("Failed to send reset email:", emailErr.message);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return res.status(500).json({ message: "Could not send reset email." });
    }
    res.json({ message: genericMessage });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Something went wrong." });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token and new password are required." });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpires");
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset link." });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: "Password reset successfully. You can now log in." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Something went wrong." });
  }
};