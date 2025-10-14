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

    // Validate required fields
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    // Validate course exists and is active
    const course = await Course.findOne({ 
      _id: courseId, 
      isActive: true 
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or not active'
      });
    }

    // Check if already enrolled (additional safety check)
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

    // Check for existing pending payment for same course
    const existingPayment = await Payment.findOne({
      student: req.user.id,
      course: courseId,
      status: { $in: ['created', 'captured'] }
    });

    if (existingPayment) {
      if (existingPayment.status === 'captured') {
        return res.status(400).json({
          success: false,
          message: 'You are already enrolled in this course'
        });
      } else {
        // Return existing order if payment is still pending
        return res.json({
          success: true,
          order: {
            id: existingPayment.orderId,
            amount: Math.round(existingPayment.amount * 100),
            currency: existingPayment.currency,
            receipt: `receipt_${existingPayment._id}`
          },
          key: process.env.RAZORPAY_KEY_ID,
          course: {
            title: course.courseTitle,
            price: course.price
          },
          existingOrder: true
        });
      }
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
      },
      existingOrder: false
    });
  } catch (error) {
    console.error('Create order error:', error);
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

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification data'
      });
    }

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed - Invalid signature'
      });
    }

    // Find payment record with course population
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
      // Check if enrollment already exists
      const existingEnrollment = await Enrollment.findOne({
        student: payment.student._id,
        course: payment.course._id
      });

      if (existingEnrollment) {
        return res.json({
          success: true,
          message: 'Payment already processed and enrollment exists',
          payment: {
            id: payment._id,
            amount: payment.amount,
            course: payment.course.courseTitle,
            paymentId: payment.paymentId,
            paidAt: payment.paidAt
          },
          enrollment: {
            id: existingEnrollment._id,
            enrolledAt: existingEnrollment.enrolledAt
          },
          alreadyProcessed: true
        });
      } else {
        // Create enrollment if it doesn't exist
        return await createEnrollmentAndRespond(payment, res);
      }
    }

    // Additional safety check: Verify course still exists and is active
    if (!payment.course) {
      await Payment.findByIdAndUpdate(payment._id, {
        status: 'failed',
        error: {
          reason: 'Course not found during verification'
        }
      });

      return res.status(400).json({
        success: false,
        message: 'Course not found. Please contact support for refund.'
      });
    }

    if (!payment.course.isActive) {
      await Payment.findByIdAndUpdate(payment._id, {
        status: 'failed',
        error: {
          reason: 'Course is no longer active'
        }
      });

      return res.status(400).json({
        success: false,
        message: 'Course is no longer available. Please contact support for refund.'
      });
    }

    // Final safety check: Ensure user is not already enrolled
    const existingEnrollmentCheck = await Enrollment.findOne({
      student: payment.student._id,
      course: payment.course._id
    });

    if (existingEnrollmentCheck) {
      // Update payment as captured but don't create new enrollment
      payment.paymentId = razorpay_payment_id;
      payment.signature = razorpay_signature;
      payment.status = 'captured';
      payment.paidAt = new Date();
      await payment.save();

      return res.json({
        success: true,
        message: 'Payment verified (already enrolled)',
        payment: {
          id: payment._id,
          amount: payment.amount,
          course: payment.course.courseTitle,
          paymentId: payment.paymentId,
          paidAt: payment.paidAt
        },
        enrollment: {
          id: existingEnrollmentCheck._id,
          enrolledAt: existingEnrollmentCheck.enrolledAt
        },
        alreadyEnrolled: true
      });
    }

    // Update payment record
    payment.paymentId = razorpay_payment_id;
    payment.signature = razorpay_signature;
    payment.status = 'captured';
    payment.paidAt = new Date();
    await payment.save();

    // Create enrollment and respond
    await createEnrollmentAndRespond(payment, res);
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
};

// Helper function to create enrollment and send response
const createEnrollmentAndRespond = async (payment, res) => {
  try {
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
      },
      newEnrollment: true
    });
  } catch (enrollmentError) {
    console.error('Enrollment creation error:', enrollmentError);
    
    // If enrollment fails, mark payment as failed for manual review
    await Payment.findByIdAndUpdate(payment._id, {
      status: 'failed',
      error: {
        reason: 'Enrollment creation failed',
        details: enrollmentError.message
      }
    });

    res.status(500).json({
      success: false,
      message: 'Payment verified but enrollment failed. Please contact support.',
      error: enrollmentError.message
    });
  }
};

// @desc    Get payment details
// @route   GET /api/payments/:paymentId
// @access  Private
exports.getPaymentDetails = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId)
      .populate('course', 'courseTitle courseImage isActive')
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
      .populate('course', 'courseTitle courseImage category isActive')
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

    if (!razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    // Find and update payment record
    const payment = await Payment.findOne({ orderId: razorpay_order_id });

    if (payment) {
      payment.status = 'failed';
      payment.error = error || { reason: 'Payment failed by user' };
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
      .populate('course', 'courseTitle isActive')
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
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'course'
        }
      },
      {
        $unwind: '$course'
      },
      {
        $match: {
          'course.isActive': true
        }
      },
      {
        $group: {
          _id: '$course._id',
          revenue: { $sum: '$amount' },
          enrollments: { $sum: 1 },
          courseTitle: { $first: '$course.courseTitle' }
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

    const payment = await Payment.findById(paymentId)
      .populate('course')
      .populate('student');

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
        student: payment.student._id,
        course: payment.course._id
      });

      // Update course total students
      if (payment.course) {
        await payment.course.updateTotalStudents();
        await payment.course.save();
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