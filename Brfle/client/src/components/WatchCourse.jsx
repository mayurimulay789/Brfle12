"use client"

import { useEffect, useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Settings,
  Maximize,
  ChevronLeft,
  CheckCircle,
  Circle,
  Clock,
  BookOpen,
  Download,
  MessageSquare
} from "lucide-react"
import { fetchCourseLessons } from "../store/slices/lessonSlice"
import { fetchCourseProgress, completeLesson } from "../store/slices/enrollmentSlice"

const WatchCourse = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { courseId } = useParams()
  
  const { lessons, loading: lessonsLoading } = useSelector((state) => state.lessons)
  const { courseProgress, loading: progressLoading } = useSelector((state) => state.enrollments)
  const { currentCourse } = useSelector((state) => state.courses)
  const { user } = useSelector((state) => state.auth)

  const videoRef = useRef(null)
  const [currentLesson, setCurrentLesson] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const [videoError, setVideoError] = useState(null)
  const [autoMarkCompleted, setAutoMarkCompleted] = useState(false)
  const [manuallyMarked, setManuallyMarked] = useState(false)

  const loading = lessonsLoading || progressLoading

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseLessons(courseId))
      dispatch(fetchCourseProgress(courseId))
    }
  }, [courseId, dispatch])

  useEffect(() => {
    if (lessons.length > 0 && !currentLesson) {
      // Set first uncompleted lesson as current
      const firstUncompletedLesson = lessons.find(lesson => 
        !isLessonCompleted(lesson._id)
      ) || lessons[0]
      setCurrentLesson(firstUncompletedLesson)
    }
  }, [lessons, currentLesson])

  // Reset manual mark when lesson changes
  useEffect(() => {
    if (currentLesson) {
      setManuallyMarked(false)
      setAutoMarkCompleted(false)
    }
  }, [currentLesson])

  const isLessonCompleted = (lessonId) => {
    return courseProgress?.completedLessons?.some(
      completed => completed.lesson === lessonId
    ) || false
  }

  const handleLessonClick = (lesson) => {
    setCurrentLesson(lesson)
    setIsPlaying(true)
    setProgress(0)
    setCurrentTime(0)
    setVideoError(null)
    setManuallyMarked(false)
    setAutoMarkCompleted(false)
    
    // Reset video playback
    if (videoRef.current) {
      videoRef.current.currentTime = 0
    }
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
  }

  const handleToggleMute = () => {
    const newMutedState = !isMuted
    setIsMuted(newMutedState)
    if (videoRef.current) {
      videoRef.current.muted = newMutedState
    }
  }

  const handleProgressChange = (e) => {
    const newProgress = parseFloat(e.target.value)
    const newTime = (newProgress / 100) * duration
    
    setProgress(newProgress)
    setCurrentTime(newTime)
    
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
    }
  }

  const handleTimeUpdate = (e) => {
    const video = e.target
    const current = video.currentTime
    const total = video.duration
    
    setCurrentTime(current)
    setDuration(total)
    setProgress((current / total) * 100)

    // Auto-mark as completed when 95% watched and not already marked
    if (current / total >= 0.95 && currentLesson && !isLessonCompleted(currentLesson._id) && !manuallyMarked && !autoMarkCompleted) {
      handleAutoMarkAsCompleted()
    }
  }

  const handleAutoMarkAsCompleted = () => {
    if (currentLesson && courseId && !manuallyMarked && !autoMarkCompleted) {
      setAutoMarkCompleted(true)
      dispatch(completeLesson({ 
        courseId, 
        lessonId: currentLesson._id 
      })).then(() => {
        // Auto-play next lesson after a short delay
        setTimeout(() => {
          const nextLesson = getNextLesson()
          if (nextLesson) {
            handleLessonClick(nextLesson)
          }
        }, 2000) // 2 second delay before auto-playing next lesson
      })
    }
  }

  const handleManualMarkAsCompleted = () => {
    if (currentLesson && courseId && !isLessonCompleted(currentLesson._id)) {
      setManuallyMarked(true)
      dispatch(completeLesson({ 
        courseId, 
        lessonId: currentLesson._id 
      })).then(() => {
        // Auto-play next lesson immediately when manually marked
        const nextLesson = getNextLesson()
        if (nextLesson) {
          handleLessonClick(nextLesson)
        }
      })
    }
  }

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate)
    setShowSettings(false)
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
    }
  }

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00"
    
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getNextLesson = () => {
    if (!currentLesson || lessons.length === 0) return null
    
    const currentIndex = lessons.findIndex(lesson => lesson._id === currentLesson._id)
    return currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null
  }

  const handleNextLesson = () => {
    const nextLesson = getNextLesson()
    if (nextLesson) {
      handleLessonClick(nextLesson)
    }
  }

  const handleVideoError = (error) => {
    console.error('Video error:', error)
    setVideoError('Failed to load video. Please try again.')
  }

  const handleLoadedMetadata = (e) => {
    setDuration(e.target.duration)
  }

  const handleFullscreen = () => {
    const videoElement = document.getElementById('video-player')
    if (videoElement) {
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen()
      } else if (videoElement.webkitRequestFullscreen) {
        videoElement.webkitRequestFullscreen()
      } else if (videoElement.mozRequestFullScreen) {
        videoElement.mozRequestFullScreen()
      } else if (videoElement.msRequestFullscreen) {
        videoElement.msRequestFullscreen()
      }
    }
  }

  const downloadResource = (resource) => {
    const link = document.createElement('a')
    link.href = resource.file.url
    link.download = resource.title || 'resource'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Calculate total completed lessons for progress
  const completedLessonsCount = lessons.filter(lesson => 
    isLessonCompleted(lesson._id)
  ).length

  const totalDuration = lessons.reduce((total, lesson) => {
    const time = parseInt(lesson.duration) || 0
    return total + time
  }, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            {/* Header Skeleton */}
            <div className="h-16 bg-gray-200"></div>
            
            <div className="flex">
              {/* Video Player Skeleton */}
              <div className="flex-1 bg-gray-300 aspect-video"></div>
              
              {/* Lessons List Skeleton */}
              <div className="w-80 bg-white border-l border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="p-4 border-b border-gray-100">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!lessons || lessons.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Lessons Available</h2>
          <p className="text-gray-600 mb-4">This course doesn't have any lessons yet.</p>
          <button
            onClick={() => navigate(`/course/${courseId}/course-progress`)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Course
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/course/${courseId}/course-progress`)}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Back to Course</span>
              </button>
              
              <div className="border-l border-gray-600 h-6"></div>
              
              <div>
                <h1 className="text-lg font-semibold">
                  {currentCourse?.courseTitle || 'Course'}
                </h1>
                <p className="text-sm text-gray-400">
                  {completedLessonsCount} of {lessons.length} lessons completed • {Math.round((completedLessonsCount / lessons.length) * 100)}%
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{Math.round(totalDuration / 60)}h total</span>
              </div>
              
              <div className="w-32 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(completedLessonsCount / lessons.length) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex">
          {/* Main Video Player Section */}
          <div className="flex-1">
            <div className="bg-black relative">
              {/* Video Player */}
              {currentLesson ? (
                <div className="relative aspect-video bg-black">
                  <video
                    id="video-player"
                    ref={videoRef}
                    src={currentLesson.video?.url}
                    className="w-full h-full"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onError={handleVideoError}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    autoPlay={isPlaying}
                    muted={isMuted}
                    playbackRate={playbackRate}
                  />
                  
                  {videoError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                      <div className="text-center">
                        <p className="text-red-400 mb-4">{videoError}</p>
                        <button
                          onClick={() => setVideoError(null)}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Completion Notification */}
                  {(autoMarkCompleted || manuallyMarked) && (
                    <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5" />
                        <span>Lesson marked as completed!</span>
                      </div>
                      {getNextLesson() && (
                        <p className="text-sm mt-1">Playing next lesson in 2 seconds...</p>
                      )}
                    </div>
                  )}

                  {/* Video Controls Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={handleProgressChange}
                        className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={handlePlayPause}
                          className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                        >
                          {isPlaying ? (
                            <Pause className="h-6 w-6" />
                          ) : (
                            <Play className="h-6 w-6" />
                          )}
                        </button>

                        <button
                          onClick={handleToggleMute}
                          className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX className="h-5 w-5" />
                          ) : (
                            <Volume2 className="h-5 w-5" />
                          )}
                        </button>

                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />

                        <div className="text-sm text-gray-300">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Playback Rate Settings */}
                        <div className="relative">
                          <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                          >
                            <Settings className="h-5 w-5" />
                          </button>

                          {showSettings && (
                            <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-lg p-2 min-w-32">
                              <div className="text-xs text-gray-400 mb-2 px-2">Playback Speed</div>
                              {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                                <button
                                  key={rate}
                                  onClick={() => handlePlaybackRateChange(rate)}
                                  className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-700 ${
                                    playbackRate === rate ? 'text-blue-400' : 'text-white'
                                  }`}
                                >
                                  {rate}x
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={handleFullscreen}
                          className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                        >
                          <Maximize className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Select a lesson to start watching</p>
                  </div>
                </div>
              )}

              {/* Lesson Info */}
              {currentLesson && (
                <div className="p-6 bg-gray-800">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-2">
                        {currentLesson.lessonTitle}
                      </h2>
                      <p className="text-gray-300 text-sm">
                        {currentLesson.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {isLessonCompleted(currentLesson._id) ? (
                        <div className="flex items-center space-x-2 text-green-400">
                          <CheckCircle className="h-5 w-5" />
                          <span className="text-sm">Completed</span>
                        </div>
                      ) : (
                        <button
                          onClick={handleManualMarkAsCompleted}
                          disabled={manuallyMarked || autoMarkCompleted}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                            manuallyMarked || autoMarkCompleted
                              ? 'bg-green-600 text-white cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>
                            {manuallyMarked || autoMarkCompleted ? 'Marking...' : 'Mark Complete'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Lesson Resources */}
                  {currentLesson.resources && currentLesson.resources.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-300 mb-2">Resources</h3>
                      <div className="flex flex-wrap gap-2">
                        {currentLesson.resources.map((resource, index) => (
                          <button
                            key={index}
                            onClick={() => downloadResource(resource)}
                            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors text-sm"
                          >
                            <Download className="h-4 w-4" />
                            <span>{resource.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Next Lesson Button */}
                  {getNextLesson() && (
                    <div className="mt-6 pt-4 border-t border-gray-700">
                      <button
                        onClick={handleNextLesson}
                        className="w-full bg-blue-600 hover:bg-blue-700 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        <Play className="h-4 w-4" />
                        <span>Next: {getNextLesson().lessonTitle}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Lessons List Sidebar */}
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col h-[calc(100vh-4rem)]">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-semibold">Course Content</h3>
              <p className="text-sm text-gray-400 mt-1">
                {lessons.length} lessons • {Math.round(totalDuration / 60)}h
              </p>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-2">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson._id}
                    onClick={() => handleLessonClick(lesson)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                      currentLesson?._id === lesson._id
                        ? 'bg-blue-600 text-white'
                        : isLessonCompleted(lesson._id)
                        ? 'bg-green-900 text-green-100'
                        : 'hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {isLessonCompleted(lesson._id) ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <Circle className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className={`text-sm font-medium ${
                            currentLesson?._id === lesson._id ? 'text-white' : 
                            isLessonCompleted(lesson._id) ? 'text-green-100' : 'text-gray-200'
                          }`}>
                            {index + 1}. {lesson.lessonTitle}
                          </h4>
                          {lesson.isPreview && (
                            <span className="text-xs bg-yellow-500 text-yellow-900 px-2 py-1 rounded ml-2">
                              Preview
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <Play className="h-3 w-3" />
                            <span>{lesson.duration}</span>
                          </div>
                          
                          {currentLesson?._id === lesson._id && isPlaying && (
                            <div className="flex items-center space-x-1 text-xs text-blue-400">
                              <div className="flex space-x-1">
                                <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                                <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                              </div>
                              <span>Playing</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Progress Footer */}
            <div className="p-4 border-t border-gray-700 bg-gray-900">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">
                  Course Progress
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(completedLessonsCount / lessons.length) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="text-xs text-gray-400">
                  {completedLessonsCount} of {lessons.length} lessons completed
                </div>
                <div className="text-xs text-green-400 mt-1">
                  {Math.round((completedLessonsCount / lessons.length) * 100)}% Complete
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}

export default WatchCourse