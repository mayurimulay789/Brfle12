const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const { genericUploader } = require('../utils/cloudinary'); // Use genericUploader instead
const { protect, admin: adminAuth } = require('../middleware/auth');

// Public routes - anyone can view lesson details (but not content)
router.get('/course/:courseId', lessonController.getCourseLessons);

// Protected routes - Admin only for CRUD operations
router.post('/', protect, adminAuth, genericUploader.single('video'), lessonController.createLesson);
router.put('/:id', protect, adminAuth, genericUploader.single('video'), lessonController.updateLesson);
router.delete('/:id', protect, adminAuth, lessonController.deleteLesson);
router.put('/:id/status', protect, adminAuth, lessonController.updateLessonStatus);

// Lesson resources - Admin only
router.post('/:id/resources', protect, adminAuth, genericUploader.single('resource'), lessonController.addLessonResource);
router.delete('/:id/resources/:resourceId', protect, adminAuth, lessonController.deleteLessonResource);

// Student progress - Authenticated users only
router.post('/:id/complete', protect, lessonController.markLessonCompleted);
router.get('/:id/progress', protect, lessonController.getLessonProgress);

module.exports = router;