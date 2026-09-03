const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifytoken");
const { getCart, updateCart } = require("../controllers/cartcontroller");

router.get("/", verifyToken, getCart);
router.put("/", verifyToken, updateCart);

module.exports = router;