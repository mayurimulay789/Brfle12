// const mongoose = require("mongoose");

// const lessonSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//     },
//     description: String,
//     videoUrl: String,
//     videoPublicId: String,
//     thumbnailUrl: String,
//     duration: {
//       type: Number,
//       default: 0,
//     },
//     order: {
//       type: Number,
//       required: true,
//     },
//     isPreview: {
//       type: Boolean,
//       default: false,
//     },
//     resources: [
//       {
//         title: String,
//         url: String,
//         publicId: String,
//         type: {
//           type: String,
//           enum: ["pdf", "video", "link", "document", "image"],
//         },
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

// const reviewSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     rating: {
//       type: Number,
//       required: true,
//       min: 1,
//       max: 5,
//     },
//     comment: {
//       type: String,
//       required: true,
//       maxlength: 1000,
//     },
//     isVerifiedPurchase: {
//       type: Boolean,
//       default: false,
//     },
//     helpful: {
//       count: { type: Number, default: 0 },
//       users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
//     },
//     status: {
//       type: String,
//       enum: ["pending", "approved", "rejected"],
//       default: "approved"
//     }
//   },
//   {
//     timestamps: true,
//   }
// );

// const courseSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//       maxlength: 200,
//     },
//     description: {
//       type: String,
//       required: true,
//       maxlength: 2000,
//     },
//     shortDescription: {
//       type: String,
//       maxlength: 500,
//     },
//     category: {
//       type: String,
//       required: true,
//       enum: ["Programming", "Design", "Marketing", "Business", "Creative", "Technology", "Health", "Language"],
//     },
//     subcategory: String,
//     level: {
//       type: String,
//       required: true,
//       enum: ["Beginner", "Intermediate", "Advanced"],
//     },
//     price: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//     originalPrice: {
//       type: Number,
//       min: 0,
//     },
//     currency: {
//       type: String,
//       default: "INR",
//     },
//     thumbnail: {
//       type: String,
//       default: "https://via.placeholder.com/400x225?text=Course+Thumbnail",
//     },
//     thumbnailPublicId: String,
//     previewVideo: String,
//     previewVideoPublicId: String,
//     images: [
//       {
//         url: String,
//         publicId: String,
//       },
//     ],
//     duration: {
//       type: Number,
//       default: 0,
//     },
//     lessons: [lessonSchema],
//     totalLessons: {
//       type: Number,
//       default: 0,
//     },
//     requirements: [String],
//     whatYouWillLearn: [String],
//     targetAudience: [String],
//     tags: [String],
//     language: {
//       type: String,
//       default: "English",
//     },
//     subtitles: [String],
//     rating: {
//       type: Number,
//       default: 0,
//       min: 0,
//       max: 5,
//     },
//     reviewCount: {
//       type: Number,
//       default: 0,
//     },
//     reviews: [reviewSchema],
//     enrollmentCount: {
//       type: Number,
//       default: 0,
//     },
//     isPublished: {
//       type: Boolean,
//       default: true,
//     },
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//     },
//     isPopular: {
//       type: Boolean,
//       default: false,
//     },
//     isFeatured: {
//       type: Boolean,
//       default: false,
//     },
//     publishedAt: Date,
//     lastUpdated: {
//       type: Date,
//       default: Date.now,
//     },
//     status: {
//       type: String,
//       enum: ["draft", "review", "published", "archived"],
//       default: "published",
//     },
//     difficulty: {
//       type: String,
//       enum: ["Easy", "Medium", "Hard"],
//       default: "Medium",
//     },
//     certificate: {
//       available: {
//         type: Boolean,
//         default: true,
//       },
//       passingScore: {
//         type: Number,
//         default: 70,
//       },
//     },
//     seo: {
//       metaTitle: String,
//       metaDescription: String,
//       keywords: [String],
//     },
//     slug: {
//       type: String,
//       // REMOVED: sparse: true to avoid auto-index
//     },
//     analytics: {
//       views: {
//         type: Number,
//         default: 0,
//       },
//       completionRate: {
//         type: Number,
//         default: 0,
//       },
//       averageWatchTime: {
//         type: Number,
//         default: 0,
//       },
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // ==================== VIRTUALS ====================
// courseSchema.virtual('discountPercentage').get(function() {
//   if (this.originalPrice && this.originalPrice > this.price) {
//     return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
//   }
//   return 0;
// });

