const User = require("../models/user");

exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ cart: user.cart });
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ message: "Something went wrong." });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { cart } = req.body;
    if (!Array.isArray(cart)) {
      return res.status(400).json({ message: "Cart must be an array." });
    }
    const user = await User.findByIdAndUpdate(
      req.userId,
      { cart },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ cart: user.cart });
  } catch (err) {
    console.error("Update cart error:", err);
    res.status(500).json({ message: "Something went wrong." });
  }
};
