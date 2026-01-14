
"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { X, Save, Plus, Image, Video, FileText, Trash2 } from "lucide-react"
import {
  createCourse,
  updateCourse,
  setEditingCourse,
  setIsCreatingCourse,
  clearError,
  clearSuccess
} from "../store/slices/courseSlice"

const AddCourse = ({ onClose, editingCourse }) => {
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.courses)

  const [formData, setFormData] = useState({
    courseTitle: "",
    courseGuide: "",
    courseBenifits:"",
    courseSummary: "",
    price: "",
    duration: "",
    mode: "online",
    category: "",
    difficulty: "beginner",
    language: "English",
    tags: [],
    isActive: true
  })

  const [courseImage, setCourseImage] = useState(null)
  const [coursePreviewVideo, setCoursePreviewVideo] = useState(null)
  const [courseBook, setCourseBook] = useState(null)
  const [projectPDF, setProjectPDF] = useState(null)
  const [localError, setLocalError] = useState("")
  const [tagInput, setTagInput] = useState("")

  // Initialize form with editing course data
  useEffect(() => {
    if (editingCourse) {
      setFormData({
        courseTitle: editingCourse.courseTitle || "",
        courseGuide: editingCourse.courseGuide || "",
        courseBenifits:editingCourse.courseBenifits || "",
        courseSummary: editingCourse.courseSummary || "",
        price: editingCourse.price?.toString() || "",
        duration: editingCourse.duration || "",
        mode: editingCourse.mode || "online",
        category: editingCourse.category || "",
        difficulty: editingCourse.difficulty || "beginner",
        language: editingCourse.language || "English",
        tags: editingCourse.tags || [],
        isActive: editingCourse.isActive !== false
      })
    }
  }, [editingCourse])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleFileChange = (setter, fileType, maxSize) => (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > maxSize) {
        setLocalError(`${fileType} size should be less than ${maxSize / (1024 * 1024)}MB`)
        return
      }
      setter(file)
      setLocalError("")
    }
  }

  const validateForm = () => {
    const errors = []
    
    if (!formData.courseTitle.trim()) errors.push("Course title is required")
    if (!formData.courseGuide.trim()) errors.push("Course guide is required")
    if(!formData.courseBenifits.trim()) errors.push("course Benifits Not found")
    if (!formData.courseSummary.trim()) errors.push("Course summary is required")
    if (!formData.price || parseFloat(formData.price) < 0) errors.push("Valid price is required")
    if (!formData.duration.trim()) errors.push("Course duration is required")
    if (!formData.category) errors.push("Category is required")
    
    if (!editingCourse && !courseImage) {
      errors.push("Course image is required for new courses")
    }

    if (errors.length > 0) {
      setLocalError(errors.join(", "))
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError("")
    console.log("button cliked");

    if (!validateForm()) {
      return
    }

    try {
      const submitData = new FormData()
      
      // Append form data
      Object.keys(formData).forEach(key => {
        if (key === 'tags') {
          submitData.append(key, JSON.stringify(formData[key]))
        } else if (key === 'price') {
          submitData.append(key, parseFloat(formData[key]))
        } else {
          submitData.append(key, formData[key])
        }
      })

      // ✅ FIXED: Use correct field names that match your backend
      if (courseImage) {
        submitData.append('courseImage', courseImage)
      }
      if (coursePreviewVideo) {
        submitData.append('previewVideo', coursePreviewVideo)
      }
      if (courseBook) {
        submitData.append('courseBook', courseBook)
      }
      if (projectPDF) {
        submitData.append('projectPDF', projectPDF)
      }

      // ✅ DEBUG: Log form data to check field names
      console.log("FormData entries:")
      for (let [key, value] of submitData.entries()) {
        console.log(key, value instanceof File ? `File: ${value.name}` : value)
      }

      if (editingCourse) {
        await dispatch(updateCourse({
          courseId: editingCourse._id,
          courseData: submitData
        })).unwrap()
      } else {
        await dispatch(createCourse(submitData)).unwrap()
      }
      
      handleClose()
    } catch (error) {
      console.error("Error saving course:", error)
      setLocalError(error.message || "Failed to save course")
    }
  }

  const handleClose = () => {
    setFormData({
      courseTitle: "",
      courseGuide: "",
      courseBenifits:"",
      courseSummary: "",
      price: "",
      duration: "",
      mode: "online",
      category: "",
      difficulty: "beginner",
      language: "English",
      tags: [],
      isActive: true
    })
    setCourseImage(null)
    setCoursePreviewVideo(null)
    setCourseBook(null)
    setProjectPDF(null)
    setLocalError("")
    dispatch(clearError())
    dispatch(clearSuccess())
    onClose()
  }

  const getFilePreview = (file, existingUrl) => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return existingUrl
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div>
            <h4 className="text-xl font-bold text-gray-700">
              {editingCourse ? "Edit Course" : "Create New Course"}
            </h4>
            <p className="text-gray-600 mt-1">
              {editingCourse ? "Update your course details" : "Fill in the details to create a new course"}
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
          <div className="p-6 space-y-8">
            {/* Error Messages */}
            {(error || localError) && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm font-medium">{error || localError}</p>
              </div>
            )}

            {/* Basic Information Section */}
            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h5 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    name="courseTitle"
                    value={formData.courseTitle}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., React JS Masterclass"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
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
                    value={formData.price}
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
                    Duration *
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 8 weeks, 40 hours"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mode *
                  </label>
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level *
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                  </select>
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
                    Course is active and visible to students
                  </label>
                </div>
              </div>
            </section>

            {/* Course Content Section */}
            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h5 className="text-lg font-semibold text-gray-900 mb-4">Course ContenFinal course datat</h5>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Benifits *
                  </label>
                  <textarea
                    name="courseBenifits"
                    value={formData.courseBenifits}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    placeholder="Add your course Benifits here..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Guide *
                  </label>
                  <textarea
                    name="courseGuide"
                    value={formData.courseGuide}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    placeholder="Detailed guide about the course, curriculum, learning outcomes, teaching methodology..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Summary *
                  </label>
                  <textarea
                    name="courseSummary"
                    value={formData.courseSummary}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Brief summary of the course that will be displayed on the course card (max 1000 characters)"
                    maxLength={1000}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.courseSummary.length}/1000 characters
                  </p>
                </div>
              </div>
            </section>

            {/* Media Files Section */}
            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h5 className="text-lg font-semibold text-gray-900 mb-4">Media & Resources</h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Course Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Image {!editingCourse && '*'}
                  </label>
                  <div className="space-y-3">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors bg-white">
                      <Image className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        {courseImage ? 'Change Image' : 'Upload Course Image'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange(setCourseImage, 'Image', 5 * 1024 * 1024)}
                        className="hidden"
                      />
                    </label>
                    {(courseImage || editingCourse?.courseImage?.url) && (
                      <div className="relative">
                        <img
                          src={getFilePreview(courseImage, editingCourse?.courseImage?.url)}
                          alt="Course preview"
                          className="h-32 w-full object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Recommended: 800x450px, JPG/PNG/WEBP, max 5MB
                  </p>
                </div>

                {/* Preview Video */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Preview Video
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors bg-white">
                    <Video className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      {coursePreviewVideo ? 'Change Video' : 'Upload Preview Video'}
                    </span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange(setCoursePreviewVideo, 'Video', 50 * 1024 * 1024)}
                      className="hidden"
                      
                    />
                  </label>
                  {coursePreviewVideo && (
                    <p className="text-xs text-green-600 mt-2">
                      Selected: {coursePreviewVideo.name}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    MP4, MOV, AVI, max 50MB
                  </p>
                </div>

                {/* Course Book */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Book (PDF)
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors bg-white">
                    <FileText className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      {courseBook ? 'Change PDF' : 'Upload Course Book'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange(setCourseBook, 'PDF', 10 * 1024 * 1024)}
                      className="hidden"
                    />
                  </label>
                  {courseBook && (
                    <p className="text-xs text-green-600 mt-2">
                      Selected: {courseBook.name}
                    </p>
                  )}
                </div>

                {/* Project PDF */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project PDF
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors bg-white">
                    <FileText className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      {projectPDF ? 'Change PDF' : 'Upload Project PDF'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange(setProjectPDF, 'PDF', 10 * 1024 * 1024)}
                      className="hidden"
                    />
                  </label>
                  {projectPDF && (
                    <p className="text-xs text-green-600 mt-2">
                      Selected: {projectPDF.name}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Tags Section */}
            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h5 className="text-lg font-semibold text-gray-900 mb-4">Tags & Organization</h5>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagInputKeyPress}
                    placeholder="Add a tag and press Enter..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Add relevant tags to help students discover your course
                </p>
              </div>
            </section>

            {/* Note about Lessons */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <InformationCircleIcon className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Lessons Management
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Lessons are managed separately after creating the course. 
                      You can add, edit, and organize lessons from the course management page.
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
                  ? (editingCourse ? "Updating..." : "Creating...") 
                  : (editingCourse ? "Update Course" : "Create Course")
                }
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Helper component for information icon
const InformationCircleIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
)

export default AddCourse