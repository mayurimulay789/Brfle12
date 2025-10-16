


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
  
  // ✅ ADD PERMANENT TRACKING FIELDS
  sectionProgress: {
    lessons: { type: Number, default: 0 },        // 20 credits max
    courseBook: { type: Number, default: 0 },     // 20 credits max  
    projectBook: { type: Number, default: 0 },    // 20 credits max
    test: { type: Number, default: 0 },           // 20 credits max
    experience: { type: Number, default: 0 }      // 20 credits max
  },
  
  completedSections: {
    lessons: { type: Boolean, default: false },
    courseBook: { type: Boolean, default: false },
    projectBook: { type: Boolean, default: false },
    test: { type: Boolean, default: false },
    experience: { type: Boolean, default: false }
  },
  
  accessedMaterials: {
    courseBook: { type: Boolean, default: false },
    projectBook: { type: Boolean, default: false }
  },
  
  testAttempts: [{
    score: Number,
    percentage: Number,
    passed: Boolean,
    attemptedAt: {
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

// ✅ UPDATED: Calculate progress with 100-credit system
enrollmentSchema.methods.calculateProgress = function(totalLessons) {
  if (totalLessons === 0) return 0;
  
  // Calculate lessons progress (20 credits)
  const lessonsProgress = (this.completedLessons.length / totalLessons) * 20;
  this.sectionProgress.lessons = Math.min(lessonsProgress, 20);
  
  // Only give full 20 credits if ALL lessons are completed
  if (this.completedLessons.length === totalLessons) {
    this.sectionProgress.lessons = 20;
    this.completedSections.lessons = true;
  } else {
    this.completedSections.lessons = false;
  }
  
  // Calculate total progress (sum of all sections)
  const total = Object.values(this.sectionProgress).reduce((sum, current) => sum + current, 0);
  this.progress = Math.min(total, 100);
  
  // Mark course as completed if 100% progress
  if (this.progress === 100 && !this.completedAt) {
    this.completedAt = new Date();
    this.status = 'completed';
  }
  
  return this.progress;
};

// ✅ UPDATED: Mark lesson as completed
enrollmentSchema.methods.markLessonCompleted = function(lessonId) {
  if (!this.completedLessons.some(lesson => lesson.lesson.toString() === lessonId.toString())) {
    this.completedLessons.push({
      lesson: lessonId,
      completedAt: new Date()
    });
    return true; // Return success
  }
  return false; // Already completed
};

// ✅ NEW: Mark section as completed
enrollmentSchema.methods.markSectionCompleted = function(sectionName) {
  if (this.sectionProgress[sectionName] !== 20) {
    this.sectionProgress[sectionName] = 20;
    this.completedSections[sectionName] = true;
    return true;
  }
  return false;
};

// ✅ NEW: Mark material as accessed
enrollmentSchema.methods.markMaterialAccessed = function(materialType) {
  this.accessedMaterials[materialType] = true;
  
  // Auto-complete section if material is accessed
  if (materialType === 'courseBook' && !this.completedSections.courseBook) {
    this.sectionProgress.courseBook = 20;
    this.completedSections.courseBook = true;
  }
  
  if (materialType === 'projectBook' && !this.completedSections.projectBook) {
    this.sectionProgress.projectBook = 20;
    this.completedSections.projectBook = true;
  }
};

// ✅ NEW: Add test attempt
enrollmentSchema.methods.addTestAttempt = function(score, percentage, passed) {
  this.testAttempts.push({
    score,
    percentage,
    passed,
    attemptedAt: new Date()
  });
  
  if (passed && !this.completedSections.test) {
    this.sectionProgress.test = 20;
    this.completedSections.test = true;
  }
};

// ✅ NEW: Add experience
enrollmentSchema.methods.addExperience = function() {
  if (!this.completedSections.experience) {
    this.sectionProgress.experience = 20;
    this.completedSections.experience = true;
  }
};

// Check if course is completed
enrollmentSchema.methods.isCourseCompleted = function(totalLessons) {
  return this.completedLessons.length === totalLessons;
};

module.exports = mongoose.model('Enrollment', enrollmentSchema);

// Export the model like this instead:
// module.exports = mongoose.models.Enrollment || mongoose.model('Enrollment', enrollmentSchema);