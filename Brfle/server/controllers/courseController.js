const Course = require("../model/Course");
const User = require("../model/User");

// ==================== GET ALL COURSES ====================
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true, status: "published" })
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GET SINGLE COURSE ====================
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("createdBy", "username email")
      .populate("reviews.user", "username email");

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    await course.incrementViews();

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== CREATE COURSE ====================
exports.createCourse = async (req, res) => {
  try {
    const course = new Course({
      ...req.body,
      createdBy: req.user._id,
    });
    await course.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== UPDATE COURSE ====================
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    Object.assign(course, req.body);
    await course.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== DELETE COURSE ====================
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ADD REVIEW ====================
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const existingReview = course.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res
        .status(400)
        .json({ success: false, message: "You have already reviewed this course" });
    }

    const reviewData = {
      user: req.user._id,
      rating: Number(rating),
      comment,
      isVerifiedPurchase: true,
    };

    await course.addReview(reviewData);
    await course.save();

    res.status(200).json({
      success: true,
      message: "Review added successfully",
      data: course.reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ENROLL COURSE ====================
exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    await course.incrementEnrollment();

    res.status(200).json({
      success: true,
      message: "Enrolled successfully",
      data: { enrollmentCount: course.enrollmentCount },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GET COURSES BY CATEGORY ====================
exports.getCoursesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const courses = await Course.findByCategory(category);

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GET FEATURED COURSES ====================
exports.getFeaturedCourses = async (req, res) => {
  try {
    const courses = await Course.getFeaturedCourses(10);
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GET POPULAR COURSES ====================
exports.getPopularCourses = async (req, res) => {
  try {
    const courses = await Course.getPopularCourses(10);
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== SEARCH COURSES ====================
exports.searchCourses = async (req, res) => {
  try {
    const { query, category, level, minPrice, maxPrice, minRating } = req.query;
    const filters = { category, level, minPrice, maxPrice, minRating };
    const courses = await Course.searchCourses(query, filters);

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GET COURSE STATS ====================
exports.getCourseStats = async (req, res) => {
  try {
    const stats = await Course.getCourseStats();
    res.status(200).json({ success: true, data: stats[0] || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
