"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Plus, Eye, Edit, Trash2, Clock, Users, Star, Play, FileText } from "lucide-react"
import AddCourse from "./AddCourse"
import LessonManagement from "./LessonManagement"
import MCQTest from "./MCQTest"
import {
  fetchAllCourses,
  deleteCourse,
  setEditingCourse,
  setIsCreatingCourse,
  clearError,
  clearSuccess
} from "../store/slices/courseSlice"

const AdminCourseForm = () => {
  const dispatch = useDispatch()
  const {
    courses,
    loading,
    error,
    success,
    editingCourse,
    isCreatingCourse
  } = useSelector((state) => state.courses)

  const { user } = useSelector((state) => state.auth)

  const [selectedCourseForLessons, setSelectedCourseForLessons] = useState(null)
  const [selectedCourseForMCQ, setSelectedCourseForMCQ] = useState(null)

  useEffect(() => {
    dispatch(fetchAllCourses())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, dispatch])

  const handleStartCreating = () => {
    dispatch(setIsCreatingCourse(true))
    dispatch(setEditingCourse(null))
  }

  const handleStartEditing = (course) => {
    dispatch(setEditingCourse(course))
    dispatch(setIsCreatingCourse(true))
  }

  const handleCloseForm = () => {
    dispatch(setIsCreatingCourse(false))
    dispatch(setEditingCourse(null))
  }

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      try {
        await dispatch(deleteCourse(courseId)).unwrap()
      } catch (error) {
        console.error("Error deleting course:", error)
      }
    }
  }

  const handleViewCourse = (courseId) => {
    window.open(`/courses/${courseId}`, "_blank")
  }

  const handleManageLessons = (course) => {
    setSelectedCourseForLessons(course)
  }

  const handleManageMCQTest = (course) => {
    setSelectedCourseForMCQ(course)
  }

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">You need admin privileges to access this page.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-700">Course Management</h3>
          <p className="text-gray-600 mt-1">Create and manage your courses</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleStartCreating}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium"
          >
            <Plus className="h-5 w-5" />
            <span className="text-white">Create Course</span>
          </button>
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-red-400">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-green-400">✅</span>
            </div>
            <div className="ml-3">
              <p className="text-green-800 text-sm font-medium">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Courses List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">
            All Courses ({courses.length})
          </h4>
        </div>

        {courses.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-gray-500 text-lg mb-4">No courses found</div>
            <button
              onClick={handleStartCreating}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Course
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {courses.map((course) => (
              <div key={course._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Course Thumbnail */}
                    <div className="h-20 w-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={course.courseImage?.url || '/api/placeholder/300/200'}
                        alt={course.courseTitle}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.src = '/api/placeholder/300/200'
                        }}
                      />
                    </div>

                    {/* Course Details */}
                    <div className="flex-1 min-w-0">
                      <h5 className="text-lg font-semibold text-gray-900 truncate">
                        {course.courseTitle}
                      </h5>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {course.courseSummary}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 mt-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          course.difficulty === 'beginner'
                            ? 'bg-green-100 text-green-800'
                            : course.difficulty === 'intermediate'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {course.difficulty}
                        </span>

                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {course.category}
                        </span>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{course.totalStudents || 0} students</span>
                          </div>

                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{course.totalLessons || 0} lessons</span>
                          </div>

                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span>{course.averageRating || '0.0'}</span>
                            {course.totalRatings > 0 && (
                              <span>({course.totalRatings})</span>
                            )}
                          </div>

                          <span>₹{course.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        course.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {course.isActive ? "Active" : "Inactive"}
                    </span>

                    {/* <button
                      onClick={() => handleViewCourse(course._id)}
                      className="text-blue-600 hover:text-blue-800 p-2 transition-colors"
                      title="View Course"
                    >
                      <Eye className="h-5 w-5" />
                    </button> */}

                    <button
                      onClick={() => handleManageLessons(course)}
                      className="text-purple-600 hover:text-purple-800 p-2 transition-colors"
                      title="Manage Lessons"
                    >
                      <Play className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => handleManageMCQTest(course)}
                      className="text-orange-600 hover:text-orange-800 p-2 transition-colors"
                      title="Manage MCQ Test"
                    >
                      <FileText className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => handleStartEditing(course)}
                      className="text-green-600 hover:text-green-800 p-2 transition-colors"
                      title="Edit Course"
                    >
                      <Edit className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      className="text-red-600 hover:text-red-800 p-2 transition-colors"
                      title="Delete Course"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    Created: {new Date(course.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    Mode: <span className="capitalize">{course.mode}</span>
                  </div>
                  {course.mcqTest && (
                    <div className="text-sm text-green-600 font-medium">
                      MCQ Test: {course.mcqTest.questions?.length || 0} questions
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Course Form Modal */}
      {isCreatingCourse && (
        <AddCourse
          onClose={handleCloseForm}
          editingCourse={editingCourse}
        />
      )}

      {/* Lesson Management Modal */}
      {selectedCourseForLessons && (
        <LessonManagement
          courseId={selectedCourseForLessons._id}
          courseTitle={selectedCourseForLessons.courseTitle}
          onClose={() => setSelectedCourseForLessons(null)}
        />
      )}

      {/* MCQ Test Management Modal */}
      {selectedCourseForMCQ && (
        <MCQTest
          courseId={selectedCourseForMCQ._id}
          courseTitle={selectedCourseForMCQ.courseTitle}
          onClose={() => setSelectedCourseForMCQ(null)}
        />
      )}
    </div>
  )
}

export default AdminCourseForm