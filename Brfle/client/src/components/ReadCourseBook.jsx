"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { 
  Download, 
  ArrowLeft,
  Printer,
  Share2,
  BookOpen,
  ExternalLink,
  FileText,
  ChevronLeft,
  ChevronRight,
  Home,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Eye,
  Smartphone,
  Monitor
} from "lucide-react"
import { markMaterialAccessed } from "../store/slices/enrollmentSlice"

const ReadCourseBook = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { courseId } = useParams()
  
  const { currentCourse } = useSelector((state) => state.courses)
  const { courseProgress } = useSelector((state) => state.enrollments)
  const { user } = useSelector((state) => state.auth)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewOption, setViewOption] = useState('pdfjs')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [showControls, setShowControls] = useState(true)

  // Get course book URL from course data
  const courseBookUrl = currentCourse?.courseBook?.url || currentCourse?.courseBook
  // const courseBookUrl = currentCourse?.projectPDF?.url || currentCourse?.projectPDF

  // Mark material as accessed when component mounts
  useEffect(() => {
    if (courseId && !courseProgress?.accessedMaterials?.courseBook) {
      dispatch(markMaterialAccessed({ courseId, materialType: 'courseBook' }))
    }
  }, [courseId, dispatch, courseProgress])

  // Handle fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const handleDownload = () => {
    if (courseBookUrl) {
      const link = document.createElement('a')
      link.href = courseBookUrl
      link.download = `${currentCourse?.courseTitle || 'course'}-book.pdf`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

 



  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }


  // Generate PDF.js viewer URL
  const getPDFjsUrl = () => {
    if (!courseBookUrl) return ''
    return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(courseBookUrl)}`
  }

  const handleIframeLoad = () => {
    setLoading(false)
    setError(null)
  }

  const handleIframeError = () => {
    setLoading(false)
    setError('Failed to load PDF. Please try downloading instead.')
  }

  if (!currentCourse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-lg p-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <FileText className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Course Not Found</h2>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/my-courses')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium"
            >
              Back to My Courses
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg transition-all duration-200 font-medium"
            >
              <Home className="h-4 w-4" />
              Go Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!courseBookUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-lg p-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
            <BookOpen className="h-10 w-10 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Course Book Not Available</h2>
          <p className="text-gray-600 mb-6">The course book for "{currentCourse.courseTitle}" is not available at the moment.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(`/course/${courseId}/course-progress`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium"
            >
              Back to Course Progress
            </button>
            <button
              onClick={() => navigate('/my-courses')}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg transition-all duration-200 font-medium"
            >
              Browse Other Courses
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header - Fixed on Desktop, Sticky on Mobile */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left Section - Navigation and Title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/course/${courseId}/course-progress`)}
                className="group flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-all duration-200 p-2 rounded-lg hover:bg-blue-50"
                aria-label="Back to course progress"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline font-medium">Back</span>
              </button>
              
              <div className="hidden sm:block h-6 w-px bg-gray-300"></div>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-lg lg:text-xl font-bold text-gray-900 truncate">
                  {currentCourse.courseTitle}
                </h1>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  Course Book
                </p>
              </div>
            </div>

            {/* Right Section - Progress and Actions */}
            <div className="flex items-center space-x-3">
              {/* Progress Badge */}
              {courseProgress?.accessedMaterials?.courseBook && (
                <div className="hidden sm:flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-green-800">
                    Material Accessed ✓
                  </span>
                </div>
              )}

              {/* Mobile Progress Indicator */}
              {courseProgress?.accessedMaterials?.courseBook && (
                <div className="sm:hidden">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowControls(!showControls)}
                className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle controls"
              >
                <Eye className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Viewer Controls Card */}
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 mb-6 transition-all duration-300 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}>
          <div className="p-4 lg:p-6">
            {/* Desktop Controls */}
            <div className="hidden lg:flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {/* Viewer Type */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Monitor className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Viewer:</span>
                  </div>
                  <select
                    value={viewOption}
                    onChange={(e) => setViewOption(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="pdfjs">PDF.js Viewer (Recommended)</option>
                  </select>
                </div>

             
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                
                <button
                  onClick={toggleFullscreen}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">
                    {isFullscreen ? "Exit" : "Fullscreen"}
                  </span>
                </button>
              </div>
            </div>

            {/* Mobile Controls */}
            <div className="lg:hidden space-y-4">
              {/* Top Row - Viewer Type and Fullscreen */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-4 w-4 text-gray-500" />
                  <select
                    value={viewOption}
                    onChange={(e) => setViewOption(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pdfjs">PDF Viewer</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>


              {/* Bottom Row - Action Buttons */}
              <div className="flex items-center justify-between">
                
                
               
                
                
              </div>
            </div>
          </div>
        </div>

        {/* PDF Viewer Container */}
        <div className="relative bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Loading State */}
          {loading && (
            <div className="absolute inset-0 z-10 bg-white/90 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 relative">
                  <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                </div>
                <p className="text-gray-600 font-medium">Loading course book...</p>
                <p className="text-sm text-gray-500 mt-2">Preparing the best reading experience</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="absolute inset-0 z-10 bg-white flex items-center justify-center p-8">
              <div className="max-w-md text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                  <FileText className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Failed to Load PDF</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => {
                      setLoading(true)
                      setError(null)
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    Retry Loading
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    <Download className="h-4 w-4" />
                    Download Instead
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PDF Viewer */}
          <div 
            className="relative w-full"
            style={{ height: isFullscreen ? 'calc(100vh - 80px)' : '70vh' }}
          >
            <iframe
              src={getPDFjsUrl()}
              className="w-full h-full border-0"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s ease'
              }}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              title={`${currentCourse.courseTitle} - Course Book`}
              allowFullScreen
            />
          </div>

          {/* Viewer Footer */}
          <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FileText className="h-3 w-3" />
                <span>PDF Viewer powered by PDF.js</span>
              </div>
              <div className="text-sm text-gray-500">
                {currentCourse?.courseBook?.pages ? `${currentCourse.courseBook.pages} pages` : 'Course Book'}
              </div>
            </div>
          </div>
        </div>

      
      </main>

     
    </div>
  )
}

export default ReadCourseBook