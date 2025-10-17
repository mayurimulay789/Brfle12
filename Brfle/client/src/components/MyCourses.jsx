"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { 
  Play, 
  Clock, 
  Calendar, 
  BookOpen,
  TrendingUp,
  Filter
} from "lucide-react"
import { fetchMyEnrollments } from "../store/slices/enrollmentSlice"

const MyCourses = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { enrollments, loading } = useSelector((state) => state.enrollments)
  const { user } = useSelector((state) => state.auth)
  
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  useEffect(() => {
    dispatch(fetchMyEnrollments())
  }, [dispatch])

  const filteredEnrollments = enrollments.filter(enrollment => {
    if (filter === 'all') return true
    if (filter === 'in-progress') return enrollment.progress < 100
    if (filter === 'completed') return enrollment.progress === 100
    return true
  })

  const sortedEnrollments = [...filteredEnrollments].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.enrolledAt) - new Date(a.enrolledAt)
    }
    if (sortBy === 'progress') {
      return b.progress - a.progress
    }
    if (sortBy === 'title') {
      return a.course.courseTitle.localeCompare(b.course.courseTitle)
    }
    return 0
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getProgressColor = (progress) => {
    if (progress === 100) return 'bg-green-500'
    if (progress >= 70) return 'bg-blue-500'
    if (progress >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const handleStartCourse = (courseId) => {
    navigate(`/course/${courseId}/course-progress`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            {/* Header Skeleton */}
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            
            {/* Filters Skeleton */}
            <div className="flex space-x-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-300 rounded w-24"></div>
              ))}
            </div>
            
            {/* Course Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                  <div className="h-40 bg-gray-300 rounded-lg"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Courses
          </h1>
          <p className="text-gray-600">
            Continue your learning journey and track your progress
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enrollments.filter(e => e.progress < 100).length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enrollments.filter(e => e.progress === 100).length}
                </p>
              </div>
              <Play className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enrollments.length > 0 
                    ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
                    : 0
                  }%
                </p>
              </div>
              <Filter className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Courses
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'in-progress'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Completed
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="recent">Recently Enrolled</option>
            <option value="progress">Progress</option>
            <option value="title">Course Title</option>
          </select>
        </div>

        {/* Course Grid */}
        {sortedEnrollments.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filter === 'all' ? 'No courses enrolled yet' : No `${filter.replace('-', ' ')} courses`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Start your learning journey by enrolling in courses.' 
                : `You don't have any ${filter.replace('-', ' ')} courses at the moment.`
              }
            </p>
            {filter === 'all' && (
              <button
                onClick={() => navigate('/courses')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Courses
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedEnrollments.map((enrollment) => (
              <div key={enrollment._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                {/* Course Image */}
                <div className="relative">
                  <img
                    src={enrollment.course.courseImage?.url || '/api/placeholder/400/225'}
                    alt={enrollment.course.courseTitle}
                    className="w-full h-48 object-cover rounded-t-lg"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/400/225'
                    }}
                  />
                  {enrollment.progress === 100 && (
                    <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Completed
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {/* Course Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                    {enrollment.course.courseTitle}
                  </h3>

                  {/* Category and Duration - One Line */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span className="capitalize">{enrollment.course.category}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{enrollment.course.duration}</span>
                    </div>
                  </div>

                  {/* Progress and Enrollment Date - One Line */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{enrollment.progress}% Complete</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(enrollment.enrolledAt)}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(enrollment.progress)}`}
                      style={{ width: `${enrollment.progress}%` }}
                    ></div>
                  </div>

                  {/* Start Button */}
                  <button
                    onClick={() => handleStartCourse(enrollment.course._id)}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                      enrollment.progress === 100
                        ? 'bg-green-200 text-green-900 border border-green-300 hover:bg-green-500'
                        : 'bg-blue-200 text-blue-900 border border-blue-400 hover:bg-blue-500'
                    }`}
                  >
                    <Play className="h-4 w-4 " />
                    <span>
                      { 
                       enrollment.progress > 0 ? 'Continue' : 'Start Learning'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyCourses