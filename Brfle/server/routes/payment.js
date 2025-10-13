const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment } = require("../controllers/paymentController");

// Create Razorpay order
router.post("/order", createOrder);

// Verify Razorpay payment
router.post("/verify", verifyPayment);

module.exports = router;
