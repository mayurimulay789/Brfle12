const express = require('express');
const {
  getProgress,
  completeLesson,
  getUserCourses,
  getCourseProgressStats
} = require('../controllers/progressController');
const { protect, instructor } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// Student routes
router.get('/', getUserCourses);
router.get('/:courseId', getProgress);
router.post('/:courseId/complete-lesson', completeLesson);

// Instructor routes
router.get('/stats/:courseId', instructor, getCourseProgressStats);

module.exports = router;