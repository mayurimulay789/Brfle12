const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  lessonTitle: {
    type: String,
    required: true,
    trim: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  video: {
    public_id: {
      type: String,
      required: false // ✅ Changed to false
    },
    url: {
      type: String,
      required: true
    }
  },
  duration: {
    type: String,
    required: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  order: {
    type: Number,
    required: true
  },
  isPreview: {
    type: Boolean,
    default: false
  },
  resources: [{
    title: String,
    file: {
      public_id: {
        type: String,
        required: false // ✅ Changed to false
      },
      url: String
    },
    type: {
      type: String,
      enum: ['pdf', 'document', 'image', 'link']
    }
  }],
  isActive: {
    type: Boolean,
    default: true
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
lessonSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for course and order (to maintain lesson sequence)
lessonSchema.index({ course: 1, order: 1 });

// Virtual for total students who completed this lesson
lessonSchema.virtual('completedCount', {
  ref: 'Enrollment',
  localField: '_id',
  foreignField: 'completedLessons.lesson',
  count: true
});

module.exports = mongoose.model('Lesson', lessonSchema);