// courseSchema.virtual('formattedPrice').get(function() {
//   return new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: this.currency || 'INR'
//   }).format(this.price);
// });

// courseSchema.virtual('totalDurationHours').get(function() {
//   return (this.duration / 60).toFixed(1);
// });

// courseSchema.virtual('isOnSale').get(function() {
//   return this.originalPrice && this.originalPrice > this.price;
// });

// // Enable virtuals in JSON output
// courseSchema.set('toJSON', { virtuals: true });
// courseSchema.set('toObject', { virtuals: true });

// // ==================== VALIDATION ====================
// courseSchema.path('lessons').validate(function(lessons) {
//   const orders = lessons.map(lesson => lesson.order);
//   return new Set(orders).size === orders.length;
// }, 'Lesson orders must be unique');

// courseSchema.path('price').validate(function(price) {
//   if (this.originalPrice) {
//     return price <= this.originalPrice;
//   }
//   return true;
// }, 'Sale price cannot be higher than original price');

// // ==================== MIDDLEWARE ====================
// courseSchema.pre('save', function(next) {
//   // Calculate total duration from lessons
//   if (this.lessons && this.lessons.length > 0) {
//     this.duration = this.lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0);
//   }
  
//   // Calculate total lessons
//   this.totalLessons = this.lessons ? this.lessons.length : 0;
  
//   // Update lastUpdated timestamp
//   this.lastUpdated = new Date();
  
//   // Auto-generate slug if not provided
//   if (!this.slug && this.title) {
//     this.slug = this.title
//       .toLowerCase()
//       .replace(/[^a-z0-9 -]/g, '')
//       .replace(/\s+/g, '-')
//       .replace(/-+/g, '-')
//       .substring(0, 100);
//   }
  
//   // Set publishedAt if being published
//   if (this.isPublished && this.status === 'published' && !this.publishedAt) {
//     this.publishedAt = new Date();
//   }
  
//   next();
// });

// // ==================== INSTANCE METHODS ====================
// courseSchema.methods.addLesson = function(lessonData) {
//   // Auto-calculate order if not provided
//   if (!lessonData.order) {
//     lessonData.order = this.lessons.length > 0 ? 
//       Math.max(...this.lessons.map(l => l.order)) + 1 : 1;
//   }
  
//   this.lessons.push(lessonData);
//   return this.save();
// };

// courseSchema.methods.updateLesson = function(lessonId, updateData) {
//   const lesson = this.lessons.id(lessonId);
//   if (lesson) {
//     Object.assign(lesson, updateData);
//     return this.save();
//   }
//   throw new Error('Lesson not found');
// };

// courseSchema.methods.removeLesson = function(lessonId) {
//   this.lessons.pull(lessonId);
//   return this.save();
// };

// courseSchema.methods.addReview = function(reviewData) {
//   this.reviews.push(reviewData);
  
//   // Recalculate average rating
//   this.calculateRating();
  
//   return this.save();
// };

// courseSchema.methods.calculateRating = function() {
//   if (this.reviews.length > 0) {
//     const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
//     this.rating = parseFloat((totalRating / this.reviews.length).toFixed(1));
//     this.reviewCount = this.reviews.length;
//   } else {
//     this.rating = 0;
//     this.reviewCount = 0;
//   }
// };

// courseSchema.methods.incrementEnrollment = function() {
//   this.enrollmentCount += 1;
//   return this.save();
// };

// courseSchema.methods.incrementViews = function() {
//   this.analytics.views += 1;
//   return this.save();
// };

// courseSchema.methods.markAsPopular = function() {
//   this.isPopular = true;
//   return this.save();
// };

// courseSchema.methods.markAsFeatured = function() {
//   this.isFeatured = true;
//   return this.save();
// };

