const Enrollment = require('../model/Enrollment');
const Course = require('../model/Course');
const Lesson = require('../model/Lesson');
const Payment = require('../model/Payment');

// @desc    Enroll in a course
// @route   POST /api/enrollments/courses/:courseId
// @access  Private
exports.enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if course exists and is active
    const course = await Course.findOne({ 
      _id: courseId, 
      isActive: true 
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or not active'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course'
      });
    }

    // For paid courses, check if payment was made
    if (course.price > 0) {
      const successfulPayment = await Payment.findOne({
        student: req.user.id,
        course: courseId,
        status: 'captured'
      });

      if (!successfulPayment) {
        return res.status(402).json({
          success: false,
          message: 'Payment required to enroll in this course',
          requiresPayment: true,
          coursePrice: course.price
        });
      }
    }

    // Create enrollment
    const enrollment = new Enrollment({
      student: req.user.id,
      course: courseId
    });

    await enrollment.save();

    // Update course total students count
    await course.updateTotalStudents();
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in the course',
      enrollment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error enrolling in course',
      error: error.message
    });
  }
};

// @desc    Get user's enrollments
// @route   GET /api/enrollments/my-courses
// @access  Private
exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ 
      student: req.user.id 
    })
    .populate({
      path: 'course',
      select: 'courseTitle courseImage courseSummary duration price category difficulty averageRating totalStudents isActive',
      populate: {
        path: 'createdBy',
        select: 'name'
      }
    })
    .sort({ enrolledAt: -1 });

    // Calculate progress for each enrollment
    const enrollmentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        // Skip if course is not found or inactive
        if (!enrollment.course) {
          enrollment.course = { 
            courseTitle: 'Course Not Available',
            isActive: false 
          };
          return enrollment;
        }

        const totalLessons = await Lesson.countDocuments({ 
          course: enrollment.course._id, 
          isActive: true 
        });
        
        enrollment.calculateProgress(totalLessons);
        await enrollment.save();

        return enrollment;
      })
    );

    res.json({
      success: true,
      count: enrollments.length,
      enrollments: enrollmentsWithProgress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching enrollments',
      error: error.message
    });
  }
};

// @desc    Get enrollment status for a course
// @route   GET /api/enrollments/courses/:courseId
// @access  Private
exports.getEnrollmentStatus = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId
    })
    .populate('course', 'courseTitle courseImage duration totalLessons isActive')
    .populate('completedLessons.lesson', 'lessonTitle order duration');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Not enrolled in this course'
      });
    }

    // Check if course is still active
    if (!enrollment.course.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This course is no longer available'
      });
    }

    // Calculate current progress
    const totalLessons = await Lesson.countDocuments({ 
      course: courseId, 
      isActive: true 
    });
    enrollment.calculateProgress(totalLessons);
    await enrollment.save();

    res.json({
      success: true,
      enrollment,
      progress: {
        completed: enrollment.completedLessons.length,
        total: totalLessons,
        percentage: enrollment.progress
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching enrollment status',
      error: error.message
    });
  }
};

// @desc    Cancel enrollment
// @route   DELETE /api/enrollments/courses/:courseId
// @access  Private
exports.cancelEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOneAndDelete({
      student: req.user.id,
      course: courseId
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Update course total students count
    const course = await Course.findById(courseId);
    if (course) {
      await course.updateTotalStudents();
      await course.save();
    }

    res.json({
      success: true,
      message: 'Enrollment cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling enrollment',
      error: error.message
    });
  }
};

// @desc    Get course progress
// @route   GET /api/enrollments/courses/:courseId/progress
// @access  Private
exports.getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Not enrolled in this course'
      });
    }

    const totalLessons = await Lesson.countDocuments({ 
      course: courseId, 
      isActive: true 
    });
    
    const progress = enrollment.calculateProgress(totalLessons);
    await enrollment.save();

    const lessons = await Lesson.find({ 
      course: courseId, 
      isActive: true 
    }).sort({ order: 1 });

    const lessonsWithCompletion = lessons.map(lesson => ({
      _id: lesson._id,
      lessonTitle: lesson.lessonTitle,
      order: lesson.order,
      duration: lesson.duration,
      isPreview: lesson.isPreview,
      isCompleted: enrollment.completedLessons.some(
        completedLesson => completedLesson.lesson.toString() === lesson._id.toString()
      )
    }));

    res.json({
      success: true,
      progress: {
        percentage: progress,
        completed: enrollment.completedLessons.length,
        total: totalLessons,
        lessons: lessonsWithCompletion
      },
      enrollmentStatus: enrollment.status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching course progress',
      error: error.message
    });
  }
};

// @desc    Mark lesson as completed
// @route   POST /api/enrollments/courses/:courseId/lessons/:lessonId/complete
// @access  Private
exports.markLessonCompleted = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You are not enrolled in this course'
      });
    }

    // Check if lesson exists and belongs to the course
    const lesson = await Lesson.findOne({
      _id: lessonId,
      course: courseId,
      isActive: true
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    enrollment.markLessonCompleted(lessonId);
    
    const totalLessons = await Lesson.countDocuments({ 
      course: courseId, 
      isActive: true 
    });
    enrollment.calculateProgress(totalLessons);
    enrollment.updateLastAccessed();

    await enrollment.save();

    res.json({
      success: true,
      message: 'Lesson marked as completed',
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons.length,
      totalLessons,
      isCourseCompleted: enrollment.status === 'completed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking lesson as completed',
      error: error.message
    });
  }
};

// @desc    Mark lesson as uncompleted
// @route   POST /api/enrollments/courses/:courseId/lessons/:lessonId/uncomplete
// @access  Private
exports.markLessonUncompleted = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You are not enrolled in this course'
      });
    }

    // Remove lesson from completed lessons
    enrollment.completedLessons = enrollment.completedLessons.filter(
      completedLesson => completedLesson.lesson.toString() !== lessonId
    );

    // Reset completedAt if course was marked as completed
    if (enrollment.status === 'completed') {
      enrollment.status = 'active';
      enrollment.completedAt = null;
    }

    const totalLessons = await Lesson.countDocuments({ 
      course: courseId, 
      isActive: true 
    });
    enrollment.calculateProgress(totalLessons);
    enrollment.updateLastAccessed();

    await enrollment.save();

    res.json({
      success: true,
      message: 'Lesson marked as uncompleted',
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons.length,
      totalLessons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking lesson as uncompleted',
      error: error.message
    });
  }
};

// @desc    Get certificate
// @route   GET /api/enrollments/courses/:courseId/certificate
// @access  Private
exports.getCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId
    }).populate('course', 'courseTitle certificate requirements isActive');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Check if course is active
    if (!enrollment.course.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Course is no longer available'
      });
    }

    if (enrollment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Course not completed yet'
      });
    }

    // Check if user passed the MCQ test (if exists)
    const course = await Course.findById(courseId);
    if (course && course.mcqTest) {
      const studentAttempts = course.testAttempts.filter(
        attempt => attempt.student.toString() === req.user.id
      );
      
      const passedAttempt = studentAttempts.find(attempt => attempt.passed);
      
      if (!passedAttempt) {
        return res.status(400).json({
          success: false,
          message: 'You need to pass the course assessment to get certificate'
        });
      }
    }

    // Generate certificate data (in real app, you'd generate a PDF)
    const certificate = {
      studentName: req.user.name,
      courseTitle: enrollment.course.courseTitle,
      completionDate: enrollment.completedAt,
      certificateId: `CERT-${enrollment._id.toString().slice(-8).toUpperCase()}`,
      issuedAt: new Date()
    };

    res.json({
      success: true,
      certificate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating certificate',
      error: error.message
    });
  }
};

// @desc    Get enrollment analytics (Admin only)
// @route   GET /api/enrollments/admin/analytics
// @access  Admin
exports.getEnrollmentAnalytics = async (req, res) => {
  try {
    const totalEnrollments = await Enrollment.countDocuments();
    const activeEnrollments = await Enrollment.countDocuments({ status: 'active' });
    const completedEnrollments = await Enrollment.countDocuments({ status: 'completed' });
    
    const popularCourses = await Enrollment.aggregate([
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
        $match: {
          'course.isActive': true
        }
      },
      {
        $group: {
          _id: '$course._id',
          enrollmentCount: { $sum: 1 },
          completedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          courseTitle: { $first: '$course.courseTitle' }
        }
      },
      {
        $project: {
          courseTitle: 1,
          enrollmentCount: 1,
          completedCount: 1,
          completionRate: {
            $multiply: [
              { $divide: ['$completedCount', '$enrollmentCount'] },
              100
            ]
          }
        }
      },
      {
        $sort: { enrollmentCount: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      success: true,
      analytics: {
        totalEnrollments,
        activeEnrollments,
        completedEnrollments,
        completionRate: totalEnrollments > 0 ? 
          (completedEnrollments / totalEnrollments) * 100 : 0,
        popularCourses
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching enrollment analytics',
      error: error.message
    });
  }
};

// @desc    Get course enrollments (Admin only)
// @route   GET /api/enrollments/admin/courses/:courseId/enrollments
// @access  Admin
exports.getCourseEnrollments = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const enrollments = await Enrollment.find({ course: courseId })
      .populate('student', 'name email profilePicture')
      .sort({ enrolledAt: -1 });

    res.json({
      success: true,
      count: enrollments.length,
      enrollments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching course enrollments',
      error: error.message
    });
  }
};