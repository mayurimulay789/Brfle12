"use client"

import { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { 
  ArrowLeft, 
  Send, 
  BookOpen,
  AlertCircle
} from "lucide-react"
import { addExperience } from "../store/slices/enrollmentSlice"

const ExperienceDiary = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { courseId } = useParams() // This should get courseId from URL
  
  const { currentCourse } = useSelector((state) => state.courses)
  const { courseProgress } = useSelector((state) => state.enrollments)

  const [formData, setFormData] = useState({
    title: 'Test Experience',
    content: 'This is a test experience content.',
    rating: 5,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Debug: Check all values
  useEffect(() => {
    console.log('🔍 DEBUG ExperienceDiary:')
    console.log('courseId from useParams():', courseId)
    console.log('currentCourse:', currentCourse)
    console.log('currentCourse ID:', currentCourse?._id)
  }, [courseId, currentCourse])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    console.log('🔄 Submitting experience...')
    console.log('courseId to be used:', courseId)

    // Validate courseId
    if (!courseId || courseId === 'undefined') {
      const errorMsg = `Invalid courseId: ${courseId}. Please go back and try again.`
      setError(errorMsg)
      console.error(errorMsg)
      return
    }

    setIsSubmitting(true)

    try {
      console.log('🚀 Dispatching addExperience with courseId:', courseId)
      
      const result = await dispatch(addExperience(courseId)).unwrap()
      
      console.log('✅ Experience submission successful:', result)
      alert('Experience submitted successfully!')
      
    } catch (error) {
      console.error('❌ Experience submission failed:', error)
      setError(error.message || 'Failed to submit experience. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!currentCourse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-4">Course ID: {courseId}</p>
          <button
            onClick={() => navigate('/my-courses')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to My Courses
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={() => navigate(`/course/${courseId}/course-progress`)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Course Progress</span>
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Experience Diary - {currentCourse.courseTitle}
          </h1>
          <p className="text-gray-600">Course ID: {courseId}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Error: {error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Experience'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ExperienceDiary