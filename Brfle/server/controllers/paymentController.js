const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../model/Payment");
const Course = require("../model/Course");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create Order
exports.createOrder = async (req, res) => {
  try {
    const { courseId, userId } = req.body;

    if (!courseId || !userId)
      return res.status(400).json({ message: "courseId and userId are required" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const options = {
      amount: course.fees * 100, // paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    const payment = new Payment({
      user: userId,
      course: courseId,
      razorpay_order_id: order.id,
      amount: course.fees,
      status: "pending",
    });
    await payment.save();

    console.log("✅ Order Created:", order);
    res.status(201).json(order);
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// ✅ Verify Payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const payment = await Payment.findOne({ razorpay_order_id });
      if (payment) {
        payment.razorpay_payment_id = razorpay_payment_id;
        payment.razorpay_signature = razorpay_signature;
        payment.status = "completed";
        await payment.save();
      }
      console.log("✅ Payment Verified");
      return res.json({ success: true, message: "Payment verified successfully" });
    } else {
      console.log("❌ Invalid signature");
      return res.json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("❌ Verification failed:", error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};
