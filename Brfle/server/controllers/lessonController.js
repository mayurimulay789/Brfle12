
const Enrollment = require('../model/Enrollment');
const Course = require('../model/Course');
const Lesson = require('../model/Lesson');
const { deleteFromCloudinary } = require('../utils/cloudinary');

// @desc    Create new lesson
// @route   POST /api/lessons
// @access  Admin
exports.createLesson = async (req, res) => {
  try {
    const {
      lessonTitle,
      courseId,
      duration,
      description,
      order,
      isPreview = false
    } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if video was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Lesson video is required'
      });
    }

    // Check if order already exists for this course
    const existingLesson = await Lesson.findOne({
      course: courseId,
      order: parseInt(order)
    });

    if (existingLesson) {
      return res.status(400).json({
        success: false,
        message: 'A lesson with this order already exists for this course'
      });
    }

    const lesson = new Lesson({
      lessonTitle,
      course: courseId,
      video: {
        public_id: req.file.public_id,
        url: req.file.path
      },
      duration,
      description,
      order: parseInt(order),
      isPreview: isPreview === 'true'
    });

    await lesson.save();

    // Update course total lessons count
    await course.updateTotalLessons();
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      lesson
    });
  } catch (error) {
    // Delete uploaded video if lesson creation fails
    if (req.file) {
      await deleteFromCloudinary(req.file.public_id, 'video');
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating lesson',
      error: error.message
    });
  }
};

// @desc    Get lessons for a course
// @route   GET /api/lessons/course/:courseId
// @access  Public
exports.getCourseLessons = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const lessons = await Lesson.find({ 
      course: courseId, 
      isActive: true 
    }).sort({ order: 1 });

    res.json({
      success: true,
      count: lessons.length,
      lessons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching lessons',
      error: error.message
    });
  }
};

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Admin
exports.updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    const updates = { ...req.body };
    
    // Handle video update
    if (req.file) {
      // Delete old video
      if (lesson.video.public_id) {
        await deleteFromCloudinary(lesson.video.public_id, 'video');
      }
      
      updates.video = {
        public_id: req.file.public_id,
        url: req.file.path
      };
    }

    // Parse order if it exists
    if (updates.order) {
      updates.order = parseInt(updates.order);
      
      // Check if order conflicts with other lessons
      const existingLesson = await Lesson.findOne({
        course: lesson.course,
        order: updates.order,
        _id: { $ne: lesson._id }
      });

      if (existingLesson) {
        return res.status(400).json({
          success: false,
          message: 'A lesson with this order already exists for this course'
        });
      }
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('course', 'courseTitle');

    res.json({
      success: true,
      message: 'Lesson updated successfully',
      lesson: updatedLesson
    });
  } catch (error) {
    // Delete uploaded video if update fails
    if (req.file) {
      await deleteFromCloudinary(req.file.public_id, 'video');
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating lesson',
      error: error.message
    });
  }
};

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Admin
exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Delete video from Cloudinary
    if (lesson.video.public_id) {
      await deleteFromCloudinary(lesson.video.public_id, 'video');
    }

    // Delete lesson resources
    if (lesson.resources && lesson.resources.length > 0) {
      for (let resource of lesson.resources) {
        if (resource.file.public_id) {
          await deleteFromCloudinary(resource.file.public_id, 'raw');
        }
      }
    }

    // Remove this lesson from all enrollments' completed lessons
    await Enrollment.updateMany(
      { 'completedLessons.lesson': lesson._id },
      { $pull: { completedLessons: { lesson: lesson._id } } }
    );

    // Update progress for all affected enrollments
    const course = await Course.findById(lesson.course);
    const enrollments = await Enrollment.find({ course: lesson.course });
    
    for (let enrollment of enrollments) {
      enrollment.calculateProgress(await Lesson.countDocuments({ 
        course: lesson.course, 
        isActive: true 
      }));
      await enrollment.save();
    }

    // Delete the lesson
    await Lesson.findByIdAndDelete(req.params.id);

    // Update course total lessons count
    if (course) {
      await course.updateTotalLessons();
      await course.save();
    }

    res.json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting lesson',
      error: error.message
    });
  }
};

// @desc    Update lesson status
// @route   PUT /api/lessons/:id/status
// @access  Admin
exports.updateLessonStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).populate('course', 'courseTitle');

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Update course total lessons count
    const course = await Course.findById(lesson.course);
    if (course) {
      await course.updateTotalLessons();
      await course.save();
    }

    res.json({
      success: true,
      message: `Lesson ${isActive ? 'activated' : 'deactivated'} successfully`,
      lesson
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating lesson status',
      error: error.message
    });
  }
};

// @desc    Add lesson resource
// @route   POST /api/lessons/:id/resources
// @access  Admin
exports.addLessonResource = async (req, res) => {
  try {
    const { title, type } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Resource file is required'
      });
    }

    const lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    const resource = {
      title,
      type: type || 'document',
      file: {
        public_id: req.file.public_id,
        url: req.file.path
      }
    };

    lesson.resources.push(resource);
    await lesson.save();

    res.status(201).json({
      success: true,
      message: 'Resource added successfully',
      resource: lesson.resources[lesson.resources.length - 1]
    });
  } catch (error) {
    if (req.file) {
      await deleteFromCloudinary(req.file.public_id, 'raw');
    }
    
    res.status(500).json({
      success: false,
      message: 'Error adding resource',
      error: error.message
    });
  }
};

// @desc    Delete lesson resource
// @route   DELETE /api/lessons/:id/resources/:resourceId
// @access  Admin
exports.deleteLessonResource = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    const resource = lesson.resources.id(req.params.resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Delete file from Cloudinary
    if (resource.file.public_id) {
      await deleteFromCloudinary(resource.file.public_id, 'raw');
    }

    // Remove resource from array
    lesson.resources.pull({ _id: req.params.resourceId });
    await lesson.save();

    res.json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting resource',
      error: error.message
    });
  }
};

// @desc    Mark lesson as completed
// @route   POST /api/lessons/:id/complete
// @access  Private
exports.markLessonCompleted = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: lesson.course
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You are not enrolled in this course'
      });
    }

    // Mark lesson as completed
    enrollment.markLessonCompleted(lesson._id);
    
    // Calculate progress
    const totalLessons = await Lesson.countDocuments({ 
      course: lesson.course, 
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
      totalLessons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking lesson as completed',
      error: error.message
    });
  }
};

// @desc    Get lesson progress for current user
// @route   GET /api/lessons/:id/progress
// @access  Private
exports.getLessonProgress = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Check if user is enrolled
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: lesson.course
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You are not enrolled in this course'
      });
    }

    const isCompleted = enrollment.completedLessons.some(
      completedLesson => completedLesson.lesson.toString() === lesson._id.toString()
    );

    res.json({
      success: true,
      isCompleted,
      lesson: {
        _id: lesson._id,
        lessonTitle: lesson.lessonTitle,
        order: lesson.order,
        duration: lesson.duration
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching lesson progress',
      error: error.message
    });
  }
};