const express = require('express');
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  
  addReview,
  getCourseStats
} = require('../controllers/courseController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);


// Protected routes
router.use(protect);

router.post('/', createCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);


// Student routes
router.post('/:id/reviews', addReview);

// Admin routes
router.get('/stats/overview', admin, getCourseStats);

module.exports = router;