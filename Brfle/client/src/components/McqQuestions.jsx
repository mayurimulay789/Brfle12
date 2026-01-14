"use client"

import { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Send,
  Flag,
  BookOpen,
  Award,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  HelpCircle
} from "lucide-react"
import { addTestAttempt } from "../store/slices/enrollmentSlice"

const McqQuestions = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { courseId } = useParams()
  
  const { currentCourse } = useSelector((state) => state.courses)
  const { courseProgress } = useSelector((state) => state.enrollments)
  const { user } = useSelector((state) => state.auth)

  const [testData, setTestData] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set())
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [result, setResult] = useState(null)

  const timerRef = useRef(null)
  const startTimeRef = useRef(null)

  // Fetch test data when component mounts
  useEffect(() => {
    if (currentCourse?.mcqTest) {
      setTestData(currentCourse.mcqTest)
      setTimeLeft(currentCourse.mcqTest.timeLimit * 60) // Convert minutes to seconds
    }
  }, [currentCourse])

  // Timer effect
  useEffect(() => {
    if (testStarted && timeLeft > 0 && !testCompleted) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleAutoSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [testStarted, testCompleted])

  const startTest = () => {
    setTestStarted(true)
    startTimeRef.current = new Date()
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (questionIndex, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedOption
    }))
  }

  const toggleFlagQuestion = (questionIndex) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(questionIndex)) {
        newSet.delete(questionIndex)
      } else {
        newSet.add(questionIndex)
      }
      return newSet
    })
  }

  const navigateToQuestion = (index) => {
    if (index >= 0 && index < testData.questions.length) {
      setCurrentQuestion(index)
    }
  }

  const calculateScore = () => {
    let correctAnswers = 0
    testData.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++
      }
    })
    
    const percentage = (correctAnswers / testData.questions.length) * 100
    const passed = percentage >= testData.passingScore
    
    return {
      correctAnswers,
      totalQuestions: testData.questions.length,
      percentage: Math.round(percentage),
      passed,
      score: correctAnswers,
      maxScore: testData.questions.length
    }
  }

  const handleAutoSubmit = async () => {
    if (testCompleted) return
    
    const scoreResult = calculateScore()
    const endTime = new Date()
    const timeTaken = Math.round((endTime - startTimeRef.current) / 1000) // in seconds

    const attemptData = {
      answers,
      score: scoreResult.score,
      maxScore: scoreResult.maxScore,
      percentage: scoreResult.percentage,
      passed: scoreResult.passed,
      timeTaken,
      completedAt: endTime.toISOString(),
      flaggedQuestions: Array.from(flaggedQuestions)
    }

    setIsSubmitting(true)
    try {
      await dispatch(addTestAttempt({ courseId, attemptData })).unwrap()
      setResult(scoreResult)
      setTestCompleted(true)
    } catch (error) {
      console.error('Failed to submit test:', error)
      alert('Failed to submit test. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async () => {
    setShowConfirmation(true)
  }

  const confirmSubmit = async () => {
    setShowConfirmation(false)
    await handleAutoSubmit()
  }

  const getQuestionStatus = (index) => {
    if (answers[index] !== undefined) return 'answered'
    if (flaggedQuestions.has(index)) return 'flagged'
    return 'unanswered'
  }

  const getOptionLabel = (index) => {
    return String.fromCharCode(65 + index) // A, B, C, D, etc.
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'hard': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getTimeWarning = () => {
    if (timeLeft <= 300) return 'text-red-600' // 5 minutes
    if (timeLeft <= 600) return 'text-yellow-600' // 10 minutes
    return 'text-gray-600'
  }

  if (!currentCourse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
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

  if (!testData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Test Not Available</h2>
          <p className="text-gray-600 mb-4">The MCQ test for this course is not available yet.</p>
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

  if (testCompleted && result) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(`/course/${courseId}/course-progress`)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Course Progress</span>
            </button>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Test Results - {currentCourse.courseTitle}
            </h1>
            <p className="text-gray-600">Your test has been submitted successfully.</p>
          </div>

          {/* Result Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              result.passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {result.passed ? (
                <Award className="h-10 w-10" />
              ) : (
                <AlertCircle className="h-10 w-10" />
              )}
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {result.passed ? 'Congratulations! Test Passed 🎉' : 'Test Not Passed'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{result.score}/{result.maxScore}</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{result.percentage}%</div>
                <div className="text-sm text-gray-600">Percentage</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {testData.passingScore}%
                </div>
                <div className="text-sm text-gray-600">Passing Score</div>
              </div>
            </div>

            {result.passed ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">You have successfully passed the test!</span>
                </div>
                <p className="text-green-600 text-sm mt-1">
                  Your progress has been updated. You can now proceed to the next section.
                </p>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-yellow-700">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">You need {testData.passingScore}% to pass.</span>
                </div>
                <p className="text-yellow-600 text-sm mt-1">
                  You can retake the test after reviewing the course materials.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate(`/course/${courseId}/course-progress`)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Course Progress
              </button>
              
              {!result.passed && (
                <button
                  onClick={() => {
                    setTestCompleted(false)
                    setTestStarted(false)
                    setCurrentQuestion(0)
                    setAnswers({})
                    setFlaggedQuestions(new Set())
                    setTimeLeft(testData.timeLimit * 60)
                    setResult(null)
                  }}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="text-white ">Retake Test</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(`/course/${courseId}/course-progress`)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Course Progress</span>
            </button>
            
            <h1 className="text-2xl font-bold text-gray-700 mb-1">
              MCQ Test - {currentCourse.courseTitle}
            </h1>
          </div>

          {/* Test Instructions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <BookOpen className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Instructions</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">Duration</p>
                  <p className="text-gray-600">{testData.timeLimit} minutes</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <HelpCircle className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">Total Questions</p>
                  <p className="text-gray-600">{testData.questions.length} questions</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Award className="h-6 w-6 text-yellow-600" />
                <div>
                  <p className="font-semibold text-gray-900">Passing Score</p>
                  <p className="text-gray-600">{testData.passingScore}% required</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Flag className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-900">Question Navigation</p>
                  <p className="text-gray-600">Flag questions for review</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Important Instructions:</h3>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• The test will automatically submit when time expires</li>
                <li>• You cannot pause the test once started</li>
                <li>• Use the flag feature to mark questions for review</li>
                <li>• Navigate between questions using the question palette</li>
                <li>• You must score {testData.passingScore}% or higher to pass</li>
                {testData.allowRetakes && (
                  <li>• You can retake the test if you don't pass</li>
                )}
              </ul>
            </div>

            <div className="text-center">
              <button
                onClick={startTest}
                className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold"
              >
                Start Test
              </button>
              <p className="text-gray-500 text-sm mt-3">
                Clicking "Start Test" will begin the timer immediately
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = testData.questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 py-3 sm:py-0 sm:h-16">
      
      {/* LEFT SECTION */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setShowConfirmation(true)}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Exit Test</span>
        </button>

        <div className="hidden sm:block h-6 w-px bg-gray-300" />

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
            {currentCourse.courseTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">MCQ Test</p>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
        
        {/* Timer */}
        <div className={`flex items-center gap-1 sm:gap-2 ${getTimeWarning()}`}>
          <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="font-mono text-base sm:text-lg font-bold">
            {formatTime(timeLeft)}
          </span>
        </div>

        {/* Progress */}
        <div className="text-right">
          <div className="text-xs sm:text-sm font-medium text-gray-900">
            Q {currentQuestion + 1}/{testData.questions.length}
          </div>
          <div className="text-[11px] sm:text-xs text-gray-600">
            {Object.keys(answers).length} answered • {flaggedQuestions.size} flagged
          </div>
        </div>
      </div>

    </div>
  </div>
</div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Question Palette</h3>
              
              <div className="grid grid-cols-5 gap-2 mb-4">
                {testData.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => navigateToQuestion(index)}
                    className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-all ${
                      currentQuestion === index
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : getQuestionStatus(index) === 'answered'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : getQuestionStatus(index) === 'flagged'
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {index + 1}
                    {flaggedQuestions.has(index) && (
                      <Flag className="h-3 w-3 absolute -top-1 -right-1 text-yellow-500" />
                    )}
                  </button>
                ))}
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-green-500 bg-green-50 rounded"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-yellow-500 bg-yellow-50 rounded"></div>
                  <span>Flagged</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-gray-300 bg-white rounded"></div>
                  <span>Not Visited</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold mt-4 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
                <span className="text-white">{isSubmitting ? 'Submitting...' : 'Submit Test'}</span>
              </button>
            </div>
          </div>

          {/* Question Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Question Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-500">
                    Question {currentQuestion + 1}
                  </span>
                  {currentQ.difficulty && (
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(currentQ.difficulty)}`}>
                      {currentQ.difficulty}
                    </span>
                  )}
                </div>
                
                <button
                  onClick={() => toggleFlagQuestion(currentQuestion)}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors ${
                    flaggedQuestions.has(currentQuestion)
                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Flag className="h-4 w-4" />
                  <span className="text-sm">
                    {flaggedQuestions.has(currentQuestion) ? 'Flagged' : 'Flag'}
                  </span>
                </button>
              </div>

              {/* Question Text */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4 leading-relaxed">
                  {currentQ.question}
                  {console.log(currentQ)};
                </h2>
                
                {currentQ.questionImage && (
                  <div className="mb-4">
                    <img 
                      src={currentQ.questionImage} 
                      alt="Question illustration"
                      className="max-w-full h-auto rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {currentQ.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      answers[currentQuestion] === optionIndex
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion}`}
                      value={optionIndex}
                      checked={answers[currentQuestion] === optionIndex}
                      onChange={() => handleAnswerSelect(currentQuestion, optionIndex)}
                      className="mt-1 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-700 mr-2">
                        {getOptionLabel(optionIndex)}.
                      </span>
                      <span className="text-gray-900">{option}</span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  onClick={() => navigateToQuestion(currentQuestion - 1)}
                  disabled={currentQuestion === 0}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {currentQuestion + 1} of {testData.questions.length}
                  </span>
                </div>

                <button
                  onClick={() => navigateToQuestion(currentQuestion + 1)}
                  disabled={currentQuestion === testData.questions.length - 1}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Submit Test?
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to submit your test? You have {Object.keys(answers).length} of {testData.questions.length} questions answered.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Test'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default McqQuestions