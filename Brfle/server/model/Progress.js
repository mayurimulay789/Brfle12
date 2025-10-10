const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course", 
    required: true
  },
  completedLessons: [{
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    watchTime: Number,
    status: {
      type: String,
      enum: ["started", "completed", "in-progress"],
      default: "completed"
    }
  }],
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  totalWatchTime: {
    type: Number,
    default: 0
  },
  certificateIssued: {
    type: Boolean,
    default: false
  },
  certificateIssuedAt: Date,
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
}, {
  timestamps: true
});

// Index for performance
progressSchema.index({ user: 1, course: 1 }, { unique: true });
progressSchema.index({ user: 1, progress: 1 });
progressSchema.index({ course: 1, progress: 1 });

// Methods
progressSchema.methods.updateProgress = function() {
  const course = this.course;
  if (course && course.lessons) {
    const totalLessons = course.lessons.length;
    const completedCount = this.completedLessons.length;
    this.progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    
    if (this.progress === 100 && !this.completedAt) {
      this.completedAt = new Date();
    }
  }
};

progressSchema.methods.markLessonCompleted = function(lessonId, watchTime = 0) {
  const existingLesson = this.completedLessons.find(lesson => 
    lesson.lessonId.toString() === lessonId.toString()
  );
  
  if (!existingLesson) {
    this.completedLessons.push({
      lessonId,
      watchTime,
      completedAt: new Date(),
      status: "completed"
    });
    
    // Update total watch time
    this.totalWatchTime += watchTime;
    
    // Recalculate overall progress
    this.updateProgress();
  }
  
  this.lastAccessed = new Date();
  return this.save();
};

progressSchema.methods.getNextLesson = function() {
  const completedLessonIds = this.completedLessons.map(cl => cl.lessonId.toString());
  const course = this.course;
  
  if (course && course.lessons) {
    return course.lessons
      .sort((a, b) => a.order - b.order)
      .find(lesson => !completedLessonIds.includes(lesson._id.toString()));
  }
  
  return null;
};

// Static methods
progressSchema.statics.getUserProgress = function(userId, courseId) {
  return this.findOne({ user: userId, course: courseId })
    .populate('course')
    .populate('completedLessons.lessonId');
};

progressSchema.statics.getUserCourses = function(userId) {
  return this.find({ user: userId })
    .populate('course')
    .sort({ lastAccessed: -1 });
};

progressSchema.statics.getCourseProgressStats = function(courseId) {
  return this.aggregate([
    { $match: { course: mongoose.Types.ObjectId(courseId) } },
    {
      $group: {
        _id: '$course',
        totalStudents: { $sum: 1 },
        averageProgress: { $avg: '$progress' },
        completedCount: { 
          $sum: { 
            $cond: [{ $eq: ['$progress', 100] }, 1, 0] 
          } 
        },
        averageWatchTime: { $avg: '$totalWatchTime' }
      }
    }
  ]);
};

module.exports = mongoose.model("Progress", progressSchema);