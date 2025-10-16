// 
const Enrollment = require('../model/Enrollment');
const Course = require('../model/Course');
const Lesson = require('../model/Lesson');
const Payment = require('../model/Payment');

// @desc    Enroll in a course
// @route   POST /api/enrollments/courses/:courseId
// @access  Private
const enrollInCourse = async (req, res) => {
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

    // Create enrollment with section progress
    const enrollment = new Enrollment({
      student: req.user.id,
      course: courseId,
      sectionProgress: {
        lessons: 0,
        courseBook: 0,
        projectBook: 0,
        test: 0,
        experience: 0
      },
      completedSections: {
        lessons: false,
        courseBook: false,
        projectBook: false,
        test: false,
        experience: false
      },
      accessedMaterials: {
        courseBook: false,
        projectBook: false
      }
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
const getMyEnrollments = async (req, res) => {
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
const getEnrollmentStatus = async (req, res) => {
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
        percentage: enrollment.progress,
        sectionProgress: enrollment.sectionProgress,
        completedSections: enrollment.completedSections
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
const cancelEnrollment = async (req, res) => {
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
const getCourseProgress = async (req, res) => {
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
    
    // Ensure progress is calculated
    enrollment.calculateProgress(totalLessons);
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
        overall: enrollment.progress,
        percentage: enrollment.progress,
        completed: enrollment.completedLessons.length,
        total: totalLessons,
        lessons: lessonsWithCompletion,
        // ✅ RETURN SECTION PROGRESS FOR 100-CREDIT SYSTEM
        sectionProgress: enrollment.sectionProgress,
        completedSections: enrollment.completedSections,
        accessedMaterials: enrollment.accessedMaterials
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
const markLessonCompleted = async (req, res) => {
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

    // Mark lesson as completed
    const wasMarked = enrollment.markLessonCompleted(lessonId);
    
    if (!wasMarked) {
      return res.status(400).json({
        success: false,
        message: 'Lesson already completed'
      });
    }

    const totalLessons = await Lesson.countDocuments({ 
      course: courseId, 
      isActive: true 
    });
    
    // Calculate progress with new 100-credit system
    enrollment.calculateProgress(totalLessons);
    enrollment.updateLastAccessed();

    await enrollment.save();

    res.json({
      success: true,
      message: 'Lesson marked as completed',
      progress: {
        overall: enrollment.progress,
        lessons: enrollment.sectionProgress.lessons,
        completedLessons: enrollment.completedLessons.length,
        totalLessons,
        isCourseCompleted: enrollment.status === 'completed'
      },
      sectionProgress: enrollment.sectionProgress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking lesson as completed',
      error: error.message
    });
  }
};

// @desc    Mark material as accessed
// @route   POST /api/enrollments/courses/:courseId/access-material
// @access  Private
const markMaterialAccessed = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { materialType } = req.body; // 'courseBook' or 'projectBook'

    if (!['courseBook', 'projectBook'].includes(materialType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid material type'
      });
    }

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

    // Mark material as accessed and complete the section
    enrollment.markMaterialAccessed(materialType);
    
    // Recalculate overall progress
    const totalLessons = await Lesson.countDocuments({ 
      course: courseId, 
      isActive: true 
    });
    enrollment.calculateProgress(totalLessons);
    enrollment.updateLastAccessed();

    await enrollment.save();

    res.json({
      success: true,
      message: `${materialType === 'courseBook' ? 'Course book' : 'Project book'} accessed and section completed`,
      progress: {
        overall: enrollment.progress,
        ...enrollment.sectionProgress
      },
      sectionProgress: enrollment.sectionProgress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error accessing material',
      error: error.message
    });
  }
};

// @desc    Add test attempt
// @route   POST /api/enrollments/courses/:courseId/test-attempt
// @access  Private
const addTestAttempt = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { score, percentage, passed } = req.body;

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

    // Add test attempt
    enrollment.addTestAttempt(score, percentage, passed);
    
    // Recalculate overall progress
    const totalLessons = await Lesson.countDocuments({ 
      course: courseId, 
      isActive: true 
    });
    enrollment.calculateProgress(totalLessons);
    enrollment.updateLastAccessed();

    await enrollment.save();

    res.json({
      success: true,
      message: passed ? 'Test passed! Section completed.' : 'Test attempt recorded.',
      progress: {
        overall: enrollment.progress,
        ...enrollment.sectionProgress
      },
      sectionProgress: enrollment.sectionProgress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error recording test attempt',
      error: error.message
    });
  }
};

// @desc    Add experience
// @route   POST /api/enrollments/courses/:courseId/experience
// @access  Private
const addExperience = async (req, res) => {
  try {
    const { courseId } = req.params;

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

    // Add experience and complete section
    enrollment.addExperience();
    
    // Recalculate overall progress
    const totalLessons = await Lesson.countDocuments({ 
      course: courseId, 
      isActive: true 
    });
    enrollment.calculateProgress(totalLessons);
    enrollment.updateLastAccessed();

    await enrollment.save();

    res.json({
      success: true,
      message: 'Experience added and section completed',
      progress: {
        overall: enrollment.progress,
        ...enrollment.sectionProgress
      },
      sectionProgress: enrollment.sectionProgress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding experience',
      error: error.message
    });
  }
};

// @desc    Mark lesson as uncompleted
// @route   POST /api/enrollments/courses/:courseId/lessons/:lessonId/uncomplete
// @access  Private
const markLessonUncompleted = async (req, res) => {
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
const getCertificate = async (req, res) => {
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
      const passedAttempt = enrollment.testAttempts.find(attempt => attempt.passed);
      
      if (!passedAttempt) {
        return res.status(400).json({
          success: false,
          message: 'You need to pass the course assessment to get certificate'
        });
      }
    }

    // Generate certificate data
    const certificate = {
      studentName: req.user.name,
      courseTitle: enrollment.course.courseTitle,
      completionDate: enrollment.completedAt,
      certificateId: `CERT-${enrollment._id.toString().slice(-8).toUpperCase()}`,
      issuedAt: new Date(),
      progress: enrollment.progress,
      sectionProgress: enrollment.sectionProgress
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
const getEnrollmentAnalytics = async (req, res) => {
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
const getCourseEnrollments = async (req, res) => {
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


module.exports = {
  enrollInCourse,
  getMyEnrollments,
  getEnrollmentStatus,
  cancelEnrollment,
  getCourseProgress,
  markLessonCompleted,
  markMaterialAccessed,
  addTestAttempt,
  addExperience,
  markLessonUncompleted,
  getCertificate,
  getEnrollmentAnalytics,
  getCourseEnrollments
};

