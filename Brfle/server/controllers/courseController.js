const Course = require('../model/Course');
const Lesson = require('../model/Lesson');
const Enrollment = require('../model/Enrollment');
const { deleteFromCloudinary } = require('../utils/cloudinary');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getAllCourses = async (req, res) => {
  try {
    const {
      category,
      difficulty,
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    
    if (search) {
      filter.$or = [
        { courseTitle: { $regex: search, $options: 'i' } },
        { courseSummary: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Sort options
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (page - 1) * limit;

    const courses = await Course.find(filter)
      .populate('createdBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-mcqTest -testAttempts'); // Exclude large fields

    const total = await Course.countDocuments(filter);

    res.json({
      success: true,
      count: courses.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message
    });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('createdBy', 'name email profilePicture')
      .populate('experiences.student', 'name profilePicture');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Get lessons for this course
    const lessons = await Lesson.find({ 
      course: req.params.id, 
      isActive: true 
    }).sort({ order: 1 });

    // Get enrollment count
    const enrollmentCount = await Enrollment.countDocuments({ 
      course: req.params.id 
    });

    res.json({
      success: true,
      course: {
        ...course.toObject(),
        lessons,
        enrollmentCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching course',
      error: error.message
    });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Admin
const createCourse = async (req, res) => {
  try {
    console.log("Creating course with files:", req.files);
    console.log("Creating course with body:", req.body);

    // Check if file upload was successful
    if (!req.files) {
      return res.status(400).json({
        success: false,
        message: 'No files were uploaded'
      });
    }

    // Check if course image was uploaded
    if (!req.files.courseImage || !req.files.courseImage[0]) {
      return res.status(400).json({
        success: false,
        message: 'Course image is required'
      });
    }

    const {
      courseTitle,
      courseGuide,
      courseBenifits,
      courseSummary,
      price,
      duration,
      mode,
      category,
      tags,
      difficulty,
      language
    } = req.body;

    // Validate required fields
    if (!courseTitle || !courseSummary || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Course title, summary, price, and category are required'
      });
    }

    // ✅ FIXED: Extract or generate public_id function
    const extractPublicId = (file) => {
      if (file.public_id) return file.public_id;
      if (file.filename) return file.filename;
      
      // Generate from URL or create unique ID
      if (file.path) {
        const urlParts = file.path.split('/');
        const lastPart = urlParts[urlParts.length - 1];
        return lastPart.split('.')[0];
      }
      
      return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    // Build course data
    const courseData = {
      courseTitle,
      courseGuide,
      courseBenifits,
      courseSummary,
      price: parseFloat(price),
      duration,
      mode,
      category,
      tags: tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : [],
      difficulty,
      language,
      courseImage: {
        public_id: extractPublicId(req.files.courseImage[0]),
        url: req.files.courseImage[0].path
      },
      createdBy: req.user.id
    };

    // Add optional files if uploaded
    if (req.files.previewVideo && req.files.previewVideo[0]) {
      courseData.coursePreviewVideo = {
        public_id: extractPublicId(req.files.previewVideo[0]),
        url: req.files.previewVideo[0].path
      };
    }

    if (req.files.courseBook && req.files.courseBook[0]) {
      courseData.courseBook = {
        public_id: extractPublicId(req.files.courseBook[0]),
        url: req.files.courseBook[0].path
      };
    }

    if (req.files.projectPDF && req.files.projectPDF[0]) {
      courseData.projectPDF = {
        public_id: extractPublicId(req.files.projectPDF[0]),
        url: req.files.projectPDF[0].path
      };
    }

    console.log("Final course data:", courseData);

    const course = new Course(courseData);
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error("Error creating course:", error);
    
    // Delete uploaded files if course creation fails
    if (req.files) {
      try {
        for (const fieldName in req.files) {
          const files = req.files[fieldName];
          for (const file of files) {
            if (file.public_id) {
              let resourceType = 'image';
              if (file.mimetype.startsWith('video/')) resourceType = 'video';
              if (file.mimetype.includes('pdf')) resourceType = 'raw';
              
              await deleteFromCloudinary(file.public_id, resourceType);
            }
          }
        }
      } catch (deleteError) {
        console.error("Error deleting uploaded files:", deleteError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating course',
      error: error.message
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Admin
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const updates = { ...req.body };
    
    // Handle file updates
    if (req.files) {
      // Update course image if provided
      if (req.files.courseImage && req.files.courseImage[0]) {
        // Delete old image
        if (course.courseImage.public_id) {
          await deleteFromCloudinary(course.courseImage.public_id);
        }
        
        updates.courseImage = {
          public_id: req.files.courseImage[0].public_id,
          url: req.files.courseImage[0].path
        };
      }

      // Update preview video if provided
      if (req.files.previewVideo && req.files.previewVideo[0]) {
        if (course.coursePreviewVideo.public_id) {
          await deleteFromCloudinary(course.coursePreviewVideo.public_id, 'video');
        }
        
        updates.coursePreviewVideo = {
          public_id: req.files.previewVideo[0].public_id,
          url: req.files.previewVideo[0].path
        };
      }

      // Update course book if provided
      if (req.files.courseBook && req.files.courseBook[0]) {
        if (course.courseBook.public_id) {
          await deleteFromCloudinary(course.courseBook.public_id, 'raw');
        }
        
        updates.courseBook = {
          public_id: req.files.courseBook[0].public_id,
          url: req.files.courseBook[0].path
        };
      }

      // Update project PDF if provided
      if (req.files.projectPDF && req.files.projectPDF[0]) {
        if (course.projectPDF.public_id) {
          await deleteFromCloudinary(course.projectPDF.public_id, 'raw');
        }
        
        updates.projectPDF = {
          public_id: req.files.projectPDF[0].public_id,
          url: req.files.projectPDF[0].path
        };
      }
    }

    // Parse tags if they exist
    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = JSON.parse(updates.tags);
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.json({
      success: true,
      message: 'Course updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    // Delete uploaded files if update fails
    if (req.files) {
      for (const fieldName in req.files) {
        const files = req.files[fieldName];
        for (const file of files) {
          if (file.public_id) {
            let resourceType = 'image';
            if (file.mimetype.startsWith('video/')) resourceType = 'video';
            if (file.mimetype.includes('pdf')) resourceType = 'raw';
            
            await deleteFromCloudinary(file.public_id, resourceType);
          }
        }
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating course',
      error: error.message
    });
  }
};

// @desc    Upload preview video
// @route   POST /api/courses/:id/preview-video
// @access  Admin
const uploadPreviewVideo = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Preview video is required'
      });
    }

    // Delete old preview video if exists
    if (course.coursePreviewVideo.public_id) {
      await deleteFromCloudinary(course.coursePreviewVideo.public_id, 'video');
    }

    course.coursePreviewVideo = {
      public_id: req.file.public_id,
      url: req.file.path
    };

    await course.save();

    res.json({
      success: true,
      message: 'Preview video uploaded successfully',
      previewVideo: course.coursePreviewVideo
    });
  } catch (error) {
    if (req.file) {
      await deleteFromCloudinary(req.file.public_id, 'video');
    }
    
    res.status(500).json({
      success: false,
      message: 'Error uploading preview video',
      error: error.message
    });
  }
};

// @desc    Upload course book
// @route   POST /api/courses/:id/course-book
// @access  Admin
const uploadCourseBook = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Course book file is required'
      });
    }

    // Delete old course book if exists
    if (course.courseBook.public_id) {
      await deleteFromCloudinary(course.courseBook.public_id, 'raw');
    }

    course.courseBook = {
      public_id: req.file.public_id,
      url: req.file.path
    };

    await course.save();

    res.json({
      success: true,
      message: 'Course book uploaded successfully',
      courseBook: course.courseBook
    });
  } catch (error) {
    if (req.file) {
      await deleteFromCloudinary(req.file.public_id, 'raw');
    }
    
    res.status(500).json({
      success: false,
      message: 'Error uploading course book',
      error: error.message
    });
  }
};

// @desc    Upload project PDF
// @route   POST /api/courses/:id/project-pdf
// @access  Admin
const uploadProjectPDF = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Project PDF file is required'
      });
    }

    // Delete old project PDF if exists
    if (course.projectPDF.public_id) {
      await deleteFromCloudinary(course.projectPDF.public_id, 'raw');
    }

    course.projectPDF = {
      public_id: req.file.public_id,
      url: req.file.path
    };

    await course.save();

    res.json({
      success: true,
      message: 'Project PDF uploaded successfully',
      projectPDF: course.projectPDF
    });
  } catch (error) {
    if (req.file) {
      await deleteFromCloudinary(req.file.public_id, 'raw');
    }
    
    res.status(500).json({
      success: false,
      message: 'Error uploading project PDF',
      error: error.message
    });
  }
};

