// const express = require("express");
// const router = express.Router();
// const {
//   enrollUser,
//   getUserEnrollments,
//   getEnrollmentByCourse,
//   updateProgress,
//   getProgress,
//   forceCertificate,
//   getUserCertificates
// } = require("../controllers/enrollmentController");

// const { protect} = require('../middleware/auth');

// // Protected routes
// router.use(protect);

// // ✅ POST /api/enrollments - Enroll a user to a course
// router.post("/", enrollUser);

// // ✅ GET /api/enrollments/me - Get all user enrollments
// router.get("/me" , getUserEnrollments);

// // ✅ GET /api/enrollments/:courseId - Get a specific enrollment
// router.get("/:courseId" , getEnrollmentByCourse);

// // ✅ POST /api/enrollments/progress - Update course progress
// router.post("/progress", updateProgress);

// // ✅ GET /api/enrollments/progress/:courseId - Get progress of specific course
// router.get("/progress/:courseId", getProgress);

// // DEV ROUTE: force issue a certificate for a course
// router.post("/:courseId/force-certificate", forceCertificate);

// // ✅ GET /api/enrollments/certificates/me - Get all user certificates
// router.get("/certificates/me", getUserCertificates);

// module.exports = router;





const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
// const auth = require('../middleware/auth');

const { protect,admin } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Enrollment management
router.post('/courses/:courseId', enrollmentController.enrollInCourse);
router.get('/my-courses', enrollmentController.getMyEnrollments);
router.get('/courses/:courseId', enrollmentController.getEnrollmentStatus);
router.delete('/courses/:courseId', enrollmentController.cancelEnrollment);

// Progress tracking
router.get('/courses/:courseId/progress', enrollmentController.getCourseProgress);
router.post('/courses/:courseId/lessons/:lessonId/complete', enrollmentController.markLessonCompleted);
router.post('/courses/:courseId/lessons/:lessonId/uncomplete', enrollmentController.markLessonUncompleted);

// Certificate
router.get('/courses/:courseId/certificate', enrollmentController.getCertificate);

// Admin routes for enrollment analytics
router.get('/admin/analytics', protect,admin, enrollmentController.getEnrollmentAnalytics);
router.get('/admin/courses/:courseId/enrollments', protect,admin, enrollmentController.getCourseEnrollments);

module.exports = router;