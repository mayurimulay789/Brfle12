const express = require('express');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
  addReview,
  getCourseStats
} = require('../controllers/courseController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourse);


// Protected routes
router.use(protect);

router.post('/', createCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);
router.post('/:id/lessons', addLesson);

// Student routes
router.post('/:id/reviews', addReview);

// Admin routes
router.get('/stats/overview', admin, getCourseStats);

module.exports = router;