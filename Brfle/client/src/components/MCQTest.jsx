"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { X, Plus, Trash2, Edit, Save, Clock, FileText, AlertCircle } from "lucide-react"
import { 
  createMCQTest, 
  updateMCQTest, 
  deleteMCQTest,
  clearError,
  clearSuccess
} from "../store/slices/courseSlice"
import courseAPI from "../store/api/courseAPI"

const MCQTest = ({ courseId, courseTitle, onClose }) => {
  const dispatch = useDispatch()
  const { loading, error, success } = useSelector((state) => state.courses)
  
  const [test, setTest] = useState({
    title: "Course Assessment Test",
    questions: [],
    passingScore: 70,
    timeLimit: 30,
    maxAttempts: 3
  })
  
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [hasExistingTest, setHasExistingTest] = useState(false)

  // Initialize with empty question template
  const emptyQuestion = {
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: ""
  }

  useEffect(() => {
    // Check if course already has MCQ test
    const checkExistingTest = async () => {
      try {
        const response = await courseAPI.getMCQTest(courseId)
        if (response.data.mcqTest) {
          setTest(response.data.mcqTest)
          setHasExistingTest(true)
          console.log("Found existing MCQ test:", response.data.mcqTest)
        }
      } catch (error) {
        // No existing test, that's fine
        console.log("No existing MCQ test found, starting fresh")
        setHasExistingTest(false)
      }
    }
    
    checkExistingTest()
  }, [courseId])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess())
      }, 5000)
    }
  }, [success, dispatch])

  const handleAddQuestion = () => {
    if (test.questions.length >= 20) {
      alert("Maximum 20 questions allowed")
      return
    }
    
    const newQuestion = { ...emptyQuestion }
    setTest(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }))
    setEditingQuestion(test.questions.length)
    setIsEditing(true)
  }

  const handleEditQuestion = (index) => {
    setEditingQuestion(index)
    setIsEditing(true)
  }

  const handleSaveQuestion = (index, updatedQuestion) => {
    const updatedQuestions = [...test.questions]
    updatedQuestions[index] = updatedQuestion
    
    setTest(prev => ({
      ...prev,
      questions: updatedQuestions
    }))
    
    setEditingQuestion(null)
    setIsEditing(false)
  }

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = test.questions.filter((_, i) => i !== index)
    setTest(prev => ({
      ...prev,
      questions: updatedQuestions
    }))
    
    if (editingQuestion === index) {
      setEditingQuestion(null)
      setIsEditing(false)
    }
  }

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...test.questions]
    
    if (field.startsWith('options[')) {
      const optionIndex = parseInt(field.match(/\[(\d+)\]/)[1])
      updatedQuestions[index].options[optionIndex] = value
    } else {
      updatedQuestions[index][field] = value
    }
    
    setTest(prev => ({
      ...prev,
      questions: updatedQuestions
    }))
  }

