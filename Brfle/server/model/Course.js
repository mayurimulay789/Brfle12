const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    // 1️⃣ Course Name
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    // 2️⃣ Benefit of Course
    benefit: {
      type: String,
      required: true,
      maxlength: 1000,
    },

    // 3️⃣ Guide By
    guideBy: {
      type: String,
      required: true,
      trim: true,
    },

    // 4️⃣ Introduction
    introduction: {
      type: String,
      required: true,
      maxlength: 5000,
    },

    // 5️⃣ Price
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // 6️⃣ Duration
    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    // 7️⃣ Mode
    mode: {
      type: String,
      enum: ["Online", "Offline", "Hybrid"],
      required: true,
    },

    // 8️⃣ Image
    image: {
      type: String,
      required: true,
    },

    // Optional fields for user and status
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["draft", "review", "published", "archived"],
      default: "published",
    },
  },
  {
    timestamps: true,
  }
);

courseSchema.virtual("formattedPrice").get(function () {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(this.price);
});

courseSchema.set("toJSON", { virtuals: true });
courseSchema.set("toObject", { virtuals: true });

courseSchema.pre("save", function (next) {
  this.lastUpdated = new Date();
  if (this.isPublished && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Example static methods
courseSchema.statics.getPopularCourses = function (limit = 10) {
  return this.find({ isPublished: true, status: "published" })
    .sort({ createdAt: -1 })
    .limit(limit);
};

courseSchema.statics.getCourseStats = function () {
  return this.aggregate([
    {
      $match: { isPublished: true, status: "published" },
    },
    {
      $group: {
        _id: null,
        totalCourses: { $sum: 1 },
        averagePrice: { $avg: "$price" },
      },
    },
  ]);
};

module.exports = mongoose.model("Course", courseSchema);
