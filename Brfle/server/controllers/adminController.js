const User = require('../model/User');
const Course = require('../model/Course');

// ==================== USER MANAGEMENT ====================

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query for search/filter
    let query = {};
    
    // Search by username or email
    if (req.query.search) {
      query.$or = [
        { FullName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Filter by role
    if (req.query.role) {
      query.role = req.query.role;
    }

    // Get users with pagination
    const users = await User.find(query)
      .select('-password') // Exclude password
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await User.countDocuments(query);
    const pages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      count: users.length,
      page,
      pages,
      total,
      users
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users',
      error: error.message
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching user',
      error: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updatedUser = async (req, res) => {
  try {
    const { FullName, email, role, isActive } = req.body;

    // Check if user exists
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email already exists (excluding current user)
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    // Check if username already exists (excluding current user)
    if (FullName && FullName !== user.FullName) {
      const FullNameExists = await User.findOne({ FullName });
      if (FullNameExists) {
        return res.status(400).json({
          success: false,
          message: 'FullName already exists'
        });
      }
    }

    // Update user fields
    const updateFields = {};
    if (FullName) updateFields.FullName = FullName;
    if (email) updateFields.email = email;
    if (role) updateFields.role = role;
    if (typeof isActive === 'boolean') updateFields.isActive = isActive;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { 
        new: true, // Return updated document
        runValidators: true // Run model validators
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update user error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating user',
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Optional: Prevent deletion of certain roles
    if (user.role === 'super-admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete super admin users'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting user',
      error: error.message
    });
  }
};

// ==================== COURSE MANAGEMENT ====================

// @desc    Get all courses
// @route   GET /api/admin/courses
// @access  Private/Admin
const getAllCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query for search/filter
    let query = {};
    
    // Search by title or description
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by level
    if (req.query.level) {
      query.level = req.query.level;
    }

    // Get courses with pagination
    const courses = await Course.find(query)
      .populate('createdBy', 'FullName email') // Populate instructor info
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Course.countDocuments(query);
    const pages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      count: courses.length,
      page,
      pages,
      total,
      data: courses // Changed from 'courses' to 'data' for consistency
    });

  } catch (error) {
    console.error('Get all courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching courses',
      error: error.message
    });
  }
};

// @desc    Get single course
// @route   GET /api/admin/courses/:id
// @access  Private/Admin
const getSingleCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('createdBy', 'FullName email')
      .populate('reviews.user', 'FullName email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: course // Changed from 'course' to 'data' for consistency
    });

  } catch (error) {
    console.error('Get single course error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching course',
      error: error.message
    });
  }
};

// @desc    Create new course
// @route   POST /api/admin/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      shortDescription,
      category,
      subcategory,
      level,
      price,
      originalPrice,
      thumbnail,
      previewVideo,
      lessons,
      requirements,
      whatYouWillLearn,
      targetAudience,
      tags,
      language,
      certificate,
      status,
      difficulty
    } = req.body;

    console.log('Creating course with data:', {
      title, category, level, price, lessons: lessons?.length
    });

    // Check if course with same title already exists
    const existingCourse = await Course.findOne({ title });
    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: 'Course with this title already exists'
      });
    }

    // Create course data object
    const courseData = {
      title,
      description,
      shortDescription,
      category,
      subcategory,
      level,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      thumbnail: thumbnail || "https://via.placeholder.com/400x225?text=Course+Thumbnail",
      previewVideo,
      lessons: lessons || [],
      requirements: requirements || [],
      whatYouWillLearn: whatYouWillLearn || [],
      targetAudience: targetAudience || [],
      tags: tags || [],
      language: language || "English",
      certificate: certificate || { available: true, passingScore: 70 },
      status: status || "published",
      difficulty: difficulty || "Medium",
      createdBy: req.user._id, // Set the current admin as creator
      isPublished: status !== "draft"
    };

    // Create the course
    const course = await Course.create(courseData);

    // Populate the created course
    const populatedCourse = await Course.findById(course._id)
      .populate('createdBy', 'FullName email');

    console.log('Course created successfully:', course._id);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: populatedCourse // Changed from 'course' to 'data'
    });

  } catch (error) {
    console.error('Create course error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating course',
      error: error.message
    });
  }
};

