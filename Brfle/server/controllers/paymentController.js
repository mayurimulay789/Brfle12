// const Razorpay = require("razorpay");
// const crypto = require("crypto");
// const Payment = require("../model/Payment");
// const Course = require("../model/Course");

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // ✅ Create Order
// exports.createOrder = async (req, res) => {
//   try {
//     const { courseId, userId } = req.body;

//     if (!courseId || !userId)
//       return res.status(400).json({ message: "courseId and userId are required" });

//     const course = await Course.findById(courseId);
//     if (!course) return res.status(404).json({ message: "Course not found" });

//     const options = {
//       amount: course.fees * 100, // paise
//       currency: "INR",
//       receipt: `rcpt_${Date.now()}`,
//     };

//     const order = await razorpay.orders.create(options);

//     const payment = new Payment({
//       user: userId,
//       course: courseId,
//       razorpay_order_id: order.id,
//       amount: course.fees,
//       status: "pending",
//     });
//     await payment.save();

//     console.log("✅ Order Created:", order);
//     res.status(201).json(order);
//   } catch (error) {
//     console.error("❌ Error creating order:", error);
//     res.status(500).json({ message: "Failed to create order" });
//   }
// };

// // ✅ Verify Payment
// exports.verifyPayment = async (req, res) => {
//   try {
//     const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
//     const body = razorpay_order_id + "|" + razorpay_payment_id;

//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body)
//       .digest("hex");

//     if (expectedSignature === razorpay_signature) {
//       const payment = await Payment.findOne({ razorpay_order_id });
//       if (payment) {
//         payment.razorpay_payment_id = razorpay_payment_id;
//         payment.razorpay_signature = razorpay_signature;
//         payment.status = "completed";
//         await payment.save();
//       }
//       console.log("✅ Payment Verified");
//       return res.json({ success: true, message: "Payment verified successfully" });
//     } else {
//       console.log("❌ Invalid signature");
//       return res.json({ success: false, message: "Invalid signature" });
//     }
//   } catch (error) {
//     console.error("❌ Verification failed:", error);
//     res.status(500).json({ success: false, message: "Verification failed" });
//   }
// };


const Razorpay = require('razorpay');
const crypto = require('crypto');
const Course = require('../model/Course');
const Enrollment = require('../model/Enrollment');
const Payment = require('../model/Payment');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Validate course
    const course = await Course.findOne({ 
      _id: courseId, 
      isActive: true 
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course'
      });
    }

    // Create order options
    const options = {
      amount: Math.round(course.price * 100), // Convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        courseId: courseId.toString(),
        studentId: req.user.id.toString(),
        courseTitle: course.courseTitle
      }
    };

    // Create Razorpay order
    const order = await razorpay.orders.create(options);

    // Save payment record
    const payment = new Payment({
      orderId: order.id,
      student: req.user.id,
      course: courseId,
      amount: course.price,
      currency: 'INR',
      status: 'created'
    });

    await payment.save();

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      },
      key: process.env.RAZORPAY_KEY_ID,
      course: {
        title: course.courseTitle,
        price: course.price
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating payment order',
      error: error.message
    });
  }
};

// @desc    Verify payment and enroll student
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Find payment record
    const payment = await Payment.findOne({ orderId: razorpay_order_id })
      .populate('course')
      .populate('student');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // Check if payment is already captured
    if (payment.status === 'captured') {
      return res.status(400).json({
        success: false,
        message: 'Payment already processed'
      });
    }

    // Update payment record
    payment.paymentId = razorpay_payment_id;
    payment.signature = razorpay_signature;
    payment.status = 'captured';
    payment.paidAt = new Date();
    await payment.save();

    // Create enrollment
    const enrollment = new Enrollment({
      student: payment.student._id,
      course: payment.course._id
    });

    await enrollment.save();

    // Update course total students
    await payment.course.updateTotalStudents();
    await payment.course.save();

    res.json({
      success: true,
      message: 'Payment verified and enrollment successful',
      payment: {
        id: payment._id,
        amount: payment.amount,
        course: payment.course.courseTitle,
        paymentId: payment.paymentId,
        paidAt: payment.paidAt
      },
      enrollment: {
        id: enrollment._id,
        enrolledAt: enrollment.enrolledAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
};

// @desc    Get payment details
// @route   GET /api/payments/:paymentId
// @access  Private
exports.getPaymentDetails = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId)
      .populate('course', 'courseTitle courseImage')
      .populate('student', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check if user owns this payment or is admin
    if (payment.student._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment details',
      error: error.message
    });
  }
};

