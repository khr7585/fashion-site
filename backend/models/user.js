const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    verificationTokenExpires: {
      type: Date,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    cart: {
      type: [
        {
          id: { type: Number, required: true },
          name: { type: String, required: true },
          price: { type: String, required: true },
          image: { type: String, required: true },
          quantity: { type: Number, required: true, default: 1 },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("User", userSchema);
