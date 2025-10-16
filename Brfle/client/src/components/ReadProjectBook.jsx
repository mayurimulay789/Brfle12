"use client"

import { useState, useRef, useEffect } from "react"
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
  Minimize2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw
} from "lucide-react"
import { markMaterialAccessed } from "../store/slices/enrollmentSlice"

const ReadProjectBook = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { courseId } = useParams()
  
  const { currentCourse } = useSelector((state) => state.courses)
  const { courseProgress } = useSelector((state) => state.enrollments)
  const { user } = useSelector((state) => state.auth)

  const [zoomLevel, setZoomLevel] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pdfViewerType, setPdfViewerType] = useState('direct') // Default to direct options
  const [urlStatus, setUrlStatus] = useState('checking')
  const [actualUrl, setActualUrl] = useState('')
  const [fileBlobUrl, setFileBlobUrl] = useState('')

  const pdfContainerRef = useRef(null)
  const iframeRef = useRef(null)

  // Get project book URL from course data
  const projectBookUrl = currentCourse?.projectPDF?.url || currentCourse?.projectPDF?.public_id

  // Debug and validate URL
  useEffect(() => {
    console.log("🔍 DEBUG ReadProjectBook:")
    console.log("courseId:", courseId)
    console.log("currentCourse:", currentCourse)
    console.log("projectBookUrl:", projectBookUrl)
    console.log("Full projectPDF object:", currentCourse?.projectPDF)
    
    if (projectBookUrl) {
      validateAndFixUrl(projectBookUrl)
    } else {
      setUrlStatus('no-url')
      setLoading(false)
    }
  }, [courseId, currentCourse, projectBookUrl])

  // Fix Cloudinary URL for PDF display
  const fixCloudinaryUrl = (url) => {
    console.log("🔧 Fixing Cloudinary URL:", url)
    
    if (!url) return null
    
    // If it's already a working URL, return it
    if (url.includes('.pdf')) return url
    
    // For Cloudinary raw URLs, add .pdf extension
    if (url.includes('cloudinary.com') && url.includes('/raw/upload/')) {
      // Fix duplicate path if exists
      if (url.includes('lms/courses/documents/lms/courses/documents/')) {
        const fixedPathUrl = url.replace('lms/courses/documents/lms/courses/documents/', 'lms/courses/documents/')
        console.log("🔄 Fixed duplicate path URL:", fixedPathUrl)
        return `${fixedPathUrl}.pdf`
      }
      
      return `${url}.pdf`
    }
    
    return url
  }

  // Download file and create blob URL for direct display
  const createBlobUrl = async (url) => {
    try {
      console.log("📥 Downloading file for blob creation...")
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const blob = await response.blob()
      console.log("📦 File blob:", blob.type, blob.size)
      
      // Create blob URL for direct display
      const blobUrl = URL.createObjectURL(blob)
      setFileBlobUrl(blobUrl)
      return blobUrl
    } catch (error) {
      console.error("❌ Failed to create blob URL:", error)
      throw error
    }
  }

  // Simple URL validation
  const validateAndFixUrl = async (url) => {
    try {
      setUrlStatus('validating')
      setLoading(true)
      
      let fixedUrl = fixCloudinaryUrl(url)
      console.log("🔄 Fixed URL:", fixedUrl)
      setActualUrl(fixedUrl)
      
      // Test if URL is accessible
      try {
        const response = await fetch(fixedUrl, { method: 'HEAD' })
        if (response.ok) {
          setUrlStatus('valid-pdf')
          setError(null)
          
          // Try to create blob URL for direct display
          try {
            await createBlobUrl(fixedUrl)
          } catch (blobError) {
            console.log("⚠️ Could not create blob URL, using direct URL")
          }
        } else {
          setUrlStatus('not-accessible')
          setError(`File returned status: ${response.status}`)
        }
      } catch (fetchError) {
        setUrlStatus('network-error')
        setError('Cannot access file')
      }
      
      setLoading(false)
      
    } catch (error) {
      console.error("URL validation failed:", error)
      setUrlStatus('error')
      setError("Failed to validate file URL")
      setLoading(false)
    }
  }

  // Simple status message helper
  const getStatusMessage = (status) => {
    const messages = {
      'checking': 'Checking file...',
      'validating': 'Validating file URL...',
      'valid-pdf': 'File ready for display',
      'no-url': 'No file URL found for this course',
      'not-accessible': 'File not accessible',
      'network-error': 'Network error',
      'error': 'Failed to load file'
    }
    return messages[status] || 'Loading...'
  }

  // Mark material as accessed when component mounts
  useEffect(() => {
    if (courseId && projectBookUrl && !courseProgress?.accessedMaterials?.projectBook) {
      console.log("📝 Marking project book as accessed")
      dispatch(markMaterialAccessed({ courseId, materialType: 'projectBook' }))
    }
  }, [courseId, dispatch, courseProgress, projectBookUrl])

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (fileBlobUrl) {
        URL.revokeObjectURL(fileBlobUrl)
      }
    }
  }, [fileBlobUrl])

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

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

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await pdfContainerRef.current?.requestFullscreen?.()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen?.()
        setIsFullscreen(false)
      }
    } catch (err) {
      console.error('Fullscreen error:', err)
    }
  }

  const handleDownload = () => {
    const urlToUse = actualUrl || projectBookUrl
    console.log("📥 Download clicked, URL:", urlToUse)
    
    if (urlToUse) {
      // For Cloudinary URLs, force download
      let downloadUrl = urlToUse
      if (urlToUse.includes('cloudinary.com')) {
        if (!urlToUse.includes('fl_attachment')) {
          downloadUrl = urlToUse.replace('/upload/', '/fl_attachment/upload/')
        }
        // Ensure .pdf extension for download
        if (!downloadUrl.includes('.pdf')) {
          downloadUrl = `${downloadUrl}.pdf`
        }
      }
      
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `${currentCourse?.courseTitle || 'course'}-project-guide.pdf`
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      alert("No valid file URL available for download")
    }
  }

  const handlePrint = () => {
    const urlToUse = actualUrl || projectBookUrl
    console.log("🖨️ Print clicked, URL:", urlToUse)
    
    if (urlToUse) {
      // Open in new tab and print
      const printWindow = window.open(urlToUse, '_blank')
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print()
        }
      }
    } else {
      alert("No valid file URL available for printing")
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: `${currentCourse?.courseTitle} - Project Guide`,
      text: `Check out the project guide for ${currentCourse?.courseTitle}`,
      url: window.location.href,
    }

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.log('Sharing failed:', error)
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      } catch (err) {
        alert('Failed to copy link. Please copy the URL manually.')
      }
    }
  }

  const handleLoad = () => {
    console.log("✅ File loaded successfully")
    setLoading(false)
    setError(null)
  }

  const handleError = (error) => {
    console.error('❌ File loading error:', error)
    setLoading(false)
    setError('Failed to load the project guide. Try downloading the file instead.')
  }

  const switchViewer = (viewerType) => {
    console.log("🔄 Switching viewer to:", viewerType)
    setPdfViewerType(viewerType)
    setLoading(true)
    setError(null)
  }

  const openInNewTab = () => {
    const urlToUse = actualUrl || projectBookUrl
    if (urlToUse) {
      window.open(urlToUse, '_blank')
    } else {
      alert("No valid file URL available")
    }
  }

  const retryValidation = () => {
    setLoading(true)
    setError(null)
    setUrlStatus('checking')
    validateAndFixUrl(projectBookUrl)
  }

  // PDF display styles
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

  if (!projectBookUrl) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Project Guide Not Available</h2>
          <p className="text-gray-600 mb-4">
            The project guide for this course is not available yet.
            <br />
            <strong>Course:</strong> {currentCourse.courseTitle}
          </p>
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
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 no-print">
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
                <p className="text-sm text-gray-600">Project Guide</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={openInNewTab}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="text-sm">Open in New Tab</span>
              </button>

              {courseProgress?.accessedMaterials?.projectBook && (
                <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    Project Guide Accessed
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Debug Panel */}
      <div className="bg-blue-50 border-b border-blue-200 p-4 no-print">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-blue-800">Status: 
              <span className={`ml-2 ${
                urlStatus === 'valid-pdf' ? 'text-green-600' : 
                'text-red-600'
              }`}>
                {getStatusMessage(urlStatus)}
              </span>
            </h3>
            <button
              onClick={retryValidation}
              className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Retry</span>
            </button>
          </div>
          
          {projectBookUrl && (
            <div className="mt-2 text-xs">
              <div>
                <strong>File URL:</strong> 
                <div className="break-all text-blue-600 mt-1">{actualUrl || projectBookUrl}</div>
              </div>
              <div className="mt-1 text-orange-600">
                <strong>Note:</strong> Use "Download" or "Open in New Tab" for best results
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 p-4 no-print">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 mr-4">
                <span className="text-sm text-gray-600">Viewer:</span>
                <select 
                  value={pdfViewerType}
                  onChange={(e) => switchViewer(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                  disabled={urlStatus !== 'valid-pdf'}
                >
                  <option value="direct">Download Options</option>
                  <option value="iframe">Browser Viewer</option>
                </select>
              </div>

              {urlStatus === 'valid-pdf' && pdfViewerType === 'iframe' && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 0.5}
                    className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 transition-colors"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  
                  <span className="text-sm font-medium text-gray-700 min-w-12 text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  
                  <button
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 3}
                    className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 transition-colors"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={handleRotate}
                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <RotateCw className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                disabled={urlStatus !== 'valid-pdf'}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                <Printer className="h-4 w-4" />
                <span className="text-sm hidden sm:inline">Print</span>
              </button>

              <button
                onClick={handleDownload}
                disabled={urlStatus !== 'valid-pdf'}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                <span className="text-sm">Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* File Viewer */}
      <div ref={pdfContainerRef} className="flex-1 bg-gray-900 flex items-center justify-center p-4">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading project guide...</p>
              <p className="text-sm text-gray-500 mt-2">{getStatusMessage(urlStatus)}</p>
            </div>
          </div>
        )}

        {urlStatus === 'valid-pdf' && actualUrl ? (
          <div className="w-full max-w-6xl bg-white rounded-lg shadow-2xl overflow-hidden">
            <div className="relative" style={pdfStyle}>
              {/* Direct Options - Most reliable */}
              {pdfViewerType === 'direct' && (
                <div className="flex flex-col items-center justify-center h-[75vh] p-8 text-center">
                  <FileText className="h-20 w-20 text-blue-500 mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Project Guide Ready</h3>
                  <p className="text-gray-600 mb-8 text-lg max-w-md">
                    Choose how you want to access the project guide file:
                  </p>
                  <div className="space-y-4 w-full max-w-md">
                    <button
                      onClick={handleDownload}
                      className="w-full bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-3 text-lg font-medium"
                    >
                      <Download className="h-6 w-6" />
                      <span>Download File</span>
                    </button>
                    
                    <button
                      onClick={openInNewTab}
                      className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-3 text-lg font-medium"
                    >
                      <ExternalLink className="h-6 w-6" />
                      <span>Open in New Tab</span>
                    </button>
                    
                    <button
                      onClick={() => switchViewer('iframe')}
                      className="w-full bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-3 text-lg font-medium"
                    >
                      <BookOpen className="h-6 w-6" />
                      <span>Try Browser Viewer</span>
                    </button>
                  </div>
                  
                  <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200 max-w-md">
                    <p className="text-yellow-800 text-sm text-center">
                      <strong>Tip:</strong> "Download" or "Open in New Tab" usually work best for Cloudinary files.
                    </p>
                  </div>
                </div>
              )}

              {/* Browser PDF Viewer - may work for some files */}
              {pdfViewerType === 'iframe' && (
                <>
                  <iframe
                    ref={iframeRef}
                    src={fileBlobUrl || actualUrl}
                    className="w-full h-[75vh]"
                    onLoad={handleLoad}
                    onError={handleError}
                    title={`${currentCourse.courseTitle} - Project Guide`}
                    allow="fullscreen"
                  />
                  {!fileBlobUrl && (
                    <div className="absolute bottom-4 left-4 bg-yellow-100 text-yellow-800 px-3 py-2 rounded text-sm">
                      Using direct URL - may not display in all browsers
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden">
            <div className="flex flex-col items-center justify-center h-[75vh] p-8 text-center">
              <AlertCircle className="h-16 w-16 text-yellow-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {loading ? 'Loading File...' : 'File Not Available'}
              </h3>
              <p className="text-gray-600 mb-4">
                {error || 'The project guide file could not be loaded.'}
              </p>
              <div className="space-y-2 w-full max-w-xs">
                <button
                  onClick={retryValidation}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Retry Loading
                </button>
                <button
                  onClick={() => navigate(`/course/${courseId}/course-progress`)}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Back to Course Progress
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <iframe src="https://res.cloudinary.com/dfrga8wea/raw/upload/v1760606926/lms/courses/documents/screencapture-localhost-3000-2025-09-27-10_26_30%20%281%29_1760606883857" 
            width="100%" 
            height="600px">
    </iframe>
    </div>  
  )
}

export default ReadProjectBook