// const Enrollment = require("../model/Enrollment");
// const Course = require("../model/Course");
// const mongoose = require("mongoose");

// // ✅ POST /api/enrollments - Enroll a user to a course
// const enrollUser = async (req, res) => {
//   try {
//     const { courseId } = req.body;
//     const userId = req.user.id;

//     if (!courseId) {
//       return res.status(400).json({ message: "Course ID is required" });
//     }

//     // Check if course exists
//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     // Check if already enrolled
//     const existingEnrollment = await Enrollment.findOne({
//       user: userId,
//       course: courseId,
//     });
//     if (existingEnrollment) {
//       return res.status(400).json({ message: "You are already enrolled in this course" });
//     }

//     // Create new enrollment
//     const enrollment = new Enrollment({
//       user: userId,
//       course: courseId,
//       progress: {
//         completedLessons: [],
//         totalLessons: course.lessons ? course.lessons.length : 0, // safe check
//         completionPercentage: 0,
//         lastAccessedAt: null,
//       },
//       certificate: {
//         issued: false,
//         issuedAt: null,
//         certificateId: null,
//       },
//       status: "in-progress", // must exist in schema enum
//       enrolledAt: new Date(),
//     });

//     await enrollment.save();

//     res.status(201).json({
//       message: "Enrolled successfully!",
//       enrollmentId: enrollment._id,
//       courseId: course._id,
//     });
//   } catch (error) {
//     console.error("Enrollment error:", error);
//     res.status(500).json({ message: "Failed to enroll in course", error: error.message });
//   }
// };

// // ✅ GET /api/enrollments/me - Get all user enrollments
// const getUserEnrollments = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const enrollments = await Enrollment.find({ user: userId })
//       .populate("course", "title description instructor thumbnail duration level reviewCount avgRating")
//       .populate("payment", "amount createdAt")
//       .sort({ enrolledAt: -1 });

//     res.json(enrollments);
//   } catch (error) {
//     console.error("Error fetching enrollments:", error);
//     res.status(500).json({ message: "Failed to fetch enrollments" });
//   }
// };

// // ✅ GET /api/enrollments/:courseId - Get a specific enrollment
// const getEnrollmentByCourse = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const userId = req.user.id;

//     const enrollment = await Enrollment.findOne({
//       user: userId,
//       course: courseId,
//       status: "active"
//     })
//       .populate("course")
//       .populate("payment");

//     if (!enrollment) {
//       return res.status(404).json({ message: "Enrollment not found" });
//     }

//     res.json(enrollment);
//   } catch (error) {
//     console.error("Error fetching enrollment:", error);
//     res.status(500).json({ message: "Failed to fetch enrollment" });
//   }
// };

// // ✅ POST /api/enrollments/progress - Update course progress
// const updateProgress = async (req, res) => {
//   try {
//     const { courseId, lessonId, timeSpent } = req.body;
//     const userId = req.user.id;

//     const enrollment = await Enrollment.findOne({
//       user: userId,
//       course: courseId,
//     });

//     if (!enrollment) {
//       return res.status(404).json({ message: "Enrollment not found" });
//     }

//     // Initialize progress if not exists (for legacy enrollments)
//     if (!enrollment.progress) {
//       const course = await Course.findById(courseId);
//       enrollment.progress = {
//         completedLessons: [],
//         totalLessons: course ? course.lessons.length : 0,
//         completionPercentage: 0,
//         lastAccessedAt: new Date(),
//       };
//     }

//     // Always update totalLessons to current course lessons count
//     const course = await Course.findById(courseId);
//     enrollment.progress.totalLessons = course ? course.lessons.length : 0;

//     // Check if lesson is already completed
//     const existingLesson = enrollment.progress.completedLessons.find(
//       (lesson) => lesson.lessonId === lessonId
//     );

//     if (!existingLesson) {
//       // Add new completed lesson
//       enrollment.progress.completedLessons.push({
//         lessonId,
//         completedAt: new Date(),
//       });

//       // Update completion percentage
//       enrollment.progress.completionPercentage = Math.round(
//         (enrollment.progress.completedLessons.length / enrollment.progress.totalLessons) * 100
//       );
//     }

//     // Update last accessed only, remove timeSpent tracking
//     enrollment.progress.lastAccessedAt = new Date();

