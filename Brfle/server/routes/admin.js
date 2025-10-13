const express = require('express');
const User = require('../model/User');
const { protect, admin } = require('../middleware/auth');
const {
  getAllUsers,
  getUserById,
  updatedUser,
  deleteUser,
  getAllCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  updateCourseStatus,
  recalculateCourseDuration

} = require('../controllers/adminController');



const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(admin);

// Specific routes first
router.get('/users', getAllUsers);
router.put('/users/:id/role', updatedUser);    // PUT before GET with params
router.delete('/users/:id', deleteUser);  // DELETE before GET with params
router.get('/users/:id', getUserById); 

//course routes
router.get('/courses', getAllCourses);
router.post('/courses', createCourse);
// router.get('/courses/:id', getSingleCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);
router.patch('/courses/:id/status', updateCourseStatus);
router.post('/courses/:id/recalculate-duration', recalculateCourseDuration);


module.exports = router;