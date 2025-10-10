const express = require('express');
const User = require('../model/User');
const { protect, admin } = require('../middleware/auth');
const {
  getAllUsers,
  getUserById,
  updatedUser,
  deleteUser
} = require('../controllers/adminController');

const {
  getCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(admin);

// Specific routes first
router.get('/users', getAllUsers);
router.put('/users/:id', updatedUser);    // PUT before GET with params
router.delete('/users/:id', deleteUser);  // DELETE before GET with params
router.get('/users/:id', getUserById); 

// for courses management
router.get('/courses', getCourses);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);    // PUT before GET with params
router.delete('/courses/:id', deleteCourse);  // DELETE before GET with params
router.get('/courses/:id', getCourse);

module.exports = router;