//     // Check if course is completed and trigger certificate generation
//     if (enrollment.progress.completionPercentage >= 100 && !enrollment.certificate.issued) {
//       try {
//         const certificateService = require("../services/certificateService");
//         const User = require("../models/User");

//         const user = await User.findById(userId);
//         const course = await Course.findById(courseId);

//         // Remove hoursCompleted calculation based on timeSpent
//         const hoursCompleted = 0;

//         const skillsMap = {
//           Programming: ["Problem Solving", "Code Development", "Debugging", "Software Architecture"],
//           Design: ["Visual Design", "User Experience", "Prototyping", "Design Thinking"],
//           Marketing: ["Digital Strategy", "Analytics", "Campaign Management", "Brand Development"],
//           Business: ["Strategic Planning", "Leadership", "Project Management", "Business Analysis"],
//           Creative: ["Creative Thinking", "Visual Communication", "Artistic Expression", "Media Production"],
//         };
//         const skills = skillsMap[course.category] || [
//           "Professional Development",
//           "Continuous Learning",
//         ];

//         // Generate certificate automatically
//         const certificate = await certificateService.generateCertificate({
//           user,
//           course,
//           enrollment,
//           studentName: user.name,
//           courseName: course.title,
//           instructor: course.instructor,
//           completionDate: new Date(),
//           finalScore: 85,
//           hoursCompleted,
//           skills,
//           metadata: {
//             autoGenerated: true,
//             triggeredBy: "progress_completion",
//           },
//         });

//         // Update enrollment with certificate info
//         enrollment.certificate.issued = true;
//         enrollment.certificate.issuedAt = certificate.issueDate;
//         enrollment.certificate.certificateId = certificate.certificateId;
//         enrollment.status = "completed";
//       } catch (error) {
//         console.error("Auto certificate generation error:", error);
//       }
//     }

//     await enrollment.save();

//     res.json({
//       message: "Progress updated successfully",
//       progress: enrollment.progress,
//       certificate: enrollment.certificate,
//     });
//   } catch (error) {
//     console.error("Error updating progress:", error);
//     res.status(500).json({ message: "Failed to update progress" });
//   }
// };

// // ✅ GET /api/enrollments/progress/:courseId - Get progress of specific course
// const getProgress = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const userId = req.user.id;

//     if (!mongoose.Types.ObjectId.isValid(courseId)) {
//       console.warn(`Invalid course ID received: ${courseId}`);
//       return res.status(400).json({ message: "Invalid course ID" });
//     }

//     const enrollment = await Enrollment.findOne({
//       user: userId,
//       course: courseId,
//     });

//     if (!enrollment) {
//       return res.status(404).json({ message: "Enrollment not found" });
//     }

//     // Initialize progress if not exists (for legacy enrollments)
//     if (!enrollment.progress) {
//       const course = await Course.findById(courseId);
//       if (enrollment.status === "completed") {
//         // For legacy completed enrollments, mark all lessons as complete
//         const allCompletedLessons = course.lessons.map(lesson => ({
//           lessonId: lesson._id,
//           completedAt: enrollment.enrolledAt || new Date(),
//         }));
//         enrollment.progress = {
//           completedLessons: allCompletedLessons,
//           totalLessons: course.lessons.length,
//           completionPercentage: 100,
//           timeSpent: 0, // Could estimate or leave as 0
//           lastAccessedAt: new Date(),
//         };

//         // Auto-generate certificate if not issued
//         if (!enrollment.certificate.issued) {
//           try {
//             const certificateService = require("../services/certificateService");
//             const User = require("../models/User");

//             const user = await User.findById(userId);
//             const hoursCompleted = 10; // Default for legacy

//             const skillsMap = {
//               Programming: ["Problem Solving", "Code Development", "Debugging", "Software Architecture"],
//               Design: ["Visual Design", "User Experience", "Prototyping", "Design Thinking"],
//               Marketing: ["Digital Strategy", "Analytics", "Campaign Management", "Brand Development"],
//               Business: ["Strategic Planning", "Leadership", "Project Management", "Business Analysis"],
//               Creative: ["Creative Thinking", "Visual Communication", "Artistic Expression", "Media Production"],
//             };
//             const skills = skillsMap[course.category] || ["Professional Development", "Continuous Learning"];

//             const certificate = await certificateService.generateCertificate({
//               user,
//               course,
//               enrollment,
//               studentName: user.name,
//               courseName: course.title,
//               instructor: course.instructor,
//               completionDate: enrollment.enrolledAt || new Date(),
//               finalScore: 85,
//               hoursCompleted,
//               skills,
//               metadata: {
//                 autoGenerated: true,
//                 triggeredBy: "legacy_completion",
//               },
//             });

