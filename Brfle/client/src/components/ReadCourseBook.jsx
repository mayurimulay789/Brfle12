"use client"

import { useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  FileText, 
  ArrowLeft,
  Printer,
  Share2,
  BookOpen,
  Maximize2,
  Minimize2
} from "lucide-react"
import { markMaterialAccessed } from "../store/slices/enrollmentSlice"

const ReadCourseBook = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { courseId } = useParams()
  
  const { currentCourse } = useSelector((state) => state.courses)
  const { courseProgress } = useSelector((state) => state.enrollments)
  const { user } = useSelector((state) => state.auth)

  const [zoomLevel, setZoomLevel] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const pdfContainerRef = useRef(null)
  const iframeRef = useRef(null)

  // Get course book URL from course data
  const courseBookUrl = currentCourse?.courseBook?.url || currentCourse?.courseBook

  // Mark material as accessed when component mounts
  useState(() => {
    if (courseId && !courseProgress?.accessedMaterials?.courseBook) {
      dispatch(markMaterialAccessed({ courseId, materialType: 'courseBook' }))
    }
  }, [courseId, dispatch, courseProgress])

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5))
  }

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const handleResetView = () => {
    setZoomLevel(1)
    setRotation(0)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      pdfContainerRef.current?.requestFullscreen?.()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setIsFullscreen(false)
    }
  }

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

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${currentCourse?.courseTitle} - Course Book`,
          text: `Check out the course book for ${currentCourse?.courseTitle}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Sharing cancelled or failed')
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(() => alert('Failed to copy link'))
    }
  }

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const handleLoad = () => {
    setLoading(false)
    setError(null)
  }

  const handleError = () => {
    setLoading(false)
    setError('Failed to load the course book. Please try again later.')
  }

  // PDF display styles based on zoom and rotation
  const pdfStyle = {
    transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
    transformOrigin: 'center center',
    transition: 'transform 0.3s ease',
    width: '100%',
    height: '100%'
  }

  if (!currentCourse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Course Not Found</h2>
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

  if (!courseBookUrl) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Course Book Not Available</h2>
          <p className="text-gray-600 mb-4">The course book for this course is not available yet.</p>
          <button
            onClick={() => navigate(`/course/${courseId}/course-progress`)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Course Progress
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/course/${courseId}/course-progress`)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Progress</span>
              </button>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {currentCourse.courseTitle}
                </h1>
                <p className="text-sm text-gray-600">Course Book</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Progress Indicator */}
              {courseProgress?.accessedMaterials?.courseBook && (
                <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                  <BookOpen className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    Material Accessed - 20 Credits
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-4">
              {/* Zoom Controls */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 0.5}
                  className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                
                <span className="text-sm font-medium text-gray-700 min-w-12 text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 3}
                  className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>

              {/* Rotation */}
              <button
                onClick={handleRotate}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Rotate"
              >
                <RotateCw className="h-4 w-4" />
              </button>

              {/* Reset View */}
              <button
                onClick={handleResetView}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Reset View"
              >
                <FileText className="h-4 w-4" />
              </button>

              {/* Page Navigation */}
              {totalPages > 0 && (
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handlePageChange('prev')}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    ‹
                  </button>
                  
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange('next')}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* Share */}
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Share"
              >
                <Share2 className="h-4 w-4" />
                <span className="text-sm">Share</span>
              </button>

              {/* Print */}
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Print"
              >
                <Printer className="h-4 w-4" />
                <span className="text-sm">Print</span>
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
                <span className="text-sm">{isFullscreen ? "Exit" : "Fullscreen"}</span>
              </button>

              {/* Download */}
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Download"
              >
                <Download className="h-4 w-4" />
                <span className="text-sm">Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div 
        ref={pdfContainerRef}
        className="flex-1 bg-gray-900 flex items-center justify-center p-4"
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading course book...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
            <div className="text-center">
              <FileText className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* PDF Display */}
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="relative" style={pdfStyle}>
            {/* Option 1: Using iframe for PDF display */}
            <iframe
              ref={iframeRef}
              src={`${courseBookUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-[70vh]"
              onLoad={handleLoad}
              onError={handleError}
              title={`${currentCourse.courseTitle} - Course Book`}
            />
            
            {/* Option 2: Using object tag (fallback) */}
            {/* <object
              data={courseBookUrl}
              type="application/pdf"
              className="w-full h-[70vh]"
              onLoad={handleLoad}
              onError={handleError}
            >
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-600">
                  Your browser doesn't support PDF viewing. 
                  <a 
                    href={courseBookUrl} 
                    className="text-blue-600 hover:underline ml-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download the PDF instead.
                  </a>
                </p>
              </div>
            </object> */}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Toolbar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.5}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            
            <span className="text-sm font-medium">
              {Math.round(zoomLevel * 100)}%
            </span>
            
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
          </div>

          <button
            onClick={handleDownload}
            className="p-2 bg-blue-600 text-white rounded-lg"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Print Styles */}
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
            
            body {
              background: white !important;
            }
            
            .min-h-screen {
              min-height: auto !important;
            }
          }
        `}
      </style>
    </div>
  )
}

export default ReadCourseBook