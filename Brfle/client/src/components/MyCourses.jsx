import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  fetchMyEnrollments, 
  fetchCourseProgress,
  completeLesson,
  cancelEnrollment,
  fetchCertificate 
} from "../store/slices/enrollmentSlice";
import { fetchCourseLessons } from "../store/slices/lessonSlice";
import { 
  Play, 
  Clock, 
  CheckCircle, 
  BookOpen, 
  BarChart3, 
  Download,
  X,
  AlertCircle,
  Calendar,
  Star,
  Award
} from "lucide-react";

export default function MyCourses() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { enrollments, loading, error, courseProgress, certificate } = useSelector((state) => state.enrollments);
  const { lessons, loading: lessonsLoading } = useSelector((state) => state.lessons);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // "all", "in-progress", "completed"
  const [userPoints, setUserPoints] = useState(0);
  const [coursePoints, setCoursePoints] = useState({
    questionAnswer: 0,
    courseVideo: 0,
    pdfBooks: 0,
    projectBooks: 0,
    experienceDiary: 0
  });

  useEffect(() => {
    // Check if user is authenticated before fetching data
    if (isAuthenticated && user) {
      dispatch(fetchMyEnrollments());
    }
  }, [dispatch, isAuthenticated, user]);

  useEffect(() => {
    if (enrollments.length > 0) {
      calculateUserPoints();
    }
  }, [enrollments]);

  // Calculate user points based on completed activities
  const calculateUserPoints = () => {
    let totalPoints = 0;
    const pointsBreakdown = {
      questionAnswer: 0,
      courseVideo: 0,
      pdfBooks: 0,
      projectBooks: 0,
      experienceDiary: 0
    };

    enrollments.forEach(enrollment => {
      // Calculate points for each enrollment based on progress and activities
      if (enrollment.progressDetails) {
        // Question Answer points (20 points)
        if (enrollment.progressDetails.questionAnswerCompleted) {
          pointsBreakdown.questionAnswer += 20;
          totalPoints += 20;
        }

        // Course Video points (20 points)
        if (enrollment.progressDetails.videoCompleted) {
          pointsBreakdown.courseVideo += 20;
          totalPoints += 20;
        }

        // PDF Books points (20 points)
        if (enrollment.progressDetails.pdfCompleted) {
          pointsBreakdown.pdfBooks += 20;
          totalPoints += 20;
        }

        // Project Books points (20 points)
        if (enrollment.progressDetails.projectCompleted) {
          pointsBreakdown.projectBooks += 20;
          totalPoints += 20;
        }

        // Experience Diary points (20 points)
        if (enrollment.progressDetails.diaryCompleted) {
          pointsBreakdown.experienceDiary += 20;
          totalPoints += 20;
        }
      }
    });

    setUserPoints(totalPoints);
    setCoursePoints(pointsBreakdown);
  };

  // Calculate progress including points system
  const calculateEnhancedProgress = (enrollment) => {
    const baseProgress = enrollment.progress || 0;
    let pointsProgress = 0;
    let completedActivities = 0;
    const totalActivities = 5; // questionAnswer, courseVideo, pdfBooks, projectBooks, experienceDiary

    if (enrollment.progressDetails) {
      if (enrollment.progressDetails.questionAnswerCompleted) completedActivities++;
      if (enrollment.progressDetails.videoCompleted) completedActivities++;
      if (enrollment.progressDetails.pdfCompleted) completedActivities++;
      if (enrollment.progressDetails.projectCompleted) completedActivities++;
      if (enrollment.progressDetails.diaryCompleted) completedActivities++;
    }

    pointsProgress = (completedActivities / totalActivities) * 100;
    
    // Combine base progress with points progress (weighted average)
    return Math.round((baseProgress * 0.7) + (pointsProgress * 0.3));
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    if (activeTab === "all") return true;
    const enhancedProgress = calculateEnhancedProgress(enrollment);
    if (activeTab === "in-progress") return enhancedProgress < 100;
    if (activeTab === "completed") return enhancedProgress === 100;
    return true;
  });

  const handleViewProgress = async (enrollment) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSelectedCourse(enrollment);
    try {
      await dispatch(fetchCourseProgress(enrollment.course._id));
      await dispatch(fetchCourseLessons(enrollment.course._id));
      setShowProgressModal(true);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const handleViewCertificate = async (enrollment) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSelectedCourse(enrollment);
    try {
      await dispatch(fetchCertificate(enrollment.course._id));
      setShowCertificateModal(true);
    } catch (error) {
      console.error('Error fetching certificate:', error);
    }
  };

  const handleViewPoints = (enrollment) => {
    setSelectedCourse(enrollment);
    setShowPointsModal(true);
  };

  const handleMarkLessonCompleted = async (lessonId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (selectedCourse) {
      try {
        await dispatch(completeLesson({
          courseId: selectedCourse.course._id,
          lessonId: lessonId
        }));
        // Refresh progress
        await dispatch(fetchCourseProgress(selectedCourse.course._id));
      } catch (error) {
        console.error('Error marking lesson complete:', error);
      }
    }
  };

  const handleContinueLearning = (enrollment) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (enrollment.course?._id) {
      navigate(`/course/${enrollment.course._id}/learn`);
    }
  };

  const handleCancelEnrollment = async (enrollmentId, courseTitle) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (window.confirm(`Are you sure you want to unenroll from "${courseTitle}"?`)) {
      try {
        await dispatch(cancelEnrollment(enrollmentId)).unwrap();
        // Refresh enrollments list
        dispatch(fetchMyEnrollments());
      } catch (error) {
        alert(`Failed to cancel enrollment: ${error}`);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusBadge = (enrollment) => {
    const enhancedProgress = calculateEnhancedProgress(enrollment);
    
    if (enhancedProgress === 100) {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center gap-1 w-fit">
          <CheckCircle size={12} />
          Completed
        </span>
      );
    } else if (enhancedProgress > 0) {
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center gap-1 w-fit">
          <BookOpen size={12} />
          In Progress
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full flex items-center gap-1 w-fit">
          <Clock size={12} />
          Not Started
        </span>
      );
    }
  };

  // Render points breakdown for a course
  const renderPointsBreakdown = (enrollment) => {
    const progressDetails = enrollment.progressDetails || {};
    
    return (
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className={`flex items-center gap-1 ${progressDetails.questionAnswerCompleted ? 'text-green-600' : 'text-gray-500'}`}>
          <Star size={12} />
          <span>Q&A: {progressDetails.questionAnswerCompleted ? '20/20' : '0/20'}</span>
        </div>
        <div className={`flex items-center gap-1 ${progressDetails.videoCompleted ? 'text-green-600' : 'text-gray-500'}`}>
          <Star size={12} />
          <span>Video: {progressDetails.videoCompleted ? '20/20' : '0/20'}</span>
        </div>
        <div className={`flex items-center gap-1 ${progressDetails.pdfCompleted ? 'text-green-600' : 'text-gray-500'}`}>
          <Star size={12} />
          <span>PDF: {progressDetails.pdfCompleted ? '20/20' : '0/20'}</span>
        </div>
        <div className={`flex items-center gap-1 ${progressDetails.projectCompleted ? 'text-green-600' : 'text-gray-500'}`}>
          <Star size={12} />
          <span>Project: {progressDetails.projectCompleted ? '20/20' : '0/20'}</span>
        </div>
        <div className={`flex items-center gap-1 ${progressDetails.diaryCompleted ? 'text-green-600' : 'text-gray-500'}`}>
          <Star size={12} />
          <span>Diary: {progressDetails.diaryCompleted ? '20/20' : '0/20'}</span>
        </div>
      </div>
    );
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <AlertCircle size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Authentication Required
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Please log in to view your courses and learning progress.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mb-8"></div>
            
            <div className="flex gap-4 mb-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-300 rounded w-32"></div>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="h-40 bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-2 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-2 bg-gray-300 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Points Summary */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Courses
              </h1>
              <p className="text-gray-600">
                {enrollments.length} {enrollments.length === 1 ? 'course' : 'courses'} enrolled
              </p>
            </div>
            
            {/* Points Summary */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Award className="text-yellow-500" size={20} />
                <h3 className="font-semibold text-gray-900">Your Learning Points</h3>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{userPoints} pts</div>
              <div className="text-xs text-gray-600">
                Earned from completed activities
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "all"
                ? "bg-black text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            All Courses ({enrollments.length})
          </button>
          <button
            onClick={() => setActiveTab("in-progress")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "in-progress"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            In Progress ({enrollments.filter(e => calculateEnhancedProgress(e) < 100).length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "completed"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            Completed ({enrollments.filter(e => calculateEnhancedProgress(e) === 100).length})
          </button>
        </div>

        {/* Courses Grid */}
        {filteredEnrollments.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === "all" ? "No courses enrolled" : 
               activeTab === "in-progress" ? "No courses in progress" : 
               "No courses completed"}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === "all" 
                ? "Start your learning journey by enrolling in a course."
                : activeTab === "in-progress"
                ? "All your enrolled courses are completed. Great job!"
                : "Complete your enrolled courses to see them here."}
            </p>
            {activeTab === "all" && (
              <button
                onClick={() => navigate("/courses")}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold"
              >
                Browse Courses
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEnrollments.map((enrollment) => {
              const enhancedProgress = calculateEnhancedProgress(enrollment);
              
              return (
                <div
                  key={enrollment._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Course Image */}
                  <div className="relative">
                    <img
                      src={enrollment.course?.courseImage?.url || "/default-course.jpg"}
                      alt={enrollment.course?.courseTitle}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(enrollment)}
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gray-200 h-2">
                      <div
                        className={`h-full ${getProgressColor(enhancedProgress)} transition-all duration-500`}
                        style={{ width: `${enhancedProgress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                      {enrollment.course?.courseTitle || "Course Title Not Available"}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <BookOpen size={16} />
                        <span>{enrollment.course?.category || "General"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{enrollment.course?.duration || "Self-paced"}</span>
                      </div>
                    </div>

                    {/* Points Breakdown */}
                    {renderPointsBreakdown(enrollment)}

                    <div className="flex items-center justify-between mb-4 mt-2">
                      <div className="flex items-center gap-2">
                        <BarChart3 size={16} className="text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {enhancedProgress}% Complete
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Enrolled {formatDate(enrollment.enrolledAt)}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleContinueLearning(enrollment)}
                        className="flex-1 px-3 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2"
                      >
                        <Play size={16} />
                        {enhancedProgress === 0 ? "Start" : "Continue"}
                      </button>
                      
                      <button
                        onClick={() => handleViewProgress(enrollment)}
                        className="px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                      >
                        <BarChart3 size={16} />
                        Progress
                      </button>

                      <button
                        onClick={() => handleViewPoints(enrollment)}
                        className="px-3 py-2 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-lg hover:bg-yellow-200 transition flex items-center gap-2"
                      >
                        <Award size={16} />
                        Points
                      </button>

                      {enhancedProgress === 100 && (
                        <button
                          onClick={() => handleViewCertificate(enrollment)}
                          className="w-full mt-2 px-3 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition flex items-center justify-center gap-2"
                        >
                          <Download size={16} />
                          Certificate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Progress Modal */}
        {showProgressModal && selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Course Progress - {selectedCourse.course?.courseTitle}
                  </h2>
                  <button
                    onClick={() => setShowProgressModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <BarChart3 size={16} />
                    <span>{courseProgress?.percentage || 0}% Complete</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle size={16} />
                    <span>{courseProgress?.completed || 0} of {courseProgress?.total || 0} lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award size={16} />
                    <span>{calculateEnhancedProgress(selectedCourse)}% Enhanced Progress</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Enhanced Progress Section */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Learning Activities Progress</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">Q&A Section</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">20 points</span>
                        <button
                          onClick={() => {
                            setShowProgressModal(false);
                            navigate(`/course/${selectedCourse.course._id}/qa`);
                          }}
                          className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-800 transition"
                        >
                          Start
                        </button>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">Course Videos</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">20 points</span>
                        <button
                          onClick={() => {
                            setShowProgressModal(false);
                            navigate(`/course/${selectedCourse.course._id}/videos`);
                          }}
                          className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-800 transition"
                        >
                          Start
                        </button>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">PDF Books</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">20 points</span>
                        <button
                          onClick={() => {
                            setShowProgressModal(false);
                            navigate(`/course/${selectedCourse.course._id}/pdfs`);
                          }}
                          className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-800 transition"
                        >
                          Start
                        </button>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">Project Books</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">20 points</span>
                        <button
                          onClick={() => {
                            setShowProgressModal(false);
                            navigate(`/course/${selectedCourse.course._id}/projects`);
                          }}
                          className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-800 transition"
                        >
                          Start
                        </button>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">Experience Diary</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">20 points</span>
                        <button
                          onClick={() => {
                            setShowProgressModal(false);
                            navigate(`/course/${selectedCourse.course._id}/diary`);
                          }}
                          className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-800 transition"
                        >
                          Start
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {lessonsLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lessons.map((lesson, index) => {
                      const isCompleted = courseProgress?.lessons?.find(
                        l => l._id === lesson._id
                      )?.isCompleted || false;
                      
                      return (
                        <div
                          key={lesson._id}
                          className={`flex items-center gap-4 p-4 rounded-lg border ${
                            isCompleted 
                              ? "bg-green-50 border-green-200" 
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted ? "bg-green-500" : "bg-gray-300"
                          }`}>
                            {isCompleted ? (
                              <CheckCircle size={16} className="text-white" />
                            ) : (
                              <span className="text-white text-sm font-medium">
                                {index + 1}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {lesson.lessonTitle}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {lesson.duration}
                              </span>
                              {lesson.isPreview && (
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                  Preview
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {!isCompleted && (
                              <button
                                onClick={() => handleMarkLessonCompleted(lesson._id)}
                                className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-800 transition"
                              >
                                Mark Complete
                              </button>
                            )}
                            <button
                              onClick={() => navigate(`/lesson/${lesson._id}`)}
                              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition flex items-center gap-1"
                            >
                              <Play size={14} />
                              Watch
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {calculateEnhancedProgress(selectedCourse) === 100 && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-green-900">
                          🎉 Course Completed!
                        </h4>
                        <p className="text-green-700 text-sm mt-1">
                          You've successfully completed all lessons and activities in this course.
                        </p>
                      </div>
                      <button
                        onClick={() => handleViewCertificate(selectedCourse)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold flex items-center gap-2"
                      >
                        <Download size={16} />
                        Get Certificate
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Points Modal */}
        {showPointsModal && selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Points Breakdown - {selectedCourse.course?.courseTitle}
                  </h2>
                  <button
                    onClick={() => setShowPointsModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Total Points Earned</span>
                    <span className="text-xl font-bold text-yellow-600">
                      {(() => {
                        let total = 0;
                        const details = selectedCourse.progressDetails || {};
                        if (details.questionAnswerCompleted) total += 20;
                        if (details.videoCompleted) total += 20;
                        if (details.pdfCompleted) total += 20;
                        if (details.projectCompleted) total += 20;
                        if (details.diaryCompleted) total += 20;
                        return total;
                      })()}/100
                    </span>
                  </div>

                  <div className="space-y-3">
                    <PointsItem
                      title="Question & Answer Section"
                      points={20}
                      completed={selectedCourse.progressDetails?.questionAnswerCompleted}
                      onNavigate={() => {
                        setShowPointsModal(false);
                        navigate(`/course/${selectedCourse.course._id}/qa`);
                      }}
                    />
                    <PointsItem
                      title="Course Videos"
                      points={20}
                      completed={selectedCourse.progressDetails?.videoCompleted}
                      onNavigate={() => {
                        setShowPointsModal(false);
                        navigate(`/course/${selectedCourse.course._id}/videos`);
                      }}
                    />
                    <PointsItem
                      title="PDF Books"
                      points={20}
                      completed={selectedCourse.progressDetails?.pdfCompleted}
                      onNavigate={() => {
                        setShowPointsModal(false);
                        navigate(`/course/${selectedCourse.course._id}/pdfs`);
                      }}
                    />
                    <PointsItem
                      title="Project Books"
                      points={20}
                      completed={selectedCourse.progressDetails?.projectCompleted}
                      onNavigate={() => {
                        setShowPointsModal(false);
                        navigate(`/course/${selectedCourse.course._id}/projects`);
                      }}
                    />
                    <PointsItem
                      title="Experience Diary"
                      points={20}
                      completed={selectedCourse.progressDetails?.diaryCompleted}
                      onNavigate={() => {
                        setShowPointsModal(false);
                        navigate(`/course/${selectedCourse.course._id}/diary`);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Certificate Modal */}
        {showCertificateModal && selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Course Certificate
                  </h2>
                  <button
                    onClick={() => setShowCertificateModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {certificate ? (
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-8 mb-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle size={32} className="text-yellow-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          Certificate of Completion
                        </h3>
                        <p className="text-gray-600 mb-4">
                          This certifies that
                        </p>
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">
                          {user?.FullName || "Student Name"}
                        </h4>
                        <p className="text-gray-600 mb-4">
                          has successfully completed the course
                        </p>
                        <h5 className="text-lg font-bold text-gray-900 mb-2">
                          {selectedCourse.course?.courseTitle}
                        </h5>
                        <div className="flex justify-center gap-6 text-sm text-gray-600 mt-4">
                          <div>
                            <div className="font-semibold">Completed On</div>
                            <div>{formatDate(certificate.completionDate)}</div>
                          </div>
                          <div>
                            <div className="font-semibold">Certificate ID</div>
                            <div className="font-mono">{certificate.certificateId}</div>
                          </div>
                          <div>
                            <div className="font-semibold">Total Points</div>
                            <div className="font-mono">{userPoints}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={() => window.print()}
                        className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold flex items-center gap-2"
                      >
                        <Download size={16} />
                        Download PDF
                      </button>
                      <button
                        onClick={() => setShowCertificateModal(false)}
                        className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Certificate Not Available
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {calculateEnhancedProgress(selectedCourse) === 100 
                        ? "Certificate is being generated. Please try again later."
                        : "Complete the course to get your certificate."}
                    </p>
                    {calculateEnhancedProgress(selectedCourse) < 100 && (
                      <button
                        onClick={() => {
                          setShowCertificateModal(false);
                          handleViewProgress(selectedCourse);
                        }}
                        className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                      >
                        View Progress
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper component for points items
const PointsItem = ({ title, points, completed, onNavigate }) => (
  <div className={`flex items-center justify-between p-3 rounded-lg border ${
    completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
  }`}>
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        completed ? 'bg-green-500' : 'bg-gray-300'
      }`}>
        {completed ? (
          <CheckCircle size={16} className="text-white" />
        ) : (
          <Award size={16} className="text-white" />
        )}
      </div>
      <div>
        <div className="font-medium text-gray-900">{title}</div>
        <div className="text-sm text-gray-600">{points} points</div>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {completed ? 'Completed' : 'Pending'}
      </span>
      {!completed && (
        <button
          onClick={onNavigate}
          className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-800 transition"
        >
          Start
        </button>
      )}
    </div>
  </div>
);