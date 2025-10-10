const Progress = require('../models/Progress');
const Course = require('../models/Course');

// @desc    Get user progress for a course
// @route   GET /api/progress/:courseId
// @access  Private
const getProgress = async (req, res) => {
  try {
    const progress = await Progress.getUserProgress(req.user._id, req.params.courseId);

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress not found'
      });
    }

    res.json({
      success: true,
      data: progress
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching progress',
      error: error.message
    });
  }
};

// @desc    Mark lesson as completed
// @route   POST /api/progress/:courseId/complete-lesson
// @access  Private
const completeLesson = async (req, res) => {
  try {
    const { lessonId, watchTime = 0 } = req.body;

    let progress = await Progress.findOne({
      user: req.user._id,
      course: req.params.courseId
    });

    if (!progress) {
      // Create new progress record
      progress = new Progress({
        user: req.user._id,
        course: req.params.courseId
      });
    }

    await progress.markLessonCompleted(lessonId, watchTime);

    res.json({
      success: true,
      message: 'Lesson marked as completed',
      data: progress
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating progress',
      error: error.message
    });
  }
};

// @desc    Get all user courses with progress
// @route   GET /api/progress
// @access  Private
const getUserCourses = async (req, res) => {
  try {
    const progressRecords = await Progress.getUserCourses(req.user._id);

    res.json({
      success: true,
      count: progressRecords.length,
      data: progressRecords
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user courses',
      error: error.message
    });
  }
};

// @desc    Get course progress statistics (for instructors)
// @route   GET /api/progress/stats/:courseId
// @access  Private/Instructor
const getCourseProgressStats = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is the course creator
    if (course.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these statistics'
      });
    }

    const stats = await Progress.getCourseProgressStats(req.params.courseId);

    res.json({
      success: true,
      data: stats[0] || {}
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching progress statistics',
      error: error.message
    });
  }
};

module.exports = {
  getProgress,
  completeLesson,
  getUserCourses,
  getCourseProgressStats
};