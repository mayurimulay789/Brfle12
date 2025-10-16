

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function(options) {
        return options.length === 4;
      },
      message: 'There must be exactly 4 options'
    }
  },
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
    validate: {
      validator: function(value) {
        return value >= 0 && value <= 3;
      },
      message: 'Correct answer must be between 0 and 3'
    }
  },
  explanation: {
    type: String,
    maxlength: 200
  }
});

const mcqTestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: "Course Assessment Test"
  },
  questions: {
    type: [questionSchema],
    validate: {
      validator: function(questions) {
        return questions.length === 20;
      },
      message: 'MCQ test must have exactly 20 questions'
    }
  },
  passingScore: {
    type: Number,
    default: 70,
    min: 0,
    max: 100
  },
  timeLimit: {
    type: Number, // in minutes
    default: 30
  },
  maxAttempts: {
    type: Number,
    default: 3
  }
});

const studentTestAttemptSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [{
    questionIndex: Number,
    selectedOption: Number,
    isCorrect: Boolean
  }],
  score: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  passed: {
    type: Boolean,
    required: true
  },
  attemptNumber: {
    type: Number,
    required: true
  },
  timeSpent: {
    type: Number, // in minutes
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

const experienceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  experience: {
    type: String,
    required: true,
    maxlength: 1000
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const courseSchema = new mongoose.Schema({
  courseTitle: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  courseGuide: {
    type: String,
    required: true,
    maxlength: 2000
  },
  courseSummary: {
    type: String,
    required: true,
    maxlength: 1000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    enum: ['online', 'offline', 'hybrid'],
    required: true
  },
  courseImage: {
    public_id: {
      type: String,
      required: false // ✅ Changed to false
    },
    url: {
      type: String,
      required: true
    }
  },
  coursePreviewVideo: {
    public_id: {
      type: String,
      required: false // ✅ Changed to false
    },
    url: {
      type: String,
      required: true
    }
  },
  courseBook: {
    public_id: {
      type: String,
      required: false // ✅ Changed to false
    },
    url: {
      type: String,
      required: false
    }
  },
  projectPDF: {
    public_id: {
      type: String,
      required: false // ✅ Changed to false
    },
    url: {
      type: String,
      required: false
    }
  },
  mcqTest: mcqTestSchema,
  testAttempts: [studentTestAttemptSchema],
  experiences: [experienceSchema],
  certificate: {
    template: {
      public_id: {
        type: String,
        required: false // ✅ Changed to false
      },
      url: {
        type: String,
        required: false
      }
    },
    requirements: {
      completionPercentage: {
        type: Number,
        default: 100
      },
      minTestScore: {
        type: Number,
        default: 70
      }
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    enum: ['Programming', 'Design', 'Marketing', 'Business', 'Creative', 'Technology', 'Health', 'Language'],
    required: true
  },
  tags: [String],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  language: {
    type: String,
    default: 'English'
  },
  totalStudents: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  totalLessons: {
    type: Number,
    default: 0
  },
  totalDuration: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculate average rating
  if (this.experiences && this.experiences.length > 0) {
    const total = this.experiences.reduce((sum, exp) => sum + exp.rating, 0);
    this.averageRating = parseFloat((total / this.experiences.length).toFixed(1));
    this.totalRatings = this.experiences.length;
  }
  
  next();
});

// Virtual for lessons
courseSchema.virtual('lessons', {
  ref: 'Lesson',
  localField: '_id',
  foreignField: 'course'
});

// Virtual for enrollments
courseSchema.virtual('enrollments', {
  ref: 'Enrollment',
  localField: '_id',
  foreignField: 'course'
});

// Update total students count
courseSchema.methods.updateTotalStudents = async function() {
  const Enrollment = mongoose.model('Enrollment');
  this.totalStudents = await Enrollment.countDocuments({ course: this._id });
};

// Update total lessons count
courseSchema.methods.updateTotalLessons = async function() {
  const Lesson = mongoose.model('Lesson');
  this.totalLessons = await Lesson.countDocuments({ course: this._id, isActive: true });
};

// Enable virtuals in JSON output
courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);


