const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifytoken");
const { getMyOrders } = require("../controllers/ordercontroller");

router.get("/", verifyToken, getMyOrders);

module.exports = router;