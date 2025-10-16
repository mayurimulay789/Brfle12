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
  const [pdfViewerType, setPdfViewerType] = useState('iframe')
  const [urlStatus, setUrlStatus] = useState('checking')
  const [actualUrl, setActualUrl] = useState('')

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

  // Fix Cloudinary URL for PDF delivery
  const fixCloudinaryUrl = (url) => {
    console.log("🔧 Fixing Cloudinary URL:", url)
    
    let fixedUrl = url
    
    // If it's a Cloudinary raw upload URL, we need to transform it for PDF delivery
    if (url.includes('cloudinary.com') && url.includes('/raw/upload/')) {
      // Cloudinary raw uploads need special handling for PDFs
      // Option 1: Try adding .pdf extension
      if (!url.includes('.pdf')) {
        fixedUrl = `${url}.pdf`
        console.log("📄 Added .pdf extension:", fixedUrl)
      }
      
      // Option 2: Use Cloudinary's transformation for forced download
      // fixedUrl = url.replace('/raw/upload/', '/fl_attachment/raw/upload/')
    }
    
    // If it's a Cloudinary URL but serving as octet-stream, try different approaches
    if (url.includes('cloudinary.com')) {
      console.log("☁️ Cloudinary URL detected, trying different delivery methods...")
      
      // Method 1: Direct URL with extension
      const method1 = `${url}.pdf`
      
      // Method 2: Force attachment (download)
      const method2 = url.replace('/upload/', '/fl_attachment/upload/')
      
      // Method 3: Use raw delivery with explicit format
      const method3 = url.includes('/raw/upload/') ? url : `${url}?format=pdf`
      
      console.log("🔄 Method 1 (with extension):", method1)
      console.log("🔄 Method 2 (attachment):", method2)
      console.log("🔄 Method 3 (raw):", method3)
      
      // Start with method 1
      fixedUrl = method1
    }
    
    return fixedUrl
  }

  // Validate and fix the URL
  const validateAndFixUrl = async (url) => {
    try {
      setUrlStatus('validating')
      console.log("🔧 Validating URL:", url)
      
      let fixedUrl = fixCloudinaryUrl(url)
      setActualUrl(fixedUrl)
      
      // Test if the fixed URL is accessible
      await testUrlAccessibility(fixedUrl, url)
      
    } catch (error) {
      console.error("❌ URL validation failed:", error)
      setUrlStatus('validation-failed')
      setError("Failed to validate PDF URL: " + error.message)
      setLoading(false)
    }
  }

  // Test URL accessibility with multiple fallbacks
  const testUrlAccessibility = async (url, originalUrl) => {
    try {
      setUrlStatus('testing-access')
      console.log("🧪 Testing URL accessibility:", url)
      
      const response = await fetch(url, { 
        method: 'GET',
        headers: {
          'Accept': 'application/pdf, */*'
        }
      })
      
      console.log("📊 Response status:", response.status)
      console.log("📊 Response headers:", Object.fromEntries(response.headers))
      
      if (response.ok) {
        const contentType = response.headers.get('content-type')
        console.log("📄 Content-Type:", contentType)
        
        if (contentType && (contentType.includes('application/pdf') || url.includes('.pdf'))) {
          console.log("✅ Valid PDF URL")
          setUrlStatus('valid-pdf')
          setError(null)
          
          // Test if we can actually display it
          await testPdfDisplay(url)
        } else {
          console.log("⚠️ URL accessible but Content-Type:", contentType)
          
          // Try alternative Cloudinary URL formats
          await tryAlternativeUrls(originalUrl)
        }
      } else {
        console.log("❌ URL returned status:", response.status)
        // Try alternative URLs if this one fails
        await tryAlternativeUrls(originalUrl)
      }
      
    } catch (error) {
      console.log("❌ URL accessibility test failed:", error)
      // Try alternative URLs
      await tryAlternativeUrls(originalUrl)
    }
  }

  // Try alternative Cloudinary URL formats
  const tryAlternativeUrls = async (originalUrl) => {
    console.log("🔄 Trying alternative URL formats...")
    
    const alternatives = [
      // Method 1: Add .pdf extension
      `${originalUrl}.pdf`,
      // Method 2: Force attachment
      originalUrl.replace('/upload/', '/fl_attachment/upload/'),
      // Method 3: Use raw delivery with explicit format
      originalUrl.includes('/raw/upload/') ? originalUrl : `${originalUrl}?format=pdf`,
      // Method 4: Try without the duplicate path
      originalUrl.replace('lms/courses/documents/lms/courses/documents/', 'lms/courses/documents/')
    ]
    
    for (let i = 0; i < alternatives.length; i++) {
      const altUrl = alternatives[i]
      console.log(`🔄 Trying alternative ${i + 1}:`, altUrl)
      
      try {
        const response = await fetch(altUrl, { method: 'HEAD' })
        if (response.ok) {
          console.log(`✅ Alternative ${i + 1} works!`)
          setActualUrl(altUrl)
          setUrlStatus('valid-pdf')
          setError(null)
          return
        }
      } catch (error) {
        console.log(`❌ Alternative ${i + 1} failed:`, error.message)
      }
    }
    
    // If all alternatives fail
    setUrlStatus('all-alternatives-failed')
    setError("Cannot find a working PDF URL. The file might be missing or in wrong format.")
    setLoading(false)
  }

  // Test if PDF can actually be displayed
  const testPdfDisplay = async (url) => {
    try {
      console.log("🎯 Testing PDF display capability...")
      const response = await fetch(url)
      const blob = await response.blob()
      
      console.log("📦 Blob type:", blob.type)
      console.log("📦 Blob size:", blob.size)
      
      if (blob.type.includes('pdf') || blob.size > 1000) {
        // Likely a valid PDF
        console.log("✅ PDF appears valid")
        setUrlStatus('valid-pdf')
      } else {
        console.log("❌ Blob doesn't appear to be PDF")
        setUrlStatus('invalid-pdf-blob')
        setError("The file doesn't appear to be a valid PDF")
      }
    } catch (error) {
      console.log("❌ PDF display test failed:", error)
      setUrlStatus('display-test-failed')
      setError("Cannot load PDF content: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Mark material as accessed when component mounts
  useEffect(() => {
    if (courseId && projectBookUrl && !courseProgress?.accessedMaterials?.projectBook) {
      console.log("📝 Marking project book as accessed")
      dispatch(markMaterialAccessed({ courseId, materialType: 'projectBook' }))
    }
  }, [courseId, dispatch, courseProgress, projectBookUrl])

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
      const link = document.createElement('a')
      link.href = urlToUse
      link.download = `${currentCourse?.courseTitle || 'course'}-project-guide.pdf`
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      alert("No valid PDF URL available for download")
    }
  }

  const handlePrint = () => {
    const urlToUse = actualUrl || projectBookUrl
    console.log("🖨️ Print clicked, URL:", urlToUse)
    
    if (urlToUse) {
      const printWindow = window.open(urlToUse, '_blank')
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print()
        }
      }
    } else {
      alert("No valid PDF URL available for printing")
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
    console.log("✅ PDF loaded successfully")
    setLoading(false)
    setError(null)
  }

  const handleError = (error) => {
    console.error('❌ PDF loading error:', error)
    setLoading(false)
    setError('Failed to load the project guide. The file may be corrupted or unavailable.')
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
      alert("No valid PDF URL available")
    }
  }

  const retryValidation = () => {
    setLoading(true)
    setError(null)
    setUrlStatus('checking')
    validateAndFixUrl(projectBookUrl)
  }

  // Google Docs viewer URL (fallback)
  const googleViewerUrl = (actualUrl || projectBookUrl) ? 
    `https://docs.google.com/gview?url=${encodeURIComponent(actualUrl || projectBookUrl)}&embedded=true` : null

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
            <h3 className="text-sm font-semibold text-blue-800">URL Status: 
              <span className={`ml-2 ${
                urlStatus === 'valid-pdf' ? 'text-green-600' : 
                urlStatus.startsWith('http-error') ? 'text-red-600' :
                'text-yellow-600'
              }`}>
                {urlStatus}
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
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <strong>Original URL:</strong> 
                <div className="break-all text-blue-600 mt-1">{projectBookUrl}</div>
              </div>
              {actualUrl && actualUrl !== projectBookUrl && (
                <div>
                  <strong>Processed URL:</strong> 
                  <div className="break-all text-green-600 mt-1">{actualUrl}</div>
                </div>
              )}
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
                  <option value="iframe">Browser PDF Viewer</option>
                  <option value="google">Google Docs Viewer</option>
                  <option value="direct">Direct Link</option>
                </select>
              </div>

              {urlStatus === 'valid-pdf' && (
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
                disabled={!projectBookUrl}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                <Printer className="h-4 w-4" />
                <span className="text-sm hidden sm:inline">Print</span>
              </button>

              <button
                onClick={handleDownload}
                disabled={!projectBookUrl}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                <span className="text-sm">Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div ref={pdfContainerRef} className="flex-1 bg-gray-900 flex items-center justify-center p-4">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading project guide...</p>
              <p className="text-sm text-gray-500 mt-2">Status: {urlStatus}</p>
            </div>
          </div>
        )}

        {urlStatus === 'valid-pdf' ? (
          <div className="w-full max-w-6xl bg-white rounded-lg shadow-2xl overflow-hidden">
            <div className="relative" style={pdfStyle}>
              {pdfViewerType === 'iframe' && (
                <iframe
                  ref={iframeRef}
                  src={`${actualUrl || projectBookUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-[75vh]"
                  onLoad={handleLoad}
                  onError={handleError}
                  title={`${currentCourse.courseTitle} - Project Guide`}
                  allow="fullscreen"
                />
              )}

              {pdfViewerType === 'google' && googleViewerUrl && (
                <iframe
                  src={googleViewerUrl}
                  className="w-full h-[75vh]"
                  onLoad={handleLoad}
                  onError={() => handleError('Google viewer failed')}
                  title={`${currentCourse.courseTitle} - Project Guide (Google Viewer)`}
                  allow="fullscreen"
                />
              )}

              {pdfViewerType === 'direct' && (
                <div className="flex flex-col items-center justify-center h-[75vh] p-8 text-center">
                  <FileText className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF Ready</h3>
                  <p className="text-gray-600 mb-6">Click below to open the PDF directly</p>
                  <button
                    onClick={openInNewTab}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <ExternalLink className="h-5 w-5" />
                    <span>Open PDF in New Tab</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden">
            <div className="flex flex-col items-center justify-center h-[75vh] p-8 text-center">
              <AlertCircle className="h-16 w-16 text-yellow-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF Not Available</h3>
              <p className="text-gray-600 mb-4">
                {urlStatus === 'no-url' && "No PDF URL found for this course."}
                {urlStatus === 'not-pdf' && "The URL does not point to a valid PDF file."}
                {urlStatus === 'all-alternatives-failed' && "All alternative URL formats failed."}
                {urlStatus === 'invalid-pdf-blob' && "The file doesn't appear to be a valid PDF."}
                {urlStatus === 'display-test-failed' && "Cannot load PDF content."}
              </p>
              <div className="space-y-2">
                <button
                  onClick={retryValidation}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Retry Loading
                </button>
                <button
                  onClick={() => navigate(`/course/${courseId}/course-progress`)}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Back to Course Progress
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReadProjectBook