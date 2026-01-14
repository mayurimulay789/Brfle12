// "use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Download,
  Maximize2,
  Minimize2,
  Home,
  Eye
} from "lucide-react"
import { markMaterialAccessed } from "../store/slices/enrollmentSlice"

const ReadProjectBook = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { courseId } = useParams()

  const { currentCourse } = useSelector((state) => state.courses)
  const { courseProgress } = useSelector((state) => state.enrollments)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)

  // ✅ Direct URL (NO modification)
  const projectBookUrl = currentCourse?.projectPDF?.url

  // ✅ Mark as accessed
  useEffect(() => {
    if (courseId && projectBookUrl && !courseProgress?.accessedMaterials?.projectBook) {
      dispatch(markMaterialAccessed({ courseId, materialType: "projectBook" }))
    }
  }, [courseId, projectBookUrl, courseProgress, dispatch])

  // ✅ Fullscreen handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const handleDownload = () => {
    if (!projectBookUrl) return
    const link = document.createElement("a")
    link.href = projectBookUrl
    link.download = `${currentCourse?.courseTitle || "course"}-project-guide.pdf`
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getPDFjsUrl = () => {
    if (!projectBookUrl) return ""
    return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(
      projectBookUrl
    )}`
  }

  if (!currentCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Course not found</p>
      </div>
    )
  }

  if (!projectBookUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Project guide not available</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/course/${courseId}/course-progress`)}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div>
              <h1 className="font-bold text-gray-900 truncate">
                {currentCourse.courseTitle}
              </h1>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                Project Guide
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowControls(!showControls)}
              className="sm:hidden p-2"
            >
              <Eye className="h-5 w-5" />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-gray-100 rounded"
            >
              {isFullscreen ? (
                <Minimize2 className="h-5 w-5" />
              ) : (
                <Maximize2 className="h-5 w-5" />
              )}
            </button>

            
          </div>
        </div>
      </header>

      {/* Viewer */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="relative bg-white rounded-xl shadow border overflow-hidden">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <p className="text-gray-600">Loading project guide...</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div style={{ height: isFullscreen ? "calc(100vh - 80px)" : "70vh" }}>
            <iframe
              src={getPDFjsUrl()}
              className="w-full h-full border-0"
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false)
                setError("Failed to load PDF")
              }}
              title="Project Guide PDF"
              allowFullScreen
            />
          </div>

          <div className="border-t px-4 py-3 bg-gray-50 text-sm text-gray-500 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            PDF Viewer powered by PDF.js
          </div>
        </div>
      </main>
    </div>
  )
}

export default ReadProjectBook