//             enrollment.certificate.issued = true;
//             enrollment.certificate.issuedAt = certificate.issueDate;
//             enrollment.certificate.certificateId = certificate.certificateId;
//           } catch (error) {
//             console.error("Auto certificate generation for legacy error:", error);
//           }
//         }
//       } else {
//         enrollment.progress = {
//           completedLessons: [],
//           totalLessons: course ? course.lessons.length : 0,
//           completionPercentage: 0,
//           timeSpent: 0,
//           lastAccessedAt: new Date(),
//         };
//       }
//       await enrollment.save();
//     }

//     // Fix progress inconsistency: if certificate is issued but progress < 100%, set to 100%
//     if (enrollment.certificate.issued && enrollment.progress.completionPercentage < 100) {
//       const course = await Course.findById(courseId);
//       enrollment.progress.completedLessons = course.lessons.map(lesson => ({
//         lessonId: lesson._id.toString(),
//         completedAt: enrollment.certificate.issuedAt || new Date(),
//       }));
//       enrollment.progress.totalLessons = course.lessons.length;
//       enrollment.progress.completionPercentage = 100;
//       enrollment.status = "completed";
//       await enrollment.save();
//     }

//     res.json({
//       progress: enrollment.progress,
//       certificate: enrollment.certificate,
//       enrolledAt: enrollment.enrolledAt,
//       status: enrollment.status,
//     });
//   } catch (error) {
//     console.error("Error fetching progress:", error);
//     res.status(500).json({ message: "Failed to fetch progress" });
//   }
// };

// // DEV ROUTE: force issue a certificate for a course
// const forceCertificate = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const enrollment = await Enrollment.findOne({
//       user: req.user.id,
//       course: courseId
//     });

//     if (!enrollment) {
//       return res.status(404).json({ message: "Enrollment not found" });
//     }

//     // Mark certificate issued
//     enrollment.certificate.issued = true;
//     enrollment.certificate.issuedAt = new Date();
//     enrollment.certificate.certificateId = "FORCED_CERT_" + Date.now();
//     enrollment.status = "completed";

//     await enrollment.save();

//     res.json({
//       message: "Certificate issued manually",
//       certificate: enrollment.certificate
//     });
//   } catch (err) {
//     console.error("Force certificate error:", err);
//     res.status(500).json({ message: "Failed to issue certificate" });
//   }
// };

// // ✅ GET /api/enrollments/certificates/me - Get all user certificates
// const getUserCertificates = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const enrollments = await Enrollment.find({
//       user: userId,
//       "certificate.issued": true,
//     })
//       .populate("course", "title instructor")
//       .select("certificate course");

//     const certificates = enrollments.map((enrollment) => ({
//       _id: enrollment._id,
//       certificateId: enrollment.certificate.certificateId,
//       courseName: enrollment.course.title,
//       instructor: enrollment.course.instructor,
//       issuedAt: enrollment.certificate.issuedAt,
//       courseId: enrollment.course._id,
//     }));

//     res.json(certificates);
//   } catch (error) {
//     console.error("Error fetching certificates:", error);
//     res.status(500).json({ message: "Failed to fetch certificates" });
//   }
// };

// module.exports = {
//   enrollUser,
//   getUserEnrollments,
//   getEnrollmentByCourse,
//   updateProgress,
//   getProgress,
//   forceCertificate,
//   getUserCertificates
// };


const Enrollment = require('../model/Enrollment');
const Course = require('../model/Course');
const Lesson = require('../model/Lesson');

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
      select: 'courseTitle courseImage courseSummary duration price category difficulty averageRating totalStudents',
      populate: {
        path: 'createdBy',
        select: 'name'
      }
    })
    .sort({ enrolledAt: -1 });

    // Calculate progress for each enrollment
    const enrollmentsWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
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
    .populate('course', 'courseTitle courseImage duration totalLessons')
    .populate('completedLessons.lesson', 'lessonTitle order duration');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Not enrolled in this course'
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
    }).populate('course', 'courseTitle certificate requirements');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
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
    if (course.mcqTest) {
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
        $group: {
          _id: '$course',
          enrollmentCount: { $sum: 1 },
          completedCount: {
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