const handleSaveOrUpdateTest = async () => {
  // Validate test
  if (test.questions.length === 0) {
    alert("Please add at least one question")
    return
  }

  // Validate all questions
  for (let i = 0; i < test.questions.length; i++) {
    const q = test.questions[i]
    if (!q.question.trim()) {
      alert(`Question ${i + 1} is empty`)
      return
    }
    if (q.options.some(opt => !opt.trim())) {
      alert(`Question ${i + 1} has empty options`)
      return
    }
  }

  try {
    if (hasExistingTest) {
      await dispatch(updateMCQTest({ courseId, testData: test })).unwrap()
      alert("MCQ Test updated successfully!")
    } else {
      await dispatch(createMCQTest({ courseId, testData: test })).unwrap()
      setHasExistingTest(true)
      alert("MCQ Test created successfully!")
    }
  } catch (error) {
    console.error("Failed to save test:", error)
    
    // ✅ FIXED: Proper error handling
    const errorMessage = error?.message || error?.toString() || 'Unknown error occurred'
    
    // If update fails because test doesn't exist, try creating it
    if (errorMessage.includes('MCQ test not found')) {
      try {
        await dispatch(createMCQTest({ courseId, testData: test })).unwrap()
        setHasExistingTest(true)
        alert("MCQ Test created successfully!")
      } catch (createError) {
        console.error("Failed to create test:", createError)
        alert(`Failed to create test: ${createError?.message || 'Unknown error'}`)
      }
    } else {
      alert(`Failed to save test: ${errorMessage}`)
    }
  }
}

  const handleDeleteTest = async () => {
    if (window.confirm("Are you sure you want to delete this MCQ test? This action cannot be undone.")) {
      try {
        await dispatch(deleteMCQTest(courseId)).unwrap()
        setTest(prev => ({ ...prev, questions: [] }))
        setHasExistingTest(false)
        alert("MCQ Test deleted successfully!")
      } catch (error) {
        console.error("Failed to delete test:", error)
      }
    }
  }

  const QuestionForm = ({ question, index, onSave, onCancel }) => {
    const [localQuestion, setLocalQuestion] = useState(question)

    const handleLocalChange = (field, value) => {
      setLocalQuestion(prev => ({
        ...prev,
        [field]: value
      }))
    }

    const handleOptionChange = (optionIndex, value) => {
      setLocalQuestion(prev => ({
        ...prev,
        options: prev.options.map((opt, i) => i === optionIndex ? value : opt)
      }))
    }

    const handleSave = () => {
      onSave(index, localQuestion)
    }

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">Edit Question {index + 1}</h4>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button
              onClick={onCancel}
              className="bg-red-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-red-400 border-red-500 transition-colors flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question *
            </label>
            <textarea
              value={localQuestion.question}
              onChange={(e) => handleLocalChange('question', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Enter the question..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options *
            </label>
            <div className="space-y-2">
              {localQuestion.options.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name={`correctAnswer-${index}`}
                    checked={localQuestion.correctAnswer === optIndex}
                    onChange={() => handleLocalChange('correctAnswer', optIndex)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(optIndex, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Option ${optIndex + 1}...`}
                  />
                  <span className="text-sm text-gray-500 w-8">
                    {String.fromCharCode(65 + optIndex)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Explanation (Optional)
            </label>
            <textarea
              value={localQuestion.explanation}
              onChange={(e) => handleLocalChange('explanation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2"
              placeholder="Explain why this is the correct answer..."
            />
          </div>
        </div>
      </div>
    )
  }

  const QuestionCard = ({ question, index, onEdit, onDelete }) => {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h4 className="text-lg font-semibold mb-2">
              Q{index + 1}: {question.question}
            </h4>
            
            <div className="space-y-2 mb-3">
              {question.options.map((option, optIndex) => (
                <div 
                  key={optIndex}
                  className={`flex items-center space-x-3 p-2 rounded ${
                    optIndex === question.correctAnswer 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-gray-50'
                  }`}
                >
                  <span className="font-medium w-6">
                    {String.fromCharCode(65 + optIndex)}.
                  </span>
                  <span className="flex-1">{option}</span>
                  {optIndex === question.correctAnswer && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Correct
                    </span>
                  )}
                </div>
              ))}
            </div>

            {question.explanation && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-sm text-blue-800">
                  <strong>Explanation:</strong> {question.explanation}
                </p>
              </div>
            )}
          </div>

          <div className="flex space-x-2 ml-4">
            <button
              onClick={() => onEdit(index)}
              className="text-blue-600 hover:text-blue-800 p-2 transition-colors"
              title="Edit Question"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(index)}
              className="text-red-600 hover:text-red-800 p-2 transition-colors"
              title="Delete Question"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">MCQ Test Management</h2>
            <p className="text-gray-600 mt-1">{courseTitle}</p>
            {hasExistingTest && (
              <p className="text-green-600 text-sm mt-1">✓ Existing test found</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Test Settings */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Test Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Title
                </label>
                <input
                  type="text"
                  value={test.title}
                  onChange={(e) => setTest(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={test.passingScore}
                  onChange={(e) => setTest(prev => ({ ...prev, passingScore: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  value={test.timeLimit}
                  onChange={(e) => setTest(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Questions ({test.questions.length}/20)
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddQuestion}
                  disabled={test.questions.length >= 20}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-white">Add Question</span>
                </button>
              </div>
            </div>

            {test.questions.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-4">No questions added yet</p>
                <button
                  onClick={handleAddQuestion}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Your First Question
                </button>
              </div>
            ) : (
              <div>
                {test.questions.map((question, index) => (
                  <div key={index}>
                    {editingQuestion === index ? (
                      <QuestionForm
                        question={question}
                        index={index}
                        onSave={handleSaveQuestion}
                        onCancel={() => {
                          setEditingQuestion(null)
                          setIsEditing(false)
                        }}
                      />
                    ) : (
                      <QuestionCard
                        question={question}
                        index={index}
                        onEdit={handleEditQuestion}
                        onDelete={handleDeleteQuestion}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{test.timeLimit} minutes</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>{test.questions.length} questions</span>
            </div>
            <span>Passing: {test.passingScore}%</span>
          </div>

          <div className="flex space-x-3">
            {hasExistingTest && (
              <button
                onClick={handleDeleteTest}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Test
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-red-200 text-black px-6 py-2 rounded-lg hover:bg-red-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveOrUpdateTest}
              disabled={loading || test.questions.length === 0}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : (hasExistingTest ? "Update Test" : "Save Test")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MCQTest