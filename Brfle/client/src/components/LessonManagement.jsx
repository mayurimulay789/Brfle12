"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Plus, Eye, Edit, Trash2, Play, FileText, Clock, ArrowUp, ArrowDown, X } from "lucide-react"
import AddLesson from "./AddLesson"
import {
  fetchCourseLessons,
  deleteLesson,
  setCurrentLesson,
  clearError,
  clearSuccess
} from "../store/slices/lessonSlice"

const LessonManagement = ({ courseId, courseTitle, onClose }) => {
  const dispatch = useDispatch()
  const {
    lessons,
    loading,
    error,
    success,
    currentLesson
  } = useSelector((state) => state.lessons)

  const [isCreatingLesson, setIsCreatingLesson] = useState(false)
  const [editingLesson, setEditingLesson] = useState(null)
  const [expandedLesson, setExpandedLesson] = useState(null)

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseLessons(courseId))
    }
  }, [courseId, dispatch])

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
    setIsCreatingLesson(true)
    setEditingLesson(null)
  }

  const handleStartEditing = (lesson) => {
    setEditingLesson(lesson)
    setIsCreatingLesson(true)
  }

  const handleCloseForm = () => {
    setIsCreatingLesson(false)
    setEditingLesson(null)
  }

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm("Are you sure you want to delete this lesson? This action cannot be undone.")) {
      try {
        await dispatch(deleteLesson(lessonId)).unwrap()
        dispatch(fetchCourseLessons(courseId)) // Refresh the list
      } catch (error) {
        console.error("Error deleting lesson:", error)
      }
    }
  }

  const handlePreviewLesson = (lesson) => {
    if (lesson.video?.url) {
      window.open(lesson.video.url, "_blank")
    }
  }

  const handleReorderLesson = async (lessonId, direction) => {
    // This would require additional backend implementation
    console.log(`Reordering lesson ${lessonId} ${direction}`)
    // You would dispatch an updateLesson action here with new order
  }

  const toggleExpandLesson = (lessonId) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId)
  }

  const sortedLessons = [...lessons].sort((a, b) => a.order - b.order)

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-300 rounded w-1/4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div>
            <h4 className="text-2xl font-bold text-gray-900">Lesson Management</h4>
            <p className="text-gray-600 mt-1">Course: {courseTitle}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleStartCreating}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium"
            >
              <Plus className="h-5 w-5" />
              <span>Add Lesson</span>
            </button>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
          <div className="p-6 space-y-6">
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

            {/* Lessons List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900">
                  Course Lessons ({sortedLessons.length})
                </h4>
              </div>

              {sortedLessons.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-gray-500 text-lg mb-4">No lessons found for this course</div>
                  <button
                    onClick={handleStartCreating}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Your First Lesson
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {sortedLessons.map((lesson, index) => (
                    <div key={lesson._id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          {/* Lesson Order and Video Thumbnail */}
                          <div className="flex flex-col items-center space-y-2 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-sm">
                                {lesson.order}
                              </span>
                            </div>
                            
                            {/* Video Thumbnail Placeholder */}
                            <div 
                              className="h-16 w-24 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center cursor-pointer"
                              onClick={() => handlePreviewLesson(lesson)}
                            >
                              {lesson.video?.url ? (
                                <div className="relative group w-full h-full">
                                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                                    <Play className="h-6 w-6 text-white" />
                                  </div>
                                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Play className="h-8 w-8 text-white" />
                                  </div>
                                </div>
                              ) : (
                                <Play className="h-6 w-6 text-gray-400" />
                              )}
                            </div>
                          </div>

                          {/* Lesson Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="text-lg font-semibold text-gray-900">
                                  {lesson.lessonTitle}
                                </h5>
                                
                                {lesson.description && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    {expandedLesson === lesson._id 
                                      ? lesson.description
                                      : `${lesson.description.substring(0, 100)}${lesson.description.length > 100 ? '...' : ''}`
                                    }
                                  </p>
                                )}

                                <div className="flex flex-wrap items-center gap-4 mt-3">
                                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                                    <Clock className="h-4 w-4" />
                                    <span>{lesson.duration}</span>
                                  </div>

                                  {lesson.isPreview && (
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                      Free Preview
                                    </span>
                                  )}

                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    lesson.isActive 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {lesson.isActive ? 'Active' : 'Inactive'}
                                  </span>

                                  {lesson.resources && lesson.resources.length > 0 && (
                                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                                      <FileText className="h-4 w-4" />
                                      <span>{lesson.resources.length} resources</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                                {/* Reorder Buttons */}
                                <div className="flex flex-col space-y-1 mr-2">
                                  <button
                                    onClick={() => handleReorderLesson(lesson._id, 'up')}
                                    disabled={index === 0}
                                    className={`p-1 rounded ${
                                      index === 0 
                                        ? 'text-gray-300 cursor-not-allowed' 
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                    }`}
                                    title="Move Up"
                                  >
                                    <ArrowUp className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleReorderLesson(lesson._id, 'down')}
                                    disabled={index === sortedLessons.length - 1}
                                    className={`p-1 rounded ${
                                      index === sortedLessons.length - 1
                                        ? 'text-gray-300 cursor-not-allowed' 
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                    }`}
                                    title="Move Down"
                                  >
                                    <ArrowDown className="h-4 w-4" />
                                  </button>
                                </div>

                                <button
                                  onClick={() => handlePreviewLesson(lesson)}
                                  className="text-blue-600 hover:text-blue-800 p-2 transition-colors"
                                  title="Preview Lesson"
                                >
                                  <Eye className="h-5 w-5" />
                                </button>

                                <button
                                  onClick={() => handleStartEditing(lesson)}
                                  className="text-green-600 hover:text-green-800 p-2 transition-colors"
                                  title="Edit Lesson"
                                >
                                  <Edit className="h-5 w-5" />
                                </button>

                                <button
                                  onClick={() => handleDeleteLesson(lesson._id)}
                                  className="text-red-600 hover:text-red-800 p-2 transition-colors"
                                  title="Delete Lesson"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </div>

                            {/* Expand/Collapse Button for Long Descriptions */}
                            {lesson.description && lesson.description.length > 100 && (
                              <button
                                onClick={() => toggleExpandLesson(lesson._id)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
                              >
                                {expandedLesson === lesson._id ? 'Show Less' : 'Read More'}
                              </button>
                            )}

                            {/* Resources Section */}
                            {expandedLesson === lesson._id && lesson.resources && lesson.resources.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-100">
                                <h6 className="text-sm font-semibold text-gray-900 mb-2">Resources:</h6>
                                <div className="space-y-2">
                                  {lesson.resources.map((resource, resIndex) => (
                                    <div key={resIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                      <div className="flex items-center space-x-3">
                                        <FileText className="h-4 w-4 text-gray-500" />
                                        <div>
                                          <p className="text-sm font-medium text-gray-900">{resource.title}</p>
                                          <p className="text-xs text-gray-500 capitalize">{resource.type}</p>
                                        </div>
                                      </div>
                                      {resource.file?.url && (
                                        <a
                                          href={resource.file.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                          Download
                                        </a>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add/Edit Lesson Form Modal */}
        {isCreatingLesson && (
          <AddLesson
            onClose={handleCloseForm}
            editingLesson={editingLesson}
            courseId={courseId}
            courseTitle={courseTitle}
            existingLessonsCount={sortedLessons.length}
          />
        )}
      </div>
    </div>
  )
}

export default LessonManagement