// @desc    Upload certificate template
// @route   POST /api/courses/:id/certificate-template
// @access  Admin
const uploadCertificateTemplate = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Certificate template is required'
      });
    }

    // Delete old certificate template if exists
    if (course.certificate?.template?.public_id) {
      await deleteFromCloudinary(course.certificate.template.public_id);
    }

    course.certificate = {
      ...course.certificate,
      template: {
        public_id: req.file.public_id,
        url: req.file.path
      }
    };

    await course.save();

    res.json({
      success: true,
      message: 'Certificate template uploaded successfully',
      certificate: course.certificate
    });
  } catch (error) {
    if (req.file) {
      await deleteFromCloudinary(req.file.public_id);
    }
    
    res.status(500).json({
      success: false,
      message: 'Error uploading certificate template',
      error: error.message
    });
  }
};

// @desc    Create MCQ test
// @route   POST /api/courses/:id/mcq-test
// @access  Admin
const createMCQTest = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const { title, questions, passingScore, timeLimit, maxAttempts } = req.body;

    // Validate questions
    if (!questions || questions.length !== 20) {
      return res.status(400).json({
        success: false,
        message: 'MCQ test must have exactly 20 questions'
      });
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.question || !question.options || question.options.length !== 4) {
        return res.status(400).json({
          success: false,
          message: `Question ${i + 1} must have a question and exactly 4 options`
        });
      }
      if (question.correctAnswer === undefined || question.correctAnswer < 0 || question.correctAnswer > 3) {
        return res.status(400).json({
          success: false,
          message: `Question ${i + 1} must have a valid correct answer (0-3)`
        });
      }
    }

    course.mcqTest = {
      title: title || "Course Assessment Test",
      questions,
      passingScore: passingScore || 70,
      timeLimit: timeLimit || 30,
      maxAttempts: maxAttempts || 3
    };

    await course.save();

    // ✅ IMPORTANT: Populate the course to get full data
    const updatedCourse = await Course.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('experiences.student', 'name profilePicture');

    res.status(201).json({
      success: true,
      message: 'MCQ test created successfully',
      course: updatedCourse // ✅ Return full course object
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating MCQ test',
      error: error.message
    });
  }
};


// @desc    Update MCQ test
// @route   PUT /api/courses/:id/mcq-test
// @access  Admin
const updateMCQTest = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (!course.mcqTest) {
      return res.status(404).json({
        success: false,
        message: 'MCQ test not found for this course'
      });
    }

    const { title, questions, passingScore, timeLimit, maxAttempts } = req.body;

    // Update only provided fields
    if (title) course.mcqTest.title = title;
    if (questions) {
      // Validate questions if provided
      if (questions.length !== 20) {
        return res.status(400).json({
          success: false,
          message: 'MCQ test must have exactly 20 questions'
        });
      }
      course.mcqTest.questions = questions;
    }
    if (passingScore) course.mcqTest.passingScore = passingScore;
    if (timeLimit) course.mcqTest.timeLimit = timeLimit;
    if (maxAttempts) course.mcqTest.maxAttempts = maxAttempts;

    await course.save();

    // ✅ IMPORTANT: Populate the course to get full data
    const updatedCourse = await Course.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('experiences.student', 'name profilePicture');

    res.json({
      success: true,
      message: 'MCQ test updated successfully',
      course: updatedCourse // ✅ Return full course object
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating MCQ test',
      error: error.message
    });
  }
};

// @desc    Delete MCQ test
// @route   DELETE /api/courses/:id/mcq-test
// @access  Admin
const deleteMCQTest = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (!course.mcqTest) {
      return res.status(404).json({
        success: false,
        message: 'MCQ test not found for this course'
      });
    }

    course.mcqTest = undefined;
    await course.save();

    res.json({
      success: true,
      message: 'MCQ test deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting MCQ test',
      error: error.message
    });
  }
};

// @desc    Add customer experience
// @route   POST /api/courses/:id/experiences
// @access  Private
const addExperience = async (req, res) => {
  try {
    const { experience, rating } = req.body;
    const courseId = req.params.id;

    // Check if user is enrolled and completed the course
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
      status: 'completed'
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must complete the course to share your experience'
      });
    }

    const course = await Course.findById(courseId);

    // Check if user already shared experience
    const existingExperience = course.experiences.find(
      exp => exp.student.toString() === req.user.id
    );

    if (existingExperience) {
      return res.status(400).json({
        success: false,
        message: 'You have already shared your experience for this course'
      });
    }

    course.experiences.push({
      student: req.user.id,
      experience,
      rating: parseInt(rating)
    });

    await course.save();

    res.status(201).json({
      success: true,
      message: 'Experience added successfully',
      experience: course.experiences[course.experiences.length - 1]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding experience',
      error: error.message
    });
  }
};

// @desc    Get course experiences
// @route   GET /api/courses/:id/experiences
// @access  Public
const getCourseExperiences = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('experiences.student', 'name profilePicture')
      .select('experiences averageRating totalRatings');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      experiences: course.experiences,
      averageRating: course.averageRating,
      totalRatings: course.totalRatings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching experiences',
      error: error.message
    });
  }
};

