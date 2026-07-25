// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const Razorpay = require("razorpay");
// const crypto = require("crypto");

// const app = express();
// app.use(cors());
// app.use(express.json());

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// app.post("/api/create-order", async (req, res) => {
//   try {
//     const { amount, currency } = req.body;
//     console.log("Received:", amount, currency); // debug log
//     const order = await razorpay.orders.create({
//       amount: Math.round(amount * 100),
//       currency,
//       receipt: `receipt_${Date.now()}`,
//     });
//     res.json(order);
//   } catch (err) {
//     console.error("Razorpay error:", JSON.stringify(err, null, 2));
//     console.error("Error message:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post("/api/verify-payment", (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//     req.body;
//   const generated = crypto
//     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//     .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//     .digest("hex");

//   if (generated === razorpay_signature) {
//     res.json({ success: true });
//   } else {
//     res.status(400).json({ success: false });
//   }
// });

// app.listen(3000, () => console.log("Server running on port 3000"));




require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const authRoutes = require("./routes/auth");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5500",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api/auth", authRoutes);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post("/api/create-order", async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: `receipt_${Date.now()}`,
    });
    res.json(order);
  } catch (err) {
    console.error("Razorpay error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const generated = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated === razorpay_signature) {
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));