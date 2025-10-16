// const express = require('express');
// const router = express.Router();
// const enrollmentController = require('../controllers/enrollmentController');
// // const auth = require('../middleware/auth');

// const { protect,admin } = require('../middleware/auth');

// // All routes require authentication
// router.use(protect);

// // Enrollment management
// router.post('/courses/:courseId', enrollmentController.enrollInCourse);
// router.get('/my-courses', enrollmentController.getMyEnrollments);
// router.get('/courses/:courseId', enrollmentController.getEnrollmentStatus);
// router.delete('/courses/:courseId', enrollmentController.cancelEnrollment);

// // Progress tracking
// router.get('/courses/:courseId/progress', enrollmentController.getCourseProgress);
// router.post('/courses/:courseId/lessons/:lessonId/complete', enrollmentController.markLessonCompleted);
// router.post('/courses/:courseId/lessons/:lessonId/uncomplete', enrollmentController.markLessonUncompleted);

// // Certificate
// router.get('/courses/:courseId/certificate', enrollmentController.getCertificate);

// // Admin routes for enrollment analytics
// router.get('/admin/analytics', protect,admin, enrollmentController.getEnrollmentAnalytics);
// router.get('/admin/courses/:courseId/enrollments', protect,admin, enrollmentController.getCourseEnrollments);

// module.exports = router;

const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { protect, admin } = require('../middleware/auth');

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

// ✅ NEW ROUTES FOR 100-CREDIT SYSTEM
router.post('/courses/:courseId/access-material', enrollmentController.markMaterialAccessed);
router.post('/courses/:courseId/test-attempt', enrollmentController.addTestAttempt);
router.post('/courses/:courseId/experience', enrollmentController.addExperience);

// Certificate
router.get('/courses/:courseId/certificate', enrollmentController.getCertificate);

// Admin routes for enrollment analytics
router.get('/admin/analytics', protect, admin, enrollmentController.getEnrollmentAnalytics);
router.get('/admin/courses/:courseId/enrollments', protect, admin, enrollmentController.getCourseEnrollments);

module.exports = router;