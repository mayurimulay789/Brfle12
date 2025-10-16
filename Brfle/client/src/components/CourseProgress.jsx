"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { 
  CheckCircle, 
  Circle, 
  BookOpen, 
  FileText, 
  ClipboardList,
  MessageSquare,
  Award,
  Play,
  ArrowLeft,
  Clock,
  Users
} from "lucide-react"
import { fetchCourse } from "../store/slices/courseSlice"
import { fetchCourseProgress } from "../store/slices/enrollmentSlice"

const CourseProgress = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { courseId } = useParams()
  
  const { currentCourse, loading: courseLoading } = useSelector((state) => state.courses)
  const { courseProgress, loading: progressLoading } = useSelector((state) => state.enrollments)
  const { user } = useSelector((state) => state.auth)

  const [sectionProgress, setSectionProgress] = useState({
    lessons: 0,
    courseBook: 0,
    projectBook: 0,
    test: 0,
    experience: 0
  })

  const [totalProgress, setTotalProgress] = useState(0)

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourse(courseId))
      dispatch(fetchCourseProgress(courseId))
    }
  }, [courseId, dispatch])

  useEffect(() => {
    if (courseProgress && currentCourse) {
      // ✅ USE BACKEND SECTION PROGRESS INSTEAD OF CALCULATING LOCALLY
      const progress = {
        lessons: courseProgress.sectionProgress?.lessons || 0,
        courseBook: courseProgress.sectionProgress?.courseBook || 0,
        projectBook: courseProgress.sectionProgress?.projectBook || 0,
        test: courseProgress.sectionProgress?.test || 0,
        experience: courseProgress.sectionProgress?.experience || 0
      }
      
      setSectionProgress(progress)
      
      // Calculate total progress (sum of all sections, max 100)
      const total = Object.values(progress).reduce((sum, current) => sum + current, 0)
      setTotalProgress(total)
    }
  }, [courseProgress, currentCourse])

  const isSectionCompleted = (sectionName) => {
    return sectionProgress[sectionName] === 20
  }

  const isCertificateAvailable = () => {
    return totalProgress === 100
  }

  const handleSectionClick = (sectionName) => {
    switch (sectionName) {
      case 'lessons':
        navigate(`/course/${courseId}/watch`)
        break
      case 'courseBook':
        navigate(`/course/${courseId}/course-book`)
        break
      case 'projectBook':
        navigate(`/course/${courseId}/project-book`)
        break
      case 'test':
        navigate(`/course/${courseId}/attempt-test`)
        break
      case 'experience':
        navigate(`/course/${courseId}/experience`)
        break
      case 'certificate':
        if (isCertificateAvailable()) {
          navigate(`/course/${courseId}/certificate`)
        }
        break
      default:
        break
    }
  }

  const getSectionIcon = (sectionName) => {
    switch (sectionName) {
      case 'lessons':
        return <Play className="h-6 w-6" />
      case 'courseBook':
        return <BookOpen className="h-6 w-6" />
      case 'projectBook':
        return <FileText className="h-6 w-6" />
      case 'test':
        return <ClipboardList className="h-6 w-6" />
      case 'experience':
        return <MessageSquare className="h-6 w-6" />
      case 'certificate':
        return <Award className="h-6 w-6" />
      default:
        return <Circle className="h-6 w-6" />
    }
  }

  const getSectionTitle = (sectionName) => {
    switch (sectionName) {
      case 'lessons':
        return 'Video Lessons'
      case 'courseBook':
        return 'Course Book'
      case 'projectBook':
        return 'Project Book'
      case 'test':
        return 'MCQ Test'
      case 'experience':
        return 'Experience Diary'
      case 'certificate':
        return 'Certificate'
      default:
        return sectionName
    }
  }

  const getSectionDescription = (sectionName) => {
    const completedLessons = courseProgress?.completedLessons?.length || 0
    const totalLessons = currentCourse?.totalLessons || 0
    
    switch (sectionName) {
      case 'lessons':
        return `Watch all video lessons (${completedLessons}/${totalLessons} completed) - ${Math.round(sectionProgress.lessons / 20 * 100)}%`
      case 'courseBook':
        return courseProgress?.accessedMaterials?.courseBook 
          ? 'Course book accessed - 20/20 credits' 
          : 'Download and study the course materials'
      case 'projectBook':
        return courseProgress?.accessedMaterials?.projectBook 
          ? 'Project book accessed - 20/20 credits' 
          : 'Complete the project assignment'
      case 'test':
        return courseProgress?.completedSections?.test 
          ? 'Test passed - 20/20 credits' 
          : 'Take the assessment test (70% passing score required)'
      case 'experience':
        return courseProgress?.completedSections?.experience 
          ? 'Experience submitted - 20/20 credits' 
          : 'Share your learning experience'
      case 'certificate':
        return isCertificateAvailable() 
          ? 'Download your course completion certificate' 
          : 'Complete all sections to unlock certificate'
      default:
        return ''
    }
  }

  const getLessonsProgressText = () => {
    const percentage = Math.round(sectionProgress.lessons / 20 * 100)
    
    if (percentage === 100) {
      return "All lessons completed! 🎉"
    } else if (percentage >= 75) {
      return "Almost there! Keep going! 💪"
    } else if (percentage >= 50) {
      return "Great progress! Halfway done! ✨"
    } else if (percentage >= 25) {
      return "Good start! Continue learning! 📚"
    } else {
      return "Start your learning journey! 🚀"
    }
  }

  const loading = courseLoading || progressLoading

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            {/* Header Skeleton */}
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            
            {/* Progress Bar Skeleton */}
            <div className="h-6 bg-gray-300 rounded"></div>
            
            {/* Sections Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentCourse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-4">The requested course could not be found.</p>
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

  const sections = ['lessons', 'courseBook', 'projectBook', 'test', 'experience', 'certificate']

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/my-courses')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to My Courses</span>
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentCourse.courseTitle}
              </h1>
              <p className="text-gray-600">{currentCourse.courseSummary}</p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{totalProgress}%</div>
                <div className="text-sm text-gray-600">Overall Progress</div>
                <div className="text-xs text-gray-500">
                  {Math.round(totalProgress / 20)}/5 sections completed
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Duration</p>
                <p className="font-semibold text-gray-900">{currentCourse.duration}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Category</p>
                <p className="font-semibold text-gray-900 capitalize">{currentCourse.category}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Lessons</p>
                <p className="font-semibold text-gray-900">{currentCourse.totalLessons || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center space-x-3">
              <Award className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className="font-semibold text-gray-900">
                  {totalProgress === 100 ? 'Completed' : 'In Progress'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Course Progress</h2>
            <span className="text-sm font-medium text-gray-600">{totalProgress}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-green-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${totalProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>0%</span>
            <span>100%</span>
          </div>
          {totalProgress === 100 && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 text-green-700">
                <Award className="h-5 w-5" />
                <span className="font-medium">Congratulations! Course completed! 🎉</span>
              </div>
              <p className="text-green-600 text-sm mt-1">
                You can now download your certificate from the certificate section.
              </p>
            </div>
          )}
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <div
              key={section}
              onClick={() => handleSectionClick(section)}
              className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer transition-all duration-300 hover:shadow-md ${
                section === 'certificate' && !isCertificateAvailable()
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:transform hover:scale-105'
              } ${
                isSectionCompleted(section) 
                ? 'border-2 border-green-500' 
                : 'border border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${
                  isSectionCompleted(section) 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {getSectionIcon(section)}
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">
                    {section === 'certificate' ? '100' : '20'} Credits
                  </span>
                  {isSectionCompleted(section) ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {getSectionTitle(section)}
              </h3>
              
              <p className="text-sm text-gray-600 mb-4">
                {getSectionDescription(section)}
              </p>

              {/* Progress for non-certificate sections */}
              {section !== 'certificate' && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(sectionProgress[section])}/20</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        sectionProgress[section] === 20 ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${(sectionProgress[section] / 20) * 100}%` }}
                    ></div>
                  </div>
                  {section === 'lessons' && sectionProgress.lessons < 20 && (
                    <p className="text-xs text-blue-600 mt-1">
                      {getLessonsProgressText()}
                    </p>
                  )}
                </div>
              )}

              {/* Action Button */}
              <button
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                  section === 'certificate'
                    ? isCertificateAvailable()
                      ? 'bg-green-200 text-green-900 border border-green-300 hover:bg-green-500'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isSectionCompleted(section)
                    ? 'bg-green-200 text-green-900 border border-green-300 hover:bg-green-500'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                disabled={section === 'certificate' && !isCertificateAvailable()}
              >
                {section === 'certificate' ? (
                  <>
                    <Award className="h-4 w-4" />
                    <span>
                      {isCertificateAvailable() ? 'Download Certificate' : 'Complete All Sections'}
                    </span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>
                      {isSectionCompleted(section) ? 'Review' : 'Start'}
                    </span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Progress Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {sections.filter(s => s !== 'certificate').map((section) => (
              <div key={section} className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  isSectionCompleted(section) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {getSectionIcon(section)}
                </div>
                <p className="text-sm font-medium text-gray-900">{getSectionTitle(section)}</p>
                <p className="text-xs text-gray-600">{Math.round(sectionProgress[section])}/20 Credits</p>
                <div className={`w-full h-1 rounded-full mt-1 ${
                  isSectionCompleted(section) ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((sectionProgress[section] / 20) * 100)}% Complete
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseProgress