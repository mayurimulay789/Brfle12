const Course = require('../model/Course');
const Progress = require('../model/Progress');

// @desc    Get all courses with filtering and pagination
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      level,
      minPrice,
      maxPrice,
      minRating,
      instructor,
      featured,
      popular,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = Course.find().published();

    // Search
    if (search) {
      query = Course.find({ 
        $text: { $search: search },
        isPublished: true,
        status: 'published'
      }).sort({ score: { $meta: "textScore" } });
    }

    // Filters
    if (category) query = query.byCategory(category);
    if (level) query = query.byLevel(level);
    if (minPrice || maxPrice) {
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Number.MAX_SAFE_INTEGER;
      query = query.inPriceRange(min, max);
    }
    if (minRating) query = query.withMinRating(parseFloat(minRating));
    if (instructor) query = query.byInstructor(instructor);
    if (featured === 'true') query = query.featured();
    if (popular === 'true') query = query.popular();

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    query = query.sort(sortOptions);

    // Pagination
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(parseInt(limit));

    // Execute query
    const courses = await query.populate('createdBy', 'FullName email profile');
    const total = await Course.countDocuments(query.getFilter());

    res.json({
      success: true,
      count: courses.length,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      },
      data: courses
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message
    });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('createdBy', 'FullName email profile')
      .populate('reviews.user', 'FullName profile');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Increment views
    await course.incrementViews();

    res.json({
      success: true,
      data: course
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching course',
      error: error.message
    });
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Instructor
const createCourse = async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      createdBy: req.user._id
    };

    const course = await Course.create(courseData);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating course',
      error: error.message
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Instructor
const updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is the course creator or admin
    if (course.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'FullName email profile');

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating course',
      error: error.message
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Instructor
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is the course creator or admin
    if (course.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course'
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting course',
      error: error.message
    });
  }
};

// @desc    Add lesson to course
// @route   POST /api/courses/:id/lessons
// @access  Private/Instructor
const addLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is the course creator
    if (course.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add lessons to this course'
      });
    }

    await course.addLesson(req.body);

    res.status(201).json({
      success: true,
      message: 'Lesson added successfully',
      data: course
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding lesson',
      error: error.message
    });
  }
};

// @desc    Add review to course
// @route   POST /api/courses/:id/reviews
// @access  Private
const addReview = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const reviewData = {
      ...req.body,
      user: req.user._id
    };

    await course.addReview(reviewData);

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: course
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding review',
      error: error.message
    });
  }
};

// @desc    Get course statistics
// @route   GET /api/courses/stats/overview
// @access  Private/Admin
const getCourseStats = async (req, res) => {
  try {
    const stats = await Course.getCourseStats();
    
    res.json({
      success: true,
      data: stats[0] || {}
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching course statistics',
      error: error.message
    });
  }
};

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
  addReview,
  getCourseStats
};