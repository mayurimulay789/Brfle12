"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { X, Save, Plus, Video, FileText, Trash2 } from "lucide-react"
import {
  createLesson,
  updateLesson,
  clearError,
  clearSuccess
} from "../store/slices/lessonSlice"

const AddLesson = ({ onClose, editingLesson, courseId, courseTitle, existingLessonsCount }) => {
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.lessons)

  const [formData, setFormData] = useState({
    lessonTitle: "",
    duration: "",
    description: "",
    order: existingLessonsCount + 1,
    isPreview: false,
    isActive: true
  })

  const [lessonVideo, setLessonVideo] = useState(null)
  const [resources, setResources] = useState([])
  const [localError, setLocalError] = useState("")

  // Initialize form with editing lesson data
  useEffect(() => {
    if (editingLesson) {
      setFormData({
        lessonTitle: editingLesson.lessonTitle || "",
        duration: editingLesson.duration || "",
        description: editingLesson.description || "",
        order: editingLesson.order || existingLessonsCount + 1,
        isPreview: editingLesson.isPreview || false,
        isActive: editingLesson.isActive !== false
      })
      
      if (editingLesson.resources) {
        setResources(editingLesson.resources)
      }
    }
  }, [editingLesson, existingLessonsCount])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        setLocalError("Video size should be less than 100MB")
        return
      }
      setLessonVideo(file)
      setLocalError("")
    }
  }

  const handleAddResource = () => {
    setResources(prev => [
      ...prev,
      {
        title: "",
        type: "document",
        file: null
      }
    ])
  }

  const handleResourceChange = (index, field, value) => {
    setResources(prev => 
      prev.map((resource, i) => 
        i === index ? { ...resource, [field]: value } : resource
      )
    )
  }

  const handleResourceFileChange = (index, file) => {
    if (file && file.size > 10 * 1024 * 1024) { // 10MB limit
      setLocalError("Resource file size should be less than 10MB")
      return
    }
    
    setResources(prev =>
      prev.map((resource, i) =>
        i === index ? { ...resource, file } : resource
      )
    )
    setLocalError("")
  }

  const handleRemoveResource = (index) => {
    setResources(prev => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const errors = []
    
    if (!formData.lessonTitle.trim()) errors.push("Lesson title is required")
    if (!formData.duration.trim()) errors.push("Duration is required")
    if (!formData.order || formData.order < 1) errors.push("Valid order number is required")
    
    if (!editingLesson && !lessonVideo) {
      errors.push("Lesson video is required for new lessons")
    }

    // Validate resources
    resources.forEach((resource, index) => {
      if (!resource.title.trim()) {
        errors.push(`Resource ${index + 1} title is required`)
      }
      if (!resource.file && !resource.file?.url) {
        errors.push(`Resource ${index + 1} file is required`)
      }
    })

    if (errors.length > 0) {
      setLocalError(errors.join(", "))
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError("")

    if (!validateForm()) {
      return
    }

    try {
      const submitData = new FormData()
      
      // Append form data
      Object.keys(formData).forEach(key => {
        if (key === 'order') {
          submitData.append(key, parseInt(formData[key]))
        } else {
          submitData.append(key, formData[key])
        }
      })

      // Append course ID
      submitData.append('courseId', courseId)

      // Append video file
      if (lessonVideo) {
        submitData.append('video', lessonVideo)
      }

      // Append resources
      resources.forEach((resource, index) => {
        if (resource.file) {
          submitData.append(`resources[${index}][title]`, resource.title)
          submitData.append(`resources[${index}][type]`, resource.type)
          submitData.append(`resources[${index}][file]`, resource.file)
        }
      })

      if (editingLesson) {
        await dispatch(updateLesson({
          lessonId: editingLesson._id,
          lessonData: submitData
        })).unwrap()
      } else {
        await dispatch(createLesson(submitData)).unwrap()
      }
      
      handleClose()
    } catch (error) {
      console.error("Error saving lesson:", error)
      setLocalError(error.message || "Failed to save lesson")
    }
  }

  const handleClose = () => {
    setFormData({
      lessonTitle: "",
      duration: "",
      description: "",
      order: existingLessonsCount + 1,
      isPreview: false,
      isActive: true
    })
    setLessonVideo(null)
    setResources([])
    setLocalError("")
    dispatch(clearError())
    dispatch(clearSuccess())
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div>
            <h4 className="text-xl font-bold text-gray-700">
              {editingLesson ? "Edit Lesson" : "Add New Lesson"}
            </h4>
            <p className="text-gray-600 mt-1">
              {courseTitle}
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(95vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Error Messages */}
            {(error || localError) && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm font-medium">{error || localError}</p>
              </div>
            )}

            {/* Basic Information */}
            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h5 className="text-lg font-semibold text-gray-900 mb-4">Lesson Information</h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson Title *
                  </label>
                  <input
                    type="text"
                    name="lessonTitle"
                    value={formData.lessonTitle}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Introduction to React Components"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Number *
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    required
                    min="1"
                    placeholder="e.g., 1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration *
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 15:30, 45 minutes"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPreview"
                    checked={formData.isPreview}
                    onChange={handleInputChange}
                    className="rounded text-blue-600 mr-3 focus:ring-blue-500"
                    id="isPreview"
                  />
                  <label htmlFor="isPreview" className="text-sm font-medium text-gray-700">
                    Available as free preview
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="rounded text-blue-600 mr-3 focus:ring-blue-500"
                    id="isActive"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Lesson is active
                  </label>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe what students will learn in this lesson..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                />
              </div>
            </section>

            {/* Video Upload Section */}
            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h5 className="text-lg font-semibold text-gray-900 mb-4">Lesson Video</h5>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video File {!editingLesson && '*'}
                </label>
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors bg-white">
                  <Video className="h-12 w-12 text-gray-400 mb-3" />
                  <span className="text-lg text-gray-600 font-medium">
                    {lessonVideo ? 'Change Video File' : 'Upload Lesson Video'}
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    MP4, MOV, AVI, MKV, WEBM (max 100MB)
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                </label>
                
                {lessonVideo && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm">
                      <strong>Selected:</strong> {lessonVideo.name} ({(lessonVideo.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  </div>
                )}

                {editingLesson?.video?.url && !lessonVideo && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      <strong>Current Video:</strong> {editingLesson.video.url.split('/').pop()}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Resources Section */}
            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h5 className="text-lg font-semibold text-gray-900">Lesson Resources</h5>
                <button
                  type="button"
                  onClick={handleAddResource}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-white">Add Resource</span>
                </button>
              </div>

              {resources.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No resources added yet</p>
                  <p className="text-sm mt-1">Add PDFs, documents, or other learning materials</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {resources.map((resource, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <h6 className="font-medium text-gray-900">Resource {index + 1}</h6>
                        <button
                          type="button"
                          onClick={() => handleRemoveResource(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Resource Title *
                          </label>
                          <input
                            type="text"
                            value={resource.title}
                            onChange={(e) => handleResourceChange(index, 'title', e.target.value)}
                            placeholder="e.g., Exercise Worksheet, Code Examples"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Resource Type
                          </label>
                          <select
                            value={resource.type}
                            onChange={(e) => handleResourceChange(index, 'type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="document">Document</option>
                            <option value="pdf">PDF</option>
                            <option value="image">Image</option>
                            <option value="link">Link</option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Resource File *
                          </label>
                          <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors bg-white">
                            <FileText className="h-6 w-6 text-gray-400 mb-1" />
                            <span className="text-sm text-gray-600">
                              {resource.file ? 'Change File' : 'Upload Resource File'}
                            </span>
                            <input
                              type="file"
                              onChange={(e) => handleResourceFileChange(index, e.target.files[0])}
                              className="hidden"
                            />
                          </label>
                          
                          {resource.file && (
                            <p className="text-green-600 text-sm mt-2">
                              Selected: {resource.file.name}
                            </p>
                          )}

                          {resource.file?.url && !resource.file && (
                            <p className="text-blue-600 text-sm mt-2">
                              Current: {resource.file.url.split('/').pop()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
            <button
              type="button"
              onClick={handleClose}
              className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              <span className="text-white">
                {loading 
                  ? (editingLesson ? "Updating..." : "Creating...") 
                  : (editingLesson ? "Update Lesson" : "Create Lesson")
                }
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddLesson