// const express = require('express');
// const {
//   getCourses,
//   getCourse,
//   createCourse,
//   updateCourse,
//   deleteCourse,
//   addLesson,
//   addReview,
//   getCourseStats
// } = require('../controllers/courseController');
// const { protect, admin } = require('../middleware/auth');

// const router = express.Router();

// // Public routes
// router.get('/', getCourses);
// router.get('/:id', getCourse);


// // Protected routes
// router.use(protect);

// router.post('/', createCourse);
// router.put('/:id', updateCourse);
// router.delete('/:id', deleteCourse);
// router.post('/:id/lessons', addLesson);

// // Student routes
// router.post('/:id/reviews', addReview);

// // Admin routes
// router.get('/stats/overview', admin, getCourseStats);

const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { genericUploader } = require('../utils/cloudinary');
const { protect, admin } = require('../middleware/auth');

// Debug middleware for courses routes
router.use((req, res, next) => {
  console.log(`[COURSES] ${req.method} ${req.url}`);
  console.log('Content-Type:', req.headers['content-type']);
  next();
});

// ==================== PUBLIC ROUTES ====================
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourse);
router.get('/category/:category', courseController.getCoursesByCategory);

// ==================== PROTECTED ROUTES (ADMIN ONLY) ====================
// ✅ FIXED: Use generic uploader for all file types
router.post('/', 
  protect, 
  admin, 
  genericUploader.fields([
    { name: 'courseImage', maxCount: 1 },
    { name: 'previewVideo', maxCount: 1 },
    { name: 'courseBook', maxCount: 1 },
    { name: 'projectPDF', maxCount: 1 }
  ]), 
  (req, res, next) => {
    console.log('✅ Files processed successfully:');
    if (req.files) {
      Object.keys(req.files).forEach(fieldName => {
        req.files[fieldName].forEach(file => {
          console.log(`  - ${fieldName}:`, {
            originalname: file.originalname,
            mimetype: file.mimetype,
            path: file.path,
            public_id: file.public_id
          });
        });
      });
    }
    next();
  },
  courseController.createCourse
);

// Update course
router.put('/:id', 
  protect, 
  admin, 
  genericUploader.single('courseImage'), 
  courseController.updateCourse
);

// Delete course
router.delete('/:id', protect, admin, courseController.deleteCourse);

// Update course status
router.put('/:id/status', protect, admin, courseController.updateCourseStatus);

// ==================== COURSE CONTENT MANAGEMENT ====================
router.post('/:id/preview-video', 
  protect, 
  admin, 
  genericUploader.single('previewVideo'), 
  courseController.uploadPreviewVideo
);

router.post('/:id/course-book', 
  protect, 
  admin, 
  genericUploader.single('courseBook'), 
  courseController.uploadCourseBook
);

router.post('/:id/project-pdf', 
  protect, 
  admin, 
  genericUploader.single('projectPDF'), 
  courseController.uploadProjectPDF
);

router.post('/:id/certificate-template', 
  protect, 
  admin, 
  genericUploader.single('certificateTemplate'), 
  courseController.uploadCertificateTemplate
);

// ==================== MCQ TEST MANAGEMENT ====================
router.post('/:id/mcq-test', protect, admin, courseController.createMCQTest);
router.put('/:id/mcq-test', protect, admin, courseController.updateMCQTest);
router.delete('/:id/mcq-test', protect, admin, courseController.deleteMCQTest);

// ==================== STUDENT EXPERIENCES ====================
router.post('/:id/experiences', protect, courseController.addExperience);
router.get('/:id/experiences', courseController.getCourseExperiences);

// ==================== STUDENT TEST ATTEMPTS ====================
router.post('/:id/test/attempt', protect, courseController.attemptMCQTest);
router.get('/:id/test/attempts', protect, courseController.getTestAttempts);

module.exports = router;