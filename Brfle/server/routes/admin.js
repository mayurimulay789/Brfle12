const express = require('express');
<<<<<<< HEAD
const User = require('../models/User');
=======
const multer = require('multer');
const User = require('../model/User');
const Course = require('../model/Course');
>>>>>>> origin/admincode
const { protect, admin } = require('../middleware/auth');

const upload = multer({ 
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image or video file!'), false);
    }
  }
});

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(admin);

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
router.put('/users/:id', async (req, res) => {
  const { username, email, role } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.username = username || user.username;
      user.email = email || user.email;
      user.role = role || user.role;

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.remove();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all courses
// @route   GET /api/admin/courses
// @access  Private/Admin
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find({}).populate('createdBy', 'username');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create course
// @route   POST /api/admin/courses
// @access  Private/Admin
router.post('/courses', upload.single('thumbnail'), async (req, res) => {

  console.log('POST /courses req.file:', req.file);
  console.log('POST /courses req.body:', req.body);
  const { courseName, category, level, price, lessons } = req.body;
  const thumbnail = req.file ? req.file.filename : null;

  try {
    const course = new Course({
      courseName,
      category,
      level,
      price,
      thumbnail,
      lessons: JSON.parse(lessons),
      createdBy: req.user._id,
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update course
// @route   PUT /api/admin/courses/:id
// @access  Private/Admin
router.put('/courses/:id', upload.single('thumbnail'), async (req, res) => {
  console.log('PUT /courses/:id req.file:', req.file);
  console.log('PUT /courses/:id req.body:', req.body);
  const body = req.body || {};
  const { courseName, category, level, price, lessons } = body;
  // If a new file is uploaded, use it; otherwise, keep the old thumbnail
  const thumbnail = req.file ? req.file.filename : undefined;

  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      course.courseName = courseName || course.courseName;
      course.category = category || course.category;
      course.level = level || course.level;
      course.price = price || course.price;
      if (thumbnail) course.thumbnail = thumbnail;
      if (lessons) course.lessons = JSON.parse(lessons);

      const updatedCourse = await course.save();
      res.json(updatedCourse);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete course
// @route   DELETE /api/admin/courses/:id
// @access  Private/Admin
router.delete('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      await course.remove();
      res.json({ message: 'Course removed' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