// @desc    Get user's payment history
// @route   GET /api/payments/history/my-payments
// @access  Private
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ student: req.user.id })
      .populate('course', 'courseTitle courseImage category')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment history',
      error: error.message
    });
  }
};

// @desc    Handle payment failure
// @route   POST /api/payments/failed
// @access  Private
exports.paymentFailed = async (req, res) => {
  try {
    const { razorpay_order_id, error } = req.body;

    // Find and update payment record
    const payment = await Payment.findOne({ orderId: razorpay_order_id });

    if (payment) {
      payment.status = 'failed';
      payment.error = error;
      await payment.save();
    }

    res.json({
      success: true,
      message: 'Payment failure recorded'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error recording payment failure',
      error: error.message
    });
  }
};

// @desc    Get all payments (Admin only)
// @route   GET /api/payments/admin/all-payments
// @access  Admin
exports.getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const payments = await Payment.find(filter)
      .populate('course', 'courseTitle')
      .populate('student', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(filter);
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'captured' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      success: true,
      count: payments.length,
      total,
      totalRevenue: totalRevenue[0]?.total || 0,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payments',
      error: error.message
    });
  }
};

// @desc    Get payment analytics (Admin only)
// @route   GET /api/payments/admin/analytics
// @access  Admin
exports.getPaymentAnalytics = async (req, res) => {
  try {
    const totalPayments = await Payment.countDocuments();
    const successfulPayments = await Payment.countDocuments({ status: 'captured' });
    const failedPayments = await Payment.countDocuments({ status: 'failed' });
    const pendingPayments = await Payment.countDocuments({ status: 'created' });

    // Revenue by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const revenueByMonth = await Payment.aggregate([
      {
        $match: {
          status: 'captured',
          paidAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$paidAt' },
            month: { $month: '$paidAt' }
          },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Popular courses by revenue
    const popularCourses = await Payment.aggregate([
      {
        $match: { status: 'captured' }
      },
      {
        $group: {
          _id: '$course',
          revenue: { $sum: '$amount' },
          enrollments: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course'
        }
      },
      {
        $unwind: '$course'
      },
      {
        $project: {
          courseTitle: '$course.courseTitle',
          revenue: 1,
          enrollments: 1
        }
      },
      {
        $sort: { revenue: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      success: true,
      analytics: {
        totalPayments,
        successfulPayments,
        failedPayments,
        pendingPayments,
        successRate: totalPayments > 0 ? (successfulPayments / totalPayments) * 100 : 0,
        totalRevenue: popularCourses.reduce((sum, course) => sum + course.revenue, 0),
        revenueByMonth,
        popularCourses
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment analytics',
      error: error.message
    });
  }
};

// @desc    Refund payment (Admin only)
// @route   POST /api/payments/admin/refund/:paymentId
// @access  Admin
exports.processRefund = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { amount, notes } = req.body;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.status !== 'captured') {
      return res.status(400).json({
        success: false,
        message: 'Only captured payments can be refunded'
      });
    }

    if (payment.refundStatus) {
      return res.status(400).json({
        success: false,
        message: 'Refund already processed for this payment'
      });
    }

    // Process refund through Razorpay
    const refundAmount = amount ? Math.round(amount * 100) : Math.round(payment.amount * 100);
    
    const refund = await razorpay.payments.refund(payment.paymentId, {
      amount: refundAmount,
      notes: notes || 'Refund processed by admin'
    });

    // Update payment record
    payment.refundStatus = 'processed';
    payment.refundId = refund.id;
    payment.refundAmount = refundAmount / 100;
    payment.refundedAt = new Date();
    payment.refundNotes = notes;
    await payment.save();

    // Cancel enrollment if full refund
    if (refundAmount === Math.round(payment.amount * 100)) {
      await Enrollment.findOneAndDelete({
        student: payment.student,
        course: payment.course
      });

      // Update course total students
      const course = await Course.findById(payment.course);
      if (course) {
        await course.updateTotalStudents();
        await course.save();
      }
    }

    res.json({
      success: true,
      message: 'Refund processed successfully',
      refund: {
        id: refund.id,
        amount: refundAmount / 100,
        status: refund.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing refund',
      error: error.message
    });
  }
};