const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Course = require("../models/course"); // Make sure path is correct
const payment= require("../models/payment");

const router = express.Router();

// ✅ Razorpay instance
console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
console.log("Razorpay Key Secret:", process.env.RAZORPAY_KEY_SECRET ? "Loaded" : "Not loaded");

// ✅ Create Razorpay order
router.post("/order", async (req, res) => {
  const { courseId } = req.body;
  if (!courseId) return res.status(400).json({ error: "CourseId is required" });

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });
    if (!course.fees) return res.status(400).json({ error: "Course fees missing" });

    const options = {
      amount: Number(course.fees) * 100, // in paise
      currency: "INR",
      receipt: `receipt_${courseId}_${Date.now()}`,
    };

    console.log("Creating Razorpay order with options:", options);

    const order = await razorpay.orders.create(options);
    console.log("Razorpay order created:", order);
    res.json(order);
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    res.status(500).json({ error: err.message, details: err });
  }
});


// ✅ Verify payment
router.post("/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    return res.json({ success: true });
  } else {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }
});

module.exports = router;