// @desc    Attempt MCQ test
// @route   POST /api/courses/:id/test/attempt
// @access  Private
const attemptMCQTest = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (!course.mcqTest) {
      return res.status(404).json({
        success: false,
        message: 'MCQ test not found for this course'
      });
    }

    const { answers, timeSpent } = req.body;

    // Check if user is enrolled and has completed the course
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.id,
      status: 'completed'
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must complete the course before attempting the test'
      });
    }

    // Check if user can attempt test
    const studentAttempts = course.testAttempts.filter(
      attempt => attempt.student.toString() === req.user.id
    );

    if (studentAttempts.length >= course.mcqTest.maxAttempts) {
      return res.status(400).json({
        success: false,
        message: `Maximum attempts (${course.mcqTest.maxAttempts}) reached for this test`
      });
    }

    // Calculate score
    let correctAnswers = 0;
    const answerResults = answers.map((answer, index) => {
      const question = course.mcqTest.questions[index];
      const isCorrect = question.correctAnswer === answer.selectedOption;
      if (isCorrect) correctAnswers++;
      return {
        questionIndex: index,
        selectedOption: answer.selectedOption,
        isCorrect
      };
    });

    const score = correctAnswers;
    const percentage = (correctAnswers / course.mcqTest.questions.length) * 100;
    const passed = percentage >= course.mcqTest.passingScore;

    const testAttempt = {
      student: req.user.id,
      answers: answerResults,
      score,
      percentage,
      passed,
      attemptNumber: studentAttempts.length + 1,
      timeSpent
    };

    course.testAttempts.push(testAttempt);
    await course.save();

    res.json({
      success: true,
      message: `Test submitted successfully. Score: ${score}/20 (${percentage.toFixed(1)}%)`,
      result: {
        score,
        percentage: parseFloat(percentage.toFixed(2)),
        passed,
        correctAnswers,
        totalQuestions: course.mcqTest.questions.length,
        attemptNumber: testAttempt.attemptNumber
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting test',
      error: error.message
    });
  }
};

// @desc    Get test attempts
// @route   GET /api/courses/:id/test/attempts
// @access  Private
const getTestAttempts = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // If user is not admin, only show their own attempts
    let attempts;
    if (req.user.role === 'admin') {
      attempts = course.testAttempts;
    } else {
      attempts = course.testAttempts.filter(
        attempt => attempt.student.toString() === req.user.id
      );
    }

    res.json({
      success: true,
      attempts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching test attempts',
      error: error.message
    });
  }
};

// @desc    Get courses by category
// @route   GET /api/courses/category/:category
// @access  Public
const getCoursesByCategory = async (req, res) => {
  try {
    const courses = await Course.find({ 
      category: req.params.category,
      isActive: true 
    })
    .populate('createdBy', 'name')
    .select('-mcqTest -testAttempts -lessons');

    res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching courses by category',
      error: error.message
    });
  }
};

// @desc    Update course status
// @route   PUT /api/courses/:id/status
// @access  Admin
const updateCourseStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      message: `Course ${isActive ? 'activated' : 'deactivated'} successfully`,
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating course status',
      error: error.message
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Admin
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Delete all associated files from Cloudinary
    if (course.courseImage.public_id) {
      await deleteFromCloudinary(course.courseImage.public_id);
    }
    
    if (course.coursePreviewVideo.public_id) {
      await deleteFromCloudinary(course.coursePreviewVideo.public_id, 'video');
    }
    
    if (course.courseBook.public_id) {
      await deleteFromCloudinary(course.courseBook.public_id, 'raw');
    }
    
    if (course.projectPDF.public_id) {
      await deleteFromCloudinary(course.projectPDF.public_id, 'raw');
    }

    // Delete all lessons and their videos
    const lessons = await Lesson.find({ course: req.params.id });
    for (let lesson of lessons) {
      if (lesson.video.public_id) {
        await deleteFromCloudinary(lesson.video.public_id, 'video');
      }
      await Lesson.findByIdAndDelete(lesson._id);
    }

    // Delete enrollments
    await Enrollment.deleteMany({ course: req.params.id });

    // Delete the course
    await Course.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Course and all associated data deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting course',
      error: error.message
    });
  }
};

// @desc    Get MCQ test
// @route   GET /api/courses/:id/mcq-test
// @access  Public
const getMCQTest = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).select('mcqTest');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (!course.mcqTest) {
      return res.status(404).json({
        success: false,
        message: 'MCQ test not found for this course'
      });
    }

    res.json({
      success: true,
      mcqTest: course.mcqTest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching MCQ test',
      error: error.message
    });
  }
};


// At the end of courseController.js, ensure you have:
module.exports = {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  uploadPreviewVideo,
  uploadCourseBook,
  uploadProjectPDF,
  uploadCertificateTemplate,
  createMCQTest,
  updateMCQTest,
  deleteMCQTest,
  addExperience,
  getCourseExperiences,
  attemptMCQTest,
  getTestAttempts,
  getCoursesByCategory,
  updateCourseStatus,
  getMCQTest
};