// @desc    Update course
// @route   PUT /api/admin/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
  console.log('Update course request body:', req.body);
  try {
    const {
      title,
      description,
      shortDescription,
      category,
      subcategory,
      level,
      price,
      originalPrice,
      thumbnail,
      previewVideo,
      lessons,
      requirements,
      whatYouWillLearn,
      targetAudience,
      tags,
      language,
      certificate,
      status,
      difficulty,
      isFeatured,
      isPopular
    } = req.body;

    console.log('Updating course:', req.params.id, { title, category, price });

    // Check if course exists
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if title is being changed and if it already exists
    if (title && title !== course.title) {
      const existingCourse = await Course.findOne({ title });
      if (existingCourse) {
        return res.status(400).json({
          success: false,
          message: 'Course with this title already exists'
        });
      }
    }

    // Build update object
    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (shortDescription !== undefined) updateFields.shortDescription = shortDescription;
    if (category) updateFields.category = category;
    if (subcategory !== undefined) updateFields.subcategory = subcategory;
    if (level) updateFields.level = level;
    if (price) updateFields.price = parseFloat(price);
    if (originalPrice !== undefined) updateFields.originalPrice = originalPrice ? parseFloat(originalPrice) : undefined;
    if (thumbnail !== undefined) updateFields.thumbnail = thumbnail;
    if (previewVideo !== undefined) updateFields.previewVideo = previewVideo;
    if (lessons) updateFields.lessons = lessons;
    if (requirements) updateFields.requirements = requirements;
    if (whatYouWillLearn) updateFields.whatYouWillLearn = whatYouWillLearn;
    if (targetAudience) updateFields.targetAudience = targetAudience;
    if (tags) updateFields.tags = tags;
    if (language) updateFields.language = language;
    if (certificate) updateFields.certificate = certificate;
    if (status) {
      updateFields.status = status;
      updateFields.isPublished = status !== "draft";
      if (status === "published" && !course.publishedAt) {
        updateFields.publishedAt = new Date();
      }
    }
    if (difficulty) updateFields.difficulty = difficulty;
    if (typeof isFeatured === 'boolean') updateFields.isFeatured = isFeatured;
    if (typeof isPopular === 'boolean') updateFields.isPopular = isPopular;

    // Update the course
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { 
        new: true, // Return updated document
        runValidators: true // Run model validators
      }
    ).populate('createdBy', 'FullName email');

    console.log('Course updated successfully:', updatedCourse._id);

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse // Changed from 'course' to 'data'
    });

  } catch (error) {
    console.error('Update course error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating course',
      error: error.message
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/admin/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Optional: Check if course has enrollments before deletion
    if (course.enrollmentCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete course with active enrollments'
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });

  } catch (error) {
    console.error('Delete course error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting course',
      error: error.message
    });
  }
};

// @desc    Update course status
// @route   PATCH /api/admin/courses/:id/status
// @access  Private/Admin
const updateCourseStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    const validStatuses = ["draft", "review", "published", "archived"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: draft, review, published, archived'
      });
    }

    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const updateFields = {
      status,
      isPublished: status === "published"
    };

    // Set publishedAt if publishing for the first time
    if (status === "published" && !course.publishedAt) {
      updateFields.publishedAt = new Date();
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    ).populate('createdBy', 'FullName email');

    res.status(200).json({
      success: true,
      message: `Course status updated to ${status}`,
      data: updatedCourse // Changed from 'course' to 'data'
    });

  } catch (error) {
    console.error('Update course status error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating course status',
      error: error.message
    });
  }
};

// @desc    Recalculate course duration
// @route   POST /api/admin/courses/:id/recalculate-duration
// @access  Private/Admin
const recalculateCourseDuration = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Trigger the pre-save middleware to recalculate duration
    await course.save();

    const updatedCourse = await Course.findById(req.params.id)
      .populate('createdBy', 'FullName email');

    res.status(200).json({
      success: true,
      message: 'Course duration recalculated successfully',
      data: updatedCourse // Changed from 'course' to 'data'
    });

  } catch (error) {
    console.error('Recalculate course duration error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while recalculating course duration',
      error: error.message
    });
  }
};

module.exports = {
  // User Management
  getAllUsers,
  getUserById,
  updatedUser,
  deleteUser,
  
  // Course Management
  getAllCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  updateCourseStatus,
  recalculateCourseDuration
};