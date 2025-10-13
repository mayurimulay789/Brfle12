"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Plus, Eye, Edit, Trash2, Clock } from "lucide-react"
import {
  fetchAllCourses,
  deleteCourse,
  recalculateCourseDuration,
  setIsCreatingCourse,
  setEditingCourse,
  setCourseFormData,
  resetCourseFormData
} from "../store/slices/adminSlice"
import AddCourse from "./AddCourse"

const AdminCourseForm = () => {
  const dispatch = useDispatch()
  const {
    courses,
    coursesLoading,
    isCreatingCourse,
    editingCourse,
    error,
    success
  } = useSelector((state) => state.admin)

  useEffect(() => {
    dispatch(fetchAllCourses())
  }, [dispatch])

  const handleStartCreating = () => {
    dispatch(resetCourseFormData())
    dispatch(setIsCreatingCourse(true))
    dispatch(setEditingCourse(null))
  }

  const handleStartEditing = (course) => {
    dispatch(setCourseFormData({
      title: course.title || "",
      description: course.description || "",
      category: course.category || "",
      price: course.price || "",
      level: course.level || "Beginner",
      thumbnail: course.thumbnail || "",
      lessons: course.lessons || [],
    }))
    dispatch(setEditingCourse(course))
    dispatch(setIsCreatingCourse(true))
  }

  const handleCloseForm = () => {
    dispatch(setIsCreatingCourse(false))
    dispatch(setEditingCourse(null))
    dispatch(resetCourseFormData())
  }

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await dispatch(deleteCourse(courseId)).unwrap()
      } catch (error) {
        console.error("Error deleting course:", error)
      }
    }
  }

  const handleRecalculateDuration = async (courseId) => {
    try {
      await dispatch(recalculateCourseDuration(courseId)).unwrap()
    } catch (error) {
      console.error("Error recalculating course duration:", error)
    }
  }

  // Helper function to check if thumbnail is a video
  const isVideoThumbnail = (thumbnail) => {
    if (!thumbnail) return false
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.flv']
    return videoExtensions.some(ext => thumbnail.toLowerCase().includes(ext))
  }

  // Safe data handling - ensure courses is always an array
  const safeCourses = Array.isArray(courses) ? courses : []

  if (coursesLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-300 rounded"></div>
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
        <h3 className="text-lg font-semibold text-gray-900">Course Management</h3>
        <div className="flex space-x-2">
          <button
            onClick={handleStartCreating}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Course</span>
          </button>
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">{success}</p>
        </div>
      )}

      {/* Add/Edit Course Form */}
      {isCreatingCourse && (
        <AddCourse 
          onClose={handleCloseForm}
          editingCourse={editingCourse}
        />
      )}

      {/* Courses List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">
            Existing Courses ({safeCourses.length})
          </h4>
        </div>

        {safeCourses.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-500">No courses found. Create your first course!</div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {safeCourses.map((course) => {
              const thumbnail = course.thumbnail || ""
              const isVideo = isVideoThumbnail(thumbnail)
              
              return (
                <div key={course._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center relative">
                        {thumbnail ? (
                          isVideo ? (
                            <video
                              src={thumbnail}
                              className="h-full w-full object-cover"
                              muted
                              controls={false}
                              preload="metadata"
                              onError={(e) => {
                                e.target.style.display = 'none'
                                const fallback = e.target.parentElement.querySelector('.thumbnail-fallback')
                                if (fallback) fallback.style.display = 'flex'
                              }}
                            />
                          ) : (
                            <img
                              src={thumbnail}
                              alt={course.title || "Course thumbnail"}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none'
                                const fallback = e.target.parentElement.querySelector('.thumbnail-fallback')
                                if (fallback) fallback.style.display = 'flex'
                              }}
                            />
                          )
                        ) : (
                          <div className="thumbnail-fallback flex items-center justify-center bg-gray-200 text-xs text-gray-600 font-medium absolute inset-0">
                            NO IMG
                          </div>
                        )}
                        {/* Fallback that shows when media fails to load */}
                        <div 
                          className="thumbnail-fallback hidden items-center justify-center bg-gray-200 text-xs text-gray-600 font-medium absolute inset-0"
                        >
                          {isVideo ? 'VIDEO' : 'IMG'}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-lg font-medium text-gray-900">
                          {course.title || "Untitled Course"}
                        </h5>
                        <p className="text-sm text-gray-600">
                          {course.description || "No description available"}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-500">
                            Category: {course.category || "Uncategorized"}
                          </span>
                          <span className="text-sm text-gray-500">
                            Price: ₹{course.price || "0"}
                          </span>
                          <span className="text-sm text-gray-500">
                            Enrollments: {course.enrollmentCount || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          course.status === "published" || course.isPublished
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {course.status || (course.isPublished ? "published" : "draft")}
                      </span>

                      <button
                        onClick={() => window.open(`/courses/${course._id}`, "_blank")}
                        className="text-blue-600 hover:text-blue-800 p-2"
                        title="View Course"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleRecalculateDuration(course._id)}
                        className="text-purple-600 hover:text-purple-800 p-2"
                        title="Recalculate Duration"
                      >
                        <Clock className="h-4 w-4" />
                      </button>

                      <button 
                        onClick={() => handleStartEditing(course)} 
                        className="text-green-600 hover:text-green-800 p-2"
                        title="Edit Course"
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      <button 
                        onClick={() => handleDeleteCourse(course._id)} 
                        className="text-red-600 hover:text-red-800 p-2"
                        title="Delete Course"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminCourseForm