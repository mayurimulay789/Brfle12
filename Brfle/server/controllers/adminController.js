

const User = require('../model/User');
const Course = require('../model/Course');
const Enrollment = require('../model/Enrollment');
const Payment = require('../model/Payment');
const Lesson = require('../model/Lesson');

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




// @desc    Get comprehensive dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Admin
const getDashboardStats = async (req, res) => {
  try {
    // Parallel execution for better performance
    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalRevenue,
      activeEnrollments,
      completedEnrollments
    ] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments({ isActive: true }),
      Enrollment.countDocuments(),
      Payment.aggregate([
        { $match: { status: 'captured' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Enrollment.countDocuments({ status: 'active' }),
      Enrollment.countDocuments({ status: 'completed' })
    ]);

    // Recent data (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      newUsers,
      newEnrollments,
      recentRevenue
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Enrollment.countDocuments({ enrolledAt: { $gte: thirtyDaysAgo } }),
      Payment.aggregate([
        { 
          $match: { 
            status: 'captured',
            paidAt: { $gte: thirtyDaysAgo }
          } 
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          new: newUsers,
          students: await User.countDocuments({ role: 'student' }),
          admins: await User.countDocuments({ role: 'admin' })
        },
        courses: {
          total: totalCourses,
          active: totalCourses,
          published: await Course.countDocuments({ isActive: true })
        },
        enrollments: {
          total: totalEnrollments,
          active: activeEnrollments,
          completed: completedEnrollments,
          new: newEnrollments,
          completionRate: totalEnrollments > 0 ? 
            (completedEnrollments / totalEnrollments) * 100 : 0
        },
        revenue: {
          total: totalRevenue[0]?.total || 0,
          recent: recentRevenue[0]?.total || 0,
          currency: 'INR'
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// @desc    Get revenue analytics
// @route   GET /api/admin/dashboard/revenue-analytics
// @access  Admin
const getRevenueAnalytics = async (req, res) => {
  try {
    const { period = '6months' } = req.query;
    
    let months = 6;
    if (period === '1year') months = 12;
    if (period === '3months') months = 3;

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    // Revenue by month
    const revenueByMonth = await Payment.aggregate([
      {
        $match: {
          status: 'captured',
          paidAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$paidAt' },
            month: { $month: '$paidAt' }
          },
          revenue: { $sum: '$amount' },
          transactions: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Revenue by course
    const revenueByCourse = await Payment.aggregate([
      {
        $match: {
          status: 'captured',
          paidAt: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'course'
        }
      },
      {
        $unwind: '$course'
      },
      {
        $group: {
          _id: '$course._id',
          revenue: { $sum: '$amount' },
          enrollments: { $sum: 1 },
          courseTitle: { $first: '$course.courseTitle' }
        }
      },
      {
        $sort: { revenue: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Payment methods and status
    const paymentStats = await Payment.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          amount: { $sum: '$amount' }
        }
      }
    ]);

    res.json({
      success: true,
      analytics: {
        period,
        revenueByMonth,
        revenueByCourse,
        paymentStats,
        totalRevenue: revenueByMonth.reduce((sum, item) => sum + item.revenue, 0),
        totalTransactions: revenueByMonth.reduce((sum, item) => sum + item.transactions, 0)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching revenue analytics',
      error: error.message
    });
  }
};

// @desc    Get course analytics
// @route   GET /api/admin/dashboard/course-analytics
// @access  Admin
const getCourseAnalytics = async (req, res) => {
  try {
    // Most popular courses by enrollments
    const popularCourses = await Enrollment.aggregate([
      {
        $group: {
          _id: '$course',
          enrollments: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course'
        }
      },
      {
        $unwind: '$course'
      },
      {
        $project: {
          courseTitle: '$course.courseTitle',
          category: '$course.category',
          price: '$course.price',
          enrollments: 1,
          completed: 1,
          completionRate: {
            $multiply: [
              { $divide: ['$completed', '$enrollments'] },
              100
            ]
          }
        }
      },
      {
        $sort: { enrollments: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Course categories distribution
    const categories = await Course.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalEnrollments: { $sum: '$totalStudents' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Course performance by completion rate
    const coursePerformance = await Enrollment.aggregate([
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'course'
        }
      },
      {
        $unwind: '$course'
      },
      {
        $group: {
          _id: '$course._id',
          courseTitle: { $first: '$course.courseTitle' },
          totalEnrollments: { $sum: 1 },
          completedEnrollments: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          averageProgress: { $avg: '$progress' }
        }
      },
      {
        $project: {
          courseTitle: 1,
          totalEnrollments: 1,
          completedEnrollments: 1,
          completionRate: {
            $multiply: [
              { $divide: ['$completedEnrollments', '$totalEnrollments'] },
              100
            ]
          },
          averageProgress: 1
        }
      },
      {
        $sort: { completionRate: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      success: true,
      analytics: {
        popularCourses,
        categories,
        coursePerformance,
        totalCourses: await Course.countDocuments({ isActive: true }),
        totalEnrollments: await Enrollment.countDocuments()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching course analytics',
      error: error.message
    });
  }
};

// @desc    Get user analytics
// @route   GET /api/admin/dashboard/user-analytics
// @access  Admin
const getUserAnalytics = async (req, res) => {
  try {
    // User growth over time
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          students: {
            $sum: { $cond: [{ $eq: ['$role', 'student'] }, 1, 0] }
          },
          admins: {
            $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Active users (users with enrollments)
    const activeUsers = await Enrollment.distinct('student');
    
    // User engagement (users who completed courses)
    const engagedUsers = await Enrollment.distinct('student', { 
      status: 'completed' 
    });

    // Geographic distribution (if you have location data)
    const geographicDistribution = await User.aggregate([
      {
        $match: {
          'location.country': { $exists: true, $ne: '' }
        }
      },
      {
        $group: {
          _id: '$location.country',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      success: true,
      analytics: {
        userGrowth,
        activeUsers: activeUsers.length,
        engagedUsers: engagedUsers.length,
        engagementRate: activeUsers.length > 0 ? 
          (engagedUsers.length / activeUsers.length) * 100 : 0,
        geographicDistribution,
        totalUsers: await User.countDocuments()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user analytics',
      error: error.message
    });
  }
};

// @desc    Get recent activities
// @route   GET /api/admin/dashboard/recent-activities
// @access  Admin
const getRecentActivities = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    // Recent enrollments
    const recentEnrollments = await Enrollment.find()
      .populate('student', 'FullName email')
      .populate('course', 'courseTitle')
      .sort({ enrolledAt: -1 })
      .limit(parseInt(limit) / 2);

    // Recent payments
    const recentPayments = await Payment.find({ status: 'captured' })
      .populate('student', 'FullName email')
      .populate('course', 'courseTitle')
      .sort({ paidAt: -1 })
      .limit(parseInt(limit) / 2);

    // Recent course completions
    const recentCompletions = await Enrollment.find({ status: 'completed' })
      .populate('student', 'FullName email')
      .populate('course', 'courseTitle')
      .sort({ completedAt: -1 })
      .limit(parseInt(limit) / 2);

    // Combine and sort all activities
    const activities = [
      ...recentEnrollments.map(enrollment => ({
        type: 'enrollment',
        user: enrollment.student.FullName,
        course: enrollment.course.courseTitle,
        timestamp: enrollment.enrolledAt,
        description: `${enrollment.student.FullName} enrolled in ${enrollment.course.courseTitle}`
      })),
      ...recentPayments.map(payment => ({
        type: 'payment',
        user: payment.student.FullName,
        course: payment.course.courseTitle,
        timestamp: payment.paidAt,
        description: `${payment.student.FullName} paid ₹${payment.amount} for ${payment.course.courseTitle}`,
        amount: payment.amount
      })),
      ...recentCompletions.map(completion => ({
        type: 'completion',
        user: completion.student.FullName,
        course: completion.course.courseTitle,
        timestamp: completion.completedAt,
        description: `${completion.student.FullName} completed ${completion.course.courseTitle}`
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
     .slice(0, parseInt(limit));

    res.json({
      success: true,
      activities,
      count: activities.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recent activities',
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
  recalculateCourseDuration,
  getDashboardStats,
  getRevenueAnalytics,
  getCourseAnalytics,
  getUserAnalytics,
  getRecentActivities
};