"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { X, Save, Plus, Link, Image, Video } from "lucide-react"
import {
  setCourseFormData,
  resetCourseFormData,
  updateCourseLesson,
  addCourseLesson,
  removeCourseLesson,
  createCourse,
  updateCourseDetails
} from "../store/slices/adminSlice"

const AddCourse = ({ onClose, editingCourse }) => {
  const dispatch = useDispatch()
  const { courseFormData, loading, error } = useSelector((state) => state.admin)
  
  const [localError, setLocalError] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    dispatch(setCourseFormData({ [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError("")

    // Validate required fields
    if (!courseFormData.title || !courseFormData.description || !courseFormData.category || !courseFormData.price) {
      setLocalError("Please fill in all required fields")
      return
    }

    // Validate price
    if (courseFormData.price < 0) {
      setLocalError("Price cannot be negative")
      return
    }

    // Validate thumbnail URL if provided
    if (courseFormData.thumbnail && !isValidUrl(courseFormData.thumbnail)) {
      setLocalError("Please enter a valid thumbnail URL")
      return
    }

    // Validate lesson video URLs
    for (let lesson of courseFormData.lessons) {
      if (lesson.videoUrl && !isValidUrl(lesson.videoUrl)) {
        setLocalError(`Please enter a valid video URL for lesson: ${lesson.title || 'Untitled'}`)
        return
      }
    }

    try {
      const courseData = {
        title: courseFormData.title,
        description: courseFormData.description,
        category: courseFormData.category,
        price: parseFloat(courseFormData.price),
        level: courseFormData.level,
        thumbnail: courseFormData.thumbnail || "https://via.placeholder.com/400x225?text=Course+Thumbnail",
        lessons: courseFormData.lessons.map((lesson, index) => ({
          title: lesson.title,
          description: lesson.description,
          videoUrl: lesson.videoUrl,
          duration: lesson.duration || 0,
          order: lesson.order || index + 1,
          isPreview: lesson.isPreview || false,
          resources: lesson.resources || []
        })),
        requirements: courseFormData.requirements || [],
        whatYouWillLearn: courseFormData.whatYouWillLearn || [],
        targetAudience: courseFormData.targetAudience || [],
        tags: courseFormData.tags || [],
        language: courseFormData.language || "English",
        certificate: {
          available: courseFormData.certificateAvailable !== false,
          passingScore: courseFormData.passingScore || 70
        },
        status: courseFormData.status || "published",
        isPublished: courseFormData.status !== "draft"
      }

      if (editingCourse) {
        await dispatch(updateCourseDetails({
          courseId: editingCourse._id,
          courseData
        })).unwrap()
      } else {
        await dispatch(createCourse(courseData)).unwrap()
      }
      onClose()
    } catch (error) {
      setLocalError(error.message || "Failed to save course")
    }
  }

  const handleReset = () => {
    dispatch(resetCourseFormData())
    onClose()
  }

  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const addRequirement = () => {
    const currentRequirements = courseFormData.requirements || []
    dispatch(setCourseFormData({
      requirements: [...currentRequirements, ""]
    }))
  }

  const updateRequirement = (index, value) => {
    const updatedRequirements = [...(courseFormData.requirements || [])]
    updatedRequirements[index] = value
    dispatch(setCourseFormData({ requirements: updatedRequirements }))
  }

  const removeRequirement = (index) => {
    const updatedRequirements = (courseFormData.requirements || []).filter((_, i) => i !== index)
    dispatch(setCourseFormData({ requirements: updatedRequirements }))
  }

  const addLearningPoint = () => {
    const currentLearning = courseFormData.whatYouWillLearn || []
    dispatch(setCourseFormData({
      whatYouWillLearn: [...currentLearning, ""]
    }))
  }

  const updateLearningPoint = (index, value) => {
    const updatedLearning = [...(courseFormData.whatYouWillLearn || [])]
    updatedLearning[index] = value
    dispatch(setCourseFormData({ whatYouWillLearn: updatedLearning }))
  }

  const removeLearningPoint = (index) => {
    const updatedLearning = (courseFormData.whatYouWillLearn || []).filter((_, i) => i !== index)
    dispatch(setCourseFormData({ whatYouWillLearn: updatedLearning }))
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6 sticky top-0 bg-white py-2">
        <h4 className="text-lg font-medium text-gray-900">
          {editingCourse ? "Edit Course" : "Create New Course"}
        </h4>
        <button onClick={handleReset} className="text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Messages */}
        {(error || localError) && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error || localError}</p>
          </div>
        )}

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Title *
            </label>
            <input
              type="text"
              name="title"
              value={courseFormData.title}
              onChange={handleInputChange}
              required
              placeholder="e.g., React JS Crash Course"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={courseFormData.category}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Category</option>
              <option value="Programming">Programming</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Business">Business</option>
              <option value="Creative">Creative</option>
              <option value="Technology">Technology</option>
              <option value="Health">Health</option>
              <option value="Language">Language</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (₹) *
            </label>
            <input
              type="number"
              name="price"
              value={courseFormData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              placeholder="e.g., 4999"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level *
            </label>
            <select
              name="level"
              value={courseFormData.level}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={courseFormData.description}
            onChange={handleInputChange}
            required
            rows={4}
            placeholder="Describe what students will learn in this course..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Description
          </label>
          <textarea
            name="shortDescription"
            value={courseFormData.shortDescription}
            onChange={handleInputChange}
            rows={2}
            placeholder="Brief description (max 500 characters)"
            maxLength={500}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            {courseFormData.shortDescription?.length || 0}/500 characters
          </p>
        </div>

        {/* Thumbnail URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thumbnail URL
          </label>
          <div className="flex items-center space-x-2">
            <Image className="h-5 w-5 text-gray-400" />
            <input
              type="url"
              name="thumbnail"
              value={courseFormData.thumbnail}
              onChange={handleInputChange}
              placeholder="https://example.com/thumbnail.jpg"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter image URL for course thumbnail. Leave empty for default placeholder.
          </p>
          {courseFormData.thumbnail && (
            <div className="mt-2">
              <img
                src={courseFormData.thumbnail}
                alt="Thumbnail preview"
                className="h-32 w-56 object-cover rounded-lg border"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
          )}
        </div>

        {/* Course Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Status
          </label>
          <select
            name="status"
            value={courseFormData.status || "published"}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="review">Under Review</option>
          </select>
        </div>

        {/* Requirements */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Requirements
            </label>
            <button
              type="button"
              onClick={addRequirement}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Requirement</span>
            </button>
          </div>
          <div className="space-y-2">
            {(courseFormData.requirements || []).map((requirement, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => updateRequirement(index, e.target.value)}
                  placeholder="e.g., Basic HTML knowledge"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => removeRequirement(index)}
                  className="text-red-600 hover:text-red-800 p-2"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* What You'll Learn */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">
              What Students Will Learn
            </label>
            <button
              type="button"
              onClick={addLearningPoint}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Learning Point</span>
            </button>
          </div>
          <div className="space-y-2">
            {(courseFormData.whatYouWillLearn || []).map((point, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={point}
                  onChange={(e) => updateLearningPoint(index, e.target.value)}
                  placeholder="e.g., Build responsive web applications"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => removeLearningPoint(index)}
                  className="text-red-600 hover:text-red-800 p-2"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Certificate Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <input
                type="checkbox"
                checked={courseFormData.certificateAvailable !== false}
                onChange={(e) => dispatch(setCourseFormData({ 
                  certificateAvailable: e.target.checked 
                }))}
                className="rounded text-blue-600 mr-2"
              />
              Certificate Available
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passing Score (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={courseFormData.passingScore || 70}
              onChange={(e) => dispatch(setCourseFormData({ 
                passingScore: parseInt(e.target.value) 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Lessons */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">Course Lessons</label>
            <button
              type="button"
              onClick={() => dispatch(addCourseLesson())}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Lesson</span>
            </button>
          </div>

          <div className="space-y-4">
            {courseFormData.lessons.map((lesson, index) => (
              <div key={lesson.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="font-medium text-gray-900">Lesson {index + 1}</h5>
                  <button
                    type="button"
                    onClick={() => dispatch(removeCourseLesson(lesson.id))}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lesson Title *
                    </label>
                    <input
                      type="text"
                      value={lesson.title}
                      onChange={(e) => dispatch(updateCourseLesson({
                        lessonId: lesson.id,
                        field: "title",
                        value: e.target.value
                      }))}
                      required
                      placeholder="e.g., Introduction to React"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Video Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={lesson.duration || 0}
                      onChange={(e) => dispatch(updateCourseLesson({
                        lessonId: lesson.id,
                        field: "duration",
                        value: parseInt(e.target.value) || 0
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video URL
                  </label>
                  <div className="flex items-center space-x-2">
                    <Video className="h-5 w-5 text-gray-400" />
                    <input
                      type="url"
                      value={lesson.videoUrl}
                      onChange={(e) => dispatch(updateCourseLesson({
                        lessonId: lesson.id,
                        field: "videoUrl",
                        value: e.target.value
                      }))}
                      placeholder="https://example.com/video.mp4"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lesson Description
                  </label>
                  <textarea
                    value={lesson.description}
                    onChange={(e) => dispatch(updateCourseLesson({
                      lessonId: lesson.id,
                      field: "description",
                      value: e.target.value
                    }))}
                    rows={2}
                    placeholder="Describe what this lesson covers..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="mt-4 flex items-center">
                  <input
                    type="checkbox"
                    checked={lesson.isPreview || false}
                    onChange={(e) => dispatch(updateCourseLesson({
                      lessonId: lesson.id,
                      field: "isPreview",
                      value: e.target.checked
                    }))}
                    className="rounded text-blue-600 mr-2"
                    id={`preview-${lesson.id}`}
                  />
                  <label htmlFor={`preview-${lesson.id}`} className="text-sm text-gray-700">
                    Available as preview lesson
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? "Saving..." : editingCourse ? "Update Course" : "Create Course"}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddCourse