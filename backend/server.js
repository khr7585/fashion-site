require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const authRoutes = require("./routes/auth");
const cartRoutes=require("./routes/cart");
const { sendEmail } = require("./utils/sendemail");
const verifyToken=require("./middleware/verifytoken");
const Product=require("./models/product");
const app = express();
app.use(
  cors({
    origin: [process.env.CLIENT_URL || "https://khr7585.github.io","http://localhost:5500"],
    credentials: true,
  }),
);
app.use(express.json());
const productroutes=require("./routes/productroutes");
app.use("/api/products",productroutes);
app.use(cookieParser());
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
app.use("/api/auth", authRoutes);
app.use("/api/cart",cartRoutes);
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
app.post("/api/create-order",verifyToken, async (req, res) => {
  try {
    const { amount, currency ,cart } = req.body;
    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty." });
    }

    for (const item of cart) {
      const product = await Product.findById(item.id);
      if (!product) {
        return res.status(404).json({ error: `Product not found: ${item.name}` });
      }
      if (product.stock < item.quantity) {
        return res.status(409).json({
          error: `Only ${product.stock} left for "${product.name}".`,
        });
      }
    }
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: `receipt_${Date.now()}`,
    });
    res.json(order);
  } catch (err) {
  console.error("Razorpay error:", err);
  res.status(500).json({ error: err.message || "Unknown error" });
}
});
app.post("/api/verify-payment", verifyToken, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cart } = req.body;
  const generated = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated !== razorpay_signature) {
    return res.status(400).json({ success: false });
  }

  try {
    for (const item of cart) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true },
      );
      if (!updated) {
        return res.status(409).json({
          success: false,
          message: `Sorry, "${item.name}" sold out during checkout.`,
        });
      }
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Stock decrement error:", err.message);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
});


app.post("/api/contact", async (req, res) => {
  const { name, email, phone, reason, message } = req.body;
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "Name, email, and message are required." });
  }
  try {
    await sendEmail({
      to: process.env.EMAIL_USER, // sends to yourself
      subject: `New contact form message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p><strong>Reason:</strong> ${reason || "Not specified"}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `,
    });
    res.json({ success: true, message: "Message received." });
  } catch (err) {
    console.error("Contact form email error:", err.message);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));