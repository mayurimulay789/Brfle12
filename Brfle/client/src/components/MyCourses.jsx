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
  Calendar
} from "lucide-react";

export default function MyCourses() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { enrollments, loading, error, courseProgress, certificate } = useSelector((state) => state.enrollments);
  const { lessons, loading: lessonsLoading } = useSelector((state) => state.lessons);
  const { user } = useSelector((state) => state.auth);
  
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // "all", "in-progress", "completed"

  useEffect(() => {
    dispatch(fetchMyEnrollments());
  }, [dispatch]);

  const filteredEnrollments = enrollments.filter(enrollment => {
    if (activeTab === "all") return true;
    if (activeTab === "in-progress") return enrollment.progress < 100;
    if (activeTab === "completed") return enrollment.progress === 100;
    return true;
  });

  const handleViewProgress = async (enrollment) => {
    setSelectedCourse(enrollment);
    await dispatch(fetchCourseProgress(enrollment.course._id));
    await dispatch(fetchCourseLessons(enrollment.course._id));
    setShowProgressModal(true);
  };

  const handleViewCertificate = async (enrollment) => {
    setSelectedCourse(enrollment);
    await dispatch(fetchCertificate(enrollment.course._id));
    setShowCertificateModal(true);
  };

  const handleMarkLessonCompleted = async (lessonId) => {
    if (selectedCourse) {
      await dispatch(completeLesson({
        courseId: selectedCourse.course._id,
        lessonId: lessonId
      }));
      // Refresh progress
      await dispatch(fetchCourseProgress(selectedCourse.course._id));
    }
  };

  const handleContinueLearning = (enrollment) => {
    if (enrollment.course?._id) {
      navigate(`/course/${enrollment.course._id}/learn`);
    }
  };

  const handleCancelEnrollment = async (enrollmentId, courseTitle) => {
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
    if (enrollment.progress === 100) {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center gap-1 w-fit">
          <CheckCircle size={12} />
          Completed
        </span>
      );
    } else if (enrollment.progress > 0) {
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Courses
          </h1>
          <p className="text-gray-600">
            {enrollments.length} {enrollments.length === 1 ? 'course' : 'courses'} enrolled
          </p>
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
            In Progress ({enrollments.filter(e => e.progress < 100).length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "completed"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            Completed ({enrollments.filter(e => e.progress === 100).length})
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
            {filteredEnrollments.map((enrollment) => (
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
                      className={`h-full ${getProgressColor(enrollment.progress)} transition-all duration-500`}
                      style={{ width: `${enrollment.progress}%` }}
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

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <BarChart3 size={16} className="text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {enrollment.progress}% Complete
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
                      {enrollment.progress === 0 ? "Start" : "Continue"}
                    </button>
                    
                    <button
                      onClick={() => handleViewProgress(enrollment)}
                      className="px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                    >
                      <BarChart3 size={16} />
                      Progress
                    </button>

                    {enrollment.progress === 100 && (
                      <button
                        onClick={() => handleViewCertificate(enrollment)}
                        className="w-full mt-2 px-3 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition flex items-center justify-center gap-2"
                      >
                        <Download size={16} />
                        Certificate
                      </button>
                    )}

                    {/* {enrollment.progress < 100 && (
                      <button
                        onClick={() => handleCancelEnrollment(
                          enrollment.course?._id, 
                          enrollment.course?.courseTitle
                        )}
                        className="w-full mt-2 px-3 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition flex items-center justify-center gap-2"
                      >
                        <X size={16} />
                        Unenroll
                      </button>
                    )} */}
                  </div>
                </div>
              </div>
            ))}
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
                </div>
              </div>

              <div className="p-6">
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

                {courseProgress?.percentage === 100 && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-green-900">
                          🎉 Course Completed!
                        </h4>
                        <p className="text-green-700 text-sm mt-1">
                          You've successfully completed all lessons in this course.
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
                      {selectedCourse.progress === 100 
                        ? "Certificate is being generated. Please try again later."
                        : "Complete the course to get your certificate."}
                    </p>
                    {selectedCourse.progress < 100 && (
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