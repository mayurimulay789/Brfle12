// const express = require("express");
// const router = express.Router();
// const { createOrder, verifyPayment } = require("../controllers/paymentController");

// // Create Razorpay order
// router.post("/order", createOrder);

// // Verify Razorpay payment
// router.post("/verify", verifyPayment);

// module.exports = router;


const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
// const auth = require('../middleware/auth');
// const adminAuth = require('../middleware/adminAuth');

const { protect: auth, admin: adminAuth } = require('../middleware/auth');
// Payment routes
router.post('/create-order', auth, paymentController.createOrder);
router.post('/verify', auth, paymentController.verifyPayment);
router.post('/failed', auth, paymentController.paymentFailed);
router.get('/:paymentId', auth, paymentController.getPaymentDetails);
router.get('/history/my-payments', auth, paymentController.getMyPayments);

// Admin routes
router.get('/admin/all-payments', auth, adminAuth, paymentController.getAllPayments);
router.get('/admin/analytics', auth, adminAuth, paymentController.getPaymentAnalytics);
router.post('/admin/refund/:paymentId', auth, adminAuth, paymentController.processRefund);

module.exports = router;