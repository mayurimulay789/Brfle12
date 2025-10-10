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
const { protect, instructor, admin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourse);

// Protected routes
router.use(protect);

// Instructor routes
router.post('/', instructor, createCourse);
router.put('/:id', instructor, updateCourse);
router.delete('/:id', instructor, deleteCourse);
router.post('/:id/lessons', instructor, addLesson);

// Student routes
router.post('/:id/reviews', addReview);

// Admin routes
router.get('/stats/overview', admin, getCourseStats);

module.exports = router;