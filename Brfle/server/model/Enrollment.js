// const mongoose = require("mongoose");

// const enrollmentSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   course: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Course",
//     required: true,
//   },
//   // 👇 make payment optional
//   payment: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Payment",
//     required: false,
//   },
//   enrolledAt: {
//     type: Date,
//     default: Date.now,
//   },
//   // 👇 allow in-progress as valid status
//   status: {
//     type: String,
//     enum: ["active", "completed", "suspended", "in-progress"], // add in-progress
//     default: "in-progress",
//   },
//   progress: {
//     completedLessons: [
//       {
//         lessonId: String,
//         completedAt: Date,
//       },
//     ],
//     totalLessons: {
//       type: Number,
//       default: 0,
//     },
//     completionPercentage: {
//       type: Number,
//       default: 0,
//     },
//     lastAccessedAt: {
//       type: Date,
//       default: Date.now,
//     },
//     timeSpent: {
//       type: Number, // in minutes
//       default: 0,
//     },
//   },
//   certificate: {
//     issued: {
//       type: Boolean,
//       default: false,
//     },
//     issuedAt: Date,
//     certificateId: String,
//   },
// });

// // Ensure unique enrollment per user per course
// enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

// module.exports = mongoose.model("Enrollment", enrollmentSchema);

const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completedLessons: [{
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson'
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  completedAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  totalTimeSpent: {
    type: Number, // in minutes
    default: 0
  }
});

// Index for unique enrollment per student per course
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

// Update last accessed timestamp
enrollmentSchema.methods.updateLastAccessed = function() {
  this.lastAccessed = new Date();
};

// Calculate progress percentage
enrollmentSchema.methods.calculateProgress = function(totalLessons) {
  if (totalLessons === 0) return 0;
  this.progress = Math.round((this.completedLessons.length / totalLessons) * 100);
  return this.progress;
};

// Mark lesson as completed
enrollmentSchema.methods.markLessonCompleted = function(lessonId) {
  if (!this.completedLessons.some(lesson => lesson.lesson.toString() === lessonId.toString())) {
    this.completedLessons.push({
      lesson: lessonId,
      completedAt: new Date()
    });
    
    // If all lessons are completed, mark course as completed
    if (this.progress === 100 && !this.completedAt) {
      this.completedAt = new Date();
      this.status = 'completed';
    }
  }
};

// Check if course is completed
enrollmentSchema.methods.isCourseCompleted = function(totalLessons) {
  return this.completedLessons.length === totalLessons;
};

module.exports = mongoose.model('Enrollment', enrollmentSchema);