// // ==================== STATIC METHODS ====================
// courseSchema.statics.findByCategory = function(category) {
//   return this.find({ category, isPublished: true, status: 'published' })
//     .sort({ createdAt: -1 });
// };

// courseSchema.statics.getPopularCourses = function(limit = 10) {
//   return this.find({ isPublished: true, status: 'published' })
//     .sort({ enrollmentCount: -1, rating: -1 })
//     .limit(limit);
// };

// courseSchema.statics.getFeaturedCourses = function(limit = 10) {
//   return this.find({ isFeatured: true, isPublished: true, status: 'published' })
//     .sort({ createdAt: -1 })
//     .limit(limit);
// };

// courseSchema.statics.findByInstructor = function(instructorId) {
//   return this.find({ createdBy: instructorId })
//     .sort({ createdAt: -1 });
// };

// courseSchema.statics.searchCourses = function(query, filters = {}) {
//   const searchQuery = {
//     isPublished: true,
//     status: 'published',
//     $text: { $search: query }
//   };
  
//   // Apply filters
//   if (filters.category) searchQuery.category = filters.category;
//   if (filters.level) searchQuery.level = filters.level;
//   if (filters.minPrice || filters.maxPrice) {
//     searchQuery.price = {};
//     if (filters.minPrice) searchQuery.price.$gte = parseFloat(filters.minPrice);
//     if (filters.maxPrice) searchQuery.price.$lte = parseFloat(filters.maxPrice);
//   }
//   if (filters.minRating) searchQuery.rating = { $gte: parseFloat(filters.minRating) };
  
//   return this.find(searchQuery)
//     .sort({ score: { $meta: "textScore" } })
//     .select({ score: { $meta: "textScore" } });
// };

// courseSchema.statics.getCourseStats = function() {
//   return this.aggregate([
//     {
//       $match: { isPublished: true, status: 'published' }
//     },
//     {
//       $group: {
//         _id: null,
//         totalCourses: { $sum: 1 },
//         totalEnrollments: { $sum: "$enrollmentCount" },
//         averageRating: { $avg: "$rating" },
//         averagePrice: { $avg: "$price" },
//         totalDuration: { $sum: "$duration" }
//       }
//     }
//   ]);
// };

// // ==================== QUERY HELPERS ====================
// courseSchema.query.published = function() {
//   return this.where({ isPublished: true, status: 'published' });
// };

// courseSchema.query.byInstructor = function(instructorId) {
//   return this.where({ createdBy: instructorId });
// };

// courseSchema.query.withMinRating = function(minRating) {
//   return this.where({ rating: { $gte: minRating } });
// };

// courseSchema.query.inPriceRange = function(min, max) {
//   return this.where({ price: { $gte: min, $lte: max } });
// };

// courseSchema.query.byCategory = function(category) {
//   return this.where({ category });
// };

// courseSchema.query.byLevel = function(level) {
//   return this.where({ level });
// };

// courseSchema.query.featured = function() {
//   return this.where({ isFeatured: true });
// };

// courseSchema.query.popular = function() {
//   return this.where({ isPopular: true });
// };

// // ==================== INDEXES ====================
// // FIXED: Removed duplicate slug index by keeping only the explicit one
// courseSchema.index({ slug: 1 }, { unique: true, sparse: true });

// courseSchema.index({ category: 1, level: 1 });
// courseSchema.index({ price: 1 });
// courseSchema.index({ rating: -1 });
// courseSchema.index({ enrollmentCount: -1 });
// courseSchema.index({ isPublished: 1, status: 1 });
// courseSchema.index({ tags: 1 });
// courseSchema.index({ createdAt: -1 });
// courseSchema.index({ createdBy: 1, isPublished: 1 });
// courseSchema.index({ category: 1, subcategory: 1, isPublished: 1 });
// courseSchema.index({ "lessons.order": 1 });

// // Text search index
// courseSchema.index({
//   title: "text",
//   description: "text",
//   tags: "text",
//   "whatYouWillLearn": "text"
// });

// module.exports = mongoose.model("Course", courseSchema);

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