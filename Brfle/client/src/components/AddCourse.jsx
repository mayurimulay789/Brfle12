// // // "use client"

// // // import { useState } from "react"
// // // import { useDispatch, useSelector } from "react-redux"
// // // import { X, Save, Plus, Link, Image, Video } from "lucide-react"
// // // import {
// // //   setCourseFormData,
// // //   resetCourseFormData,
// // //   updateCourseLesson,
// // //   addCourseLesson,
// // //   removeCourseLesson,
// // //   createCourse,
// // //   updateCourseDetails
// // // } from "../store/slices/adminSlice"

// // // const AddCourse = ({ onClose, editingCourse }) => {
// // //   const dispatch = useDispatch()
// // //   const { courseFormData, loading, error } = useSelector((state) => state.admin)
  
// // //   const [localError, setLocalError] = useState("")

// // //   const handleInputChange = (e) => {
// // //     const { name, value } = e.target
// // //     dispatch(setCourseFormData({ [name]: value }))
// // //   }

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault()
// // //     setLocalError("")

// // //     // Validate required fields
// // //     if (!courseFormData.title || !courseFormData.description || !courseFormData.category || !courseFormData.price) {
// // //       setLocalError("Please fill in all required fields")
// // //       return
// // //     }

// // //     // Validate price
// // //     if (courseFormData.price < 0) {
// // //       setLocalError("Price cannot be negative")
// // //       return
// // //     }

// // //     // Validate thumbnail URL if provided
// // //     if (courseFormData.thumbnail && !isValidUrl(courseFormData.thumbnail)) {
// // //       setLocalError("Please enter a valid thumbnail URL")
// // //       return
// // //     }

// // //     // Validate lesson video URLs
// // //     for (let lesson of courseFormData.lessons) {
// // //       if (lesson.videoUrl && !isValidUrl(lesson.videoUrl)) {
// // //         setLocalError(`Please enter a valid video URL for lesson: ${lesson.title || 'Untitled'}`)
// // //         return
// // //       }
// // //     }

// // //     try {
// // //       const courseData = {
// // //         title: courseFormData.title,
// // //         description: courseFormData.description,
// // //         category: courseFormData.category,
// // //         price: parseFloat(courseFormData.price),
// // //         level: courseFormData.level,
// // //         thumbnail: courseFormData.thumbnail || "https://via.placeholder.com/400x225?text=Course+Thumbnail",
// // //         lessons: courseFormData.lessons.map((lesson, index) => ({
// // //           title: lesson.title,
// // //           description: lesson.description,
// // //           videoUrl: lesson.videoUrl,
// // //           duration: lesson.duration || 0,
// // //           order: lesson.order || index + 1,
// // //           isPreview: lesson.isPreview || false,
// // //           resources: lesson.resources || []
// // //         })),
// // //         requirements: courseFormData.requirements || [],
// // //         whatYouWillLearn: courseFormData.whatYouWillLearn || [],
// // //         targetAudience: courseFormData.targetAudience || [],
// // //         tags: courseFormData.tags || [],
// // //         language: courseFormData.language || "English",
// // //         certificate: {
// // //           available: courseFormData.certificateAvailable !== false,
// // //           passingScore: courseFormData.passingScore || 70
// // //         },
// // //         status: courseFormData.status || "published",
// // //         isPublished: courseFormData.status !== "draft"
// // //       }

// // //       if (editingCourse) {
// // //         await dispatch(updateCourseDetails({
// // //           courseId: editingCourse._id,
// // //           courseData
// // //         })).unwrap()
// // //       } else {
// // //         await dispatch(createCourse(courseData)).unwrap()
// // //       }
// // //       onClose()
// // //     } catch (error) {
// // //       setLocalError(error.message || "Failed to save course")
// // //     }
// // //   }

// // //   const handleReset = () => {
// // //     dispatch(resetCourseFormData())
// // //     onClose()
// // //   }

// // //   const isValidUrl = (string) => {
// // //     try {
// // //       new URL(string)
// // //       return true
// // //     } catch (_) {
// // //       return false
// // //     }
// // //   }

// // //   const addRequirement = () => {
// // //     const currentRequirements = courseFormData.requirements || []
// // //     dispatch(setCourseFormData({
// // //       requirements: [...currentRequirements, ""]
// // //     }))
// // //   }

// // //   const updateRequirement = (index, value) => {
// // //     const updatedRequirements = [...(courseFormData.requirements || [])]
// // //     updatedRequirements[index] = value
// // //     dispatch(setCourseFormData({ requirements: updatedRequirements }))
// // //   }

// // //   const removeRequirement = (index) => {
// // //     const updatedRequirements = (courseFormData.requirements || []).filter((_, i) => i !== index)
// // //     dispatch(setCourseFormData({ requirements: updatedRequirements }))
// // //   }

// // //   const addLearningPoint = () => {
// // //     const currentLearning = courseFormData.whatYouWillLearn || []
// // //     dispatch(setCourseFormData({
// // //       whatYouWillLearn: [...currentLearning, ""]
// // //     }))
// // //   }

// // //   const updateLearningPoint = (index, value) => {
// // //     const updatedLearning = [...(courseFormData.whatYouWillLearn || [])]
// // //     updatedLearning[index] = value
// // //     dispatch(setCourseFormData({ whatYouWillLearn: updatedLearning }))
// // //   }

// // //   const removeLearningPoint = (index) => {
// // //     const updatedLearning = (courseFormData.whatYouWillLearn || []).filter((_, i) => i !== index)
// // //     dispatch(setCourseFormData({ whatYouWillLearn: updatedLearning }))
// // //   }

// // //   return (
// // //     <div className="bg-white rounded-lg shadow-sm p-6 max-h-[90vh] overflow-y-auto">
// // //       <div className="flex justify-between items-center mb-6 sticky top-0 bg-white py-2">
// // //         <h4 className="text-lg font-medium text-gray-900">
// // //           {editingCourse ? "Edit Course" : "Create New Course"}
// // //         </h4>
// // //         <button onClick={handleReset} className="text-gray-400 hover:text-gray-600">
// // //           <X className="h-5 w-5" />
// // //         </button>
// // //       </div>

// // //       <form onSubmit={handleSubmit} className="space-y-6">
// // //         {/* Error Messages */}
// // //         {(error || localError) && (
// // //           <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
// // //             <p className="text-red-800 text-sm">{error || localError}</p>
// // //           </div>
// // //         )}

// // //         {/* Basic Information */}
// // //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // //           <div>
// // //             <label className="block text-sm font-medium text-gray-700 mb-2">
// // //               Course Title *
// // //             </label>
// // //             <input
// // //               type="text"
// // //               name="title"
// // //               value={courseFormData.title}
// // //               onChange={handleInputChange}
// // //               required
// // //               placeholder="e.g., React JS Crash Course"
// // //               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // //             />
// // //           </div>

// // //           <div>
// // //             <label className="block text-sm font-medium text-gray-700 mb-2">
// // //               Category *
// // //             </label>
// // //             <select
// // //               name="category"
// // //               value={courseFormData.category}
// // //               onChange={handleInputChange}
// // //               required
// // //               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // //             >
// // //               <option value="">Select Category</option>
// // //               <option value="Programming">Programming</option>
// // //               <option value="Design">Design</option>
// // //               <option value="Marketing">Marketing</option>
// // //               <option value="Business">Business</option>
// // //               <option value="Creative">Creative</option>
// // //               <option value="Technology">Technology</option>
// // //               <option value="Health">Health</option>
// // //               <option value="Language">Language</option>
// // //             </select>
// // //           </div>

// // //           <div>
// // //             <label className="block text-sm font-medium text-gray-700 mb-2">
// // //               Price (₹) *
// // //             </label>
// // //             <input
// // //               type="number"
// // //               name="price"
// // //               value={courseFormData.price}
// // //               onChange={handleInputChange}
// // //               required
// // //               min="0"
// // //               step="0.01"
// // //               placeholder="e.g., 4999"
// // //               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // //             />
// // //           </div>

// // //           <div>
// // //             <label className="block text-sm font-medium text-gray-700 mb-2">
// // //               Level *
// // //             </label>
// // //             <select
// // //               name="level"
// // //               value={courseFormData.level}
// // //               onChange={handleInputChange}
// // //               required
// // //               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // //             >
// // //               <option value="Beginner">Beginner</option>
// // //               <option value="Intermediate">Intermediate</option>
// // //               <option value="Advanced">Advanced</option>
// // //             </select>
// // //           </div>
// // //         </div>

// // //         {/* Description */}
// // //         <div>
// // //           <label className="block text-sm font-medium text-gray-700 mb-2">
// // //             Description *
// // //           </label>
// // //           <textarea
// // //             name="description"
// // //             value={courseFormData.description}
// // //             onChange={handleInputChange}
// // //             required
// // //             rows={4}
// // //             placeholder="Describe what students will learn in this course..."
// // //             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // //           />
// // //         </div>

// // //         {/* Short Description */}
// // //         <div>
// // //           <label className="block text-sm font-medium text-gray-700 mb-2">
// // //             Short Description
// // //           </label>
// // //           <textarea
// // //             name="shortDescription"
// // //             value={courseFormData.shortDescription}
// // //             onChange={handleInputChange}
// // //             rows={2}
// // //             placeholder="Brief description (max 500 characters)"
// // //             maxLength={500}
// // //             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // //           />
// // //           <p className="text-xs text-gray-500 mt-1">
// // //             {courseFormData.shortDescription?.length || 0}/500 characters
// // //           </p>
// // //         </div>

// // //         {/* Thumbnail URL */}
// // //         <div>
// // //           <label className="block text-sm font-medium text-gray-700 mb-2">
// // //             Thumbnail URL
// // //           </label>
// // //           <div className="flex items-center space-x-2">
// // //             <Image className="h-5 w-5 text-gray-400" />
// // //             <input
// // //               type="url"
// // //               name="thumbnail"
// // //               value={courseFormData.thumbnail}
// // //               onChange={handleInputChange}
// // //               placeholder="https://example.com/thumbnail.jpg"
// // //               className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // //             />
// // //           </div>
// // //           <p className="text-xs text-gray-500 mt-1">
// // //             Enter image URL for course thumbnail. Leave empty for default placeholder.
// // //           </p>
// // //           {courseFormData.thumbnail && (
// // //             <div className="mt-2">
// // //               <img
// // //                 src={courseFormData.thumbnail}
// // //                 alt="Thumbnail preview"
// // //                 className="h-32 w-56 object-cover rounded-lg border"
// // //                 onError={(e) => {
// // //                   e.target.style.display = 'none'
// // //                 }}
// // //               />
// // //             </div>
// // //           )}
// // //         </div>

// // //         {/* Course Status */}
// // //         <div>
// // //           <label className="block text-sm font-medium text-gray-700 mb-2">
// // //             Course Status
// // //           </label>
// // //           <select
// // //             name="status"
// // //             value={courseFormData.status || "published"}
// // //             onChange={handleInputChange}
// // //             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // //           >
// // //             <option value="draft">Draft</option>
// // //             <option value="published">Published</option>
// // //             <option value="review">Under Review</option>
// // //           </select>
// // //         </div>

// // //         {/* Requirements */}
// // //         <div>
// // //           <div className="flex justify-between items-center mb-4">
// // //             <label className="block text-sm font-medium text-gray-700">
// // //               Requirements
// // //             </label>
// // //             <button
// // //               type="button"
// // //               onClick={addRequirement}
// // //               className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
// // //             >
// // //               <Plus className="h-4 w-4" />
// // //               <span>Add Requirement</span>
// // //             </button>
// // //           </div>
// // //           <div className="space-y-2">
// // //             {(courseFormData.requirements || []).map((requirement, index) => (
// // //               <div key={index} className="flex items-center space-x-2">
// // //                 <input
// // //                   type="text"
// // //                   value={requirement}
// // //                   onChange={(e) => updateRequirement(index, e.target.value)}
// // //                   placeholder="e.g., Basic HTML knowledge"
// // //                   className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // //                 />
// // //                 <button
// // //                   type="button"
// // //                   onClick={() => removeRequirement(index)}
// // //                   className="text-red-600 hover:text-red-800 p-2"
// // //                 >
// // //                   <X className="h-4 w-4" />
// // //                 </button>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         </div>

// // //         {/* What You'll Learn */}
// // //         <div>
// // //           <div className="flex justify-between items-center mb-4">
// // //             <label className="block text-sm font-medium text-gray-700">
// // //               What Students Will Learn
// // //             </label>
// // //             <button
// // //               type="button"
// // //               onClick={addLearningPoint}
// // //               className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
// // //             >
// // //               <Plus className="h-4 w-4" />
// // //               <span>Add Learning Point</span>
// // //             </button>
// // //           </div>
// // //           <div className="space-y-2">
// // //             {(courseFormData.whatYouWillLearn || []).map((point, index) => (
// // //               <div key={index} className="flex items-center space-x-2">
// // //                 <input
// // //                   type="text"
// // //                   value={point}
// // //                   onChange={(e) => updateLearningPoint(index, e.target.value)}
// // //                   placeholder="e.g., Build responsive web applications"
// // //                   className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // //                 />
// // //                 <button
// // //                   type="button"
// // //                   onClick={() => removeLearningPoint(index)}
// // //                   className="text-red-600 hover:text-red-800 p-2"
// // //                 >
// // //                   <X className="h-4 w-4" />
// // //                 </button>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         </div>

// // //         {/* Certificate Settings */}
// // //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // //           <div>
// // //             <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
// // //               <input
// // //                 type="checkbox"
// // //                 checked={courseFormData.certificateAvailable !== false}
// // //                 onChange={(e) => dispatch(setCourseFormData({ 
// // //                   certificateAvailable: e.target.checked 
// // //                 }))}
// // //                 className="rounded text-blue-600 mr-2"
// // //               />
// // //               Certificate Available
// // //             </label>
// // //           </div>
// // //           <div>
// // //             <label className="block text-sm font-medium text-gray-700 mb-2">
// // //               Passing Score (%)
// // //             </label>
// // //             <input
// // //               type="number"
// // //               min="0"
// // //               max="100"
// // //               value={courseFormData.passingScore || 70}
// // //               onChange={(e) => dispatch(setCourseFormData({ 
// // //                 passingScore: parseInt(e.target.value) 
// // //               }))}
// // //               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // //             />
// // //           </div>
// // //         </div>

// // //         {/* Lessons */}
// // //         <div>
// // //           <div className="flex justify-between items-center mb-4">
// // //             <label className="block text-sm font-medium text-gray-700">Course Lessons</label>
// // //             <button
// // //               type="button"
// // //               onClick={() => dispatch(addCourseLesson())}
// // //               className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
// // //             >
// // //               <Plus className="h-4 w-4" />
// // //               <span>Add Lesson</span>
// // //             </button>
// // //           </div>

// // //           <div className="space-y-4">
// // //             {courseFormData.lessons.map((lesson, index) => (
// // //               <div key={lesson.id} className="border border-gray-200 rounded-lg p-4">
// // //                 <div className="flex justify-between items-center mb-4">
// // //                   <h5 className="font-medium text-gray-900">Lesson {index + 1}</h5>
// // //                   <button
// // //                     type="button"
// // //                     onClick={() => dispatch(removeCourseLesson(lesson.id))}
// // //                     className="text-red-600 hover:text-red-800"
// // //                   >
// // //                     <X className="h-4 w-4" />
// // //                   </button>
// // //                 </div>

// // //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //                   <div>
// // //                     <label className="block text-sm font-medium text-gray-700 mb-1">
// // //                       Lesson Title *
// // //                     </label>
// // //                     <input
// // //                       type="text"
// // //                       value={lesson.title}
// // //                       onChange={(e) => dispatch(updateCourseLesson({
// // //                         lessonId: lesson.id,
// // //                         field: "title",
// // //                         value: e.target.value
// // //                       }))}
// // //                       required
// // //                       placeholder="e.g., Introduction to React"
// // //                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // //                     />
// // //                   </div>

// // //                   <div>
// // //                     <label className="block text-sm font-medium text-gray-700 mb-1">
// // //                       Video Duration (minutes)
// // //                     </label>
// // //                     <input
// // //                       type="number"
// // //                       min="0"
// // //                       value={lesson.duration || 0}
// // //                       onChange={(e) => dispatch(updateCourseLesson({
// // //                         lessonId: lesson.id,
// // //                         field: "duration",
// // //                         value: parseInt(e.target.value) || 0
// // //                       }))}
// // //                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // //                     />
// // //                   </div>
// // //                 </div>

// // //                 <div className="mt-4">
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// // //                     Video URL
// // //                   </label>
// // //                   <div className="flex items-center space-x-2">
// // //                     <Video className="h-5 w-5 text-gray-400" />
// // //                     <input
// // //                       type="url"
// // //                       value={lesson.videoUrl}
// // //                       onChange={(e) => dispatch(updateCourseLesson({
// // //                         lessonId: lesson.id,
// // //                         field: "videoUrl",
// // //                         value: e.target.value
// // //                       }))}
// // //                       placeholder="https://example.com/video.mp4"
// // //                       className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // //                     />
// // //                   </div>
// // //                 </div>

// // //                 <div className="mt-4">
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// // //                     Lesson Description
// // //                   </label>
// // //                   <textarea
// // //                     value={lesson.description}
// // //                     onChange={(e) => dispatch(updateCourseLesson({
// // //                       lessonId: lesson.id,
// // //                       field: "description",
// // //                       value: e.target.value
// // //                     }))}
// // //                     rows={2}
// // //                     placeholder="Describe what this lesson covers..."
// // //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// // //                   />
// // //                 </div>

// // //                 <div className="mt-4 flex items-center">
// // //                   <input
// // //                     type="checkbox"
// // //                     checked={lesson.isPreview || false}
// // //                     onChange={(e) => dispatch(updateCourseLesson({
// // //                       lessonId: lesson.id,
// // //                       field: "isPreview",
// // //                       value: e.target.checked
// // //                     }))}
// // //                     className="rounded text-blue-600 mr-2"
// // //                     id={`preview-${lesson.id}`}
// // //                   />
// // //                   <label htmlFor={`preview-${lesson.id}`} className="text-sm text-gray-700">
// // //                     Available as preview lesson
// // //                   </label>
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         </div>

// // //         {/* Submit Buttons */}
// // //         <div className="flex justify-end space-x-4 pt-6 border-t">
// // //           <button
// // //             type="button"
// // //             onClick={handleReset}
// // //             className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
// // //             disabled={loading}
// // //           >
// // //             Cancel
// // //           </button>
// // //           <button
// // //             type="submit"
// // //             disabled={loading}
// // //             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
// // //           >
// // //             <Save className="h-4 w-4" />
// // //             <span>{loading ? "Saving..." : editingCourse ? "Update Course" : "Create Course"}</span>
// // //           </button>
// // //         </div>
// // //       </form>
// // //     </div>
// // //   )
// // // }

// // // export default AddCourse

// // "use client"

// // import { useState, useEffect } from "react"
// // import { useDispatch, useSelector } from "react-redux"
// // import { X, Save, Plus, Image, Video, Trash2 } from "lucide-react"
// // import {
// //   createCourse,
// //   updateCourse,
// //   setEditingCourse,
// //   setIsCreatingCourse,
// //   clearError,
// //   clearSuccess
// // } from "../store/slices/courseSlice"

// // const AddCourse = ({ onClose, editingCourse }) => {
// //   const dispatch = useDispatch()
// //   const { loading, error, success } = useSelector((state) => state.courses)

// //   const [formData, setFormData] = useState({
// //     courseTitle: "",
// //     courseGuide: "",
// //     courseSummary: "",
// //     price: "",
// //     duration: "",
// //     mode: "online",
// //     category: "",
// //     difficulty: "beginner",
// //     language: "English",
// //     tags: [],
// //     isActive: true
// //   })

// //   const [lessons, setLessons] = useState([])
// //   const [courseImage, setCourseImage] = useState(null)
// //   const [coursePreviewVideo, setCoursePreviewVideo] = useState(null)
// //   const [localError, setLocalError] = useState("")
// //   const [tagInput, setTagInput] = useState("")

// //   // Initialize form with editing course data
// //   useEffect(() => {
// //     if (editingCourse) {
// //       setFormData({
// //         courseTitle: editingCourse.courseTitle || "",
// //         courseGuide: editingCourse.courseGuide || "",
// //         courseSummary: editingCourse.courseSummary || "",
// //         price: editingCourse.price || "",
// //         duration: editingCourse.duration || "",
// //         mode: editingCourse.mode || "online",
// //         category: editingCourse.category || "",
// //         difficulty: editingCourse.difficulty || "beginner",
// //         language: editingCourse.language || "English",
// //         tags: editingCourse.tags || [],
// //         isActive: editingCourse.isActive !== false
// //       })
// //       // Note: Lessons would be managed separately via Lesson API
// //     }
// //   }, [editingCourse])

// //   useEffect(() => {
// //     if (error) {
// //       setLocalError(error)
// //     }
// //   }, [error])

// //   useEffect(() => {
// //     if (success) {
// //       handleClose()
// //     }
// //   }, [success])

// //   const handleInputChange = (e) => {
// //     const { name, value, type, checked } = e.target
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: type === 'checkbox' ? checked : value
// //     }))
// //   }

// //   const handleAddTag = () => {
// //     if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
// //       setFormData(prev => ({
// //         ...prev,
// //         tags: [...prev.tags, tagInput.trim()]
// //       }))
// //       setTagInput("")
// //     }
// //   }

// //   const handleRemoveTag = (tagToRemove) => {
// //     setFormData(prev => ({
// //       ...prev,
// //       tags: prev.tags.filter(tag => tag !== tagToRemove)
// //     }))
// //   }

// //   const handleTagInputKeyPress = (e) => {
// //     if (e.key === 'Enter') {
// //       e.preventDefault()
// //       handleAddTag()
// //     }
// //   }

// //   const handleImageChange = (e) => {
// //     const file = e.target.files[0]
// //     if (file) {
// //       if (file.size > 5 * 1024 * 1024) { // 5MB limit
// //         setLocalError("Image size should be less than 5MB")
// //         return
// //       }
// //       if (!file.type.startsWith('image/')) {
// //         setLocalError("Please select a valid image file")
// //         return
// //       }
// //       setCourseImage(file)
// //     }
// //   }

// //   const handlePreviewVideoChange = (e) => {
// //     const file = e.target.files[0]
// //     if (file) {
// //       if (file.size > 50 * 1024 * 1024) { // 50MB limit
// //         setLocalError("Video size should be less than 50MB")
// //         return
// //       }
// //       if (!file.type.startsWith('video/')) {
// //         setLocalError("Please select a valid video file")
// //         return
// //       }
// //       setCoursePreviewVideo(file)
// //     }
// //   }

// //   const validateForm = () => {
// //     if (!formData.courseTitle.trim()) {
// //       setLocalError("Course title is required")
// //       return false
// //     }
// //     if (!formData.courseGuide.trim()) {
// //       setLocalError("Course guide is required")
// //       return false
// //     }
// //     if (!formData.courseSummary.trim()) {
// //       setLocalError("Course summary is required")
// //       return false
// //     }
// //     if (!formData.price || parseFloat(formData.price) < 0) {
// //       setLocalError("Valid price is required")
// //       return false
// //     }
// //     if (!formData.duration.trim()) {
// //       setLocalError("Course duration is required")
// //       return false
// //     }
// //     if (!formData.category) {
// //       setLocalError("Category is required")
// //       return false
// //     }
// //     if (!courseImage && !editingCourse) {
// //       setLocalError("Course image is required")
// //       return false
// //     }
// //     return true
// //   }

// //   const handleSubmit = async (e) => {
// //     e.preventDefault()
// //     setLocalError("")

// //     if (!validateForm()) {
// //       return
// //     }

// //     try {
// //       const submitData = new FormData()
      
// //       // Append form data
// //       Object.keys(formData).forEach(key => {
// //         if (key === 'tags') {
// //           submitData.append(key, JSON.stringify(formData[key]))
// //         } else {
// //           submitData.append(key, formData[key])
// //         }
// //       })

// //       // Append files
// //       if (courseImage) {
// //         submitData.append('courseImage', courseImage)
// //       }
// //       if (coursePreviewVideo) {
// //         submitData.append('previewVideo', coursePreviewVideo)
// //       }

// //       if (editingCourse) {
// //         await dispatch(updateCourse({
// //           courseId: editingCourse._id,
// //           courseData: submitData
// //         })).unwrap()
// //       } else {
// //         await dispatch(createCourse(submitData)).unwrap()
// //       }
      
// //       // Success will trigger useEffect to close form
// //     } catch (error) {
// //       console.error("Error saving course:", error)
// //     }
// //   }

// //   const handleClose = () => {
// //     setFormData({
// //       courseTitle: "",
// //       courseGuide: "",
// //       courseSummary: "",
// //       price: "",
// //       duration: "",
// //       mode: "online",
// //       category: "",
// //       difficulty: "beginner",
// //       language: "English",
// //       tags: [],
// //       isActive: true
// //     })
// //     setCourseImage(null)
// //     setCoursePreviewVideo(null)
// //     setLocalError("")
// //     dispatch(clearError())
// //     dispatch(clearSuccess())
// //     onClose()
// //   }

// //   return (
// //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
// //       <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
// //         {/* Header */}
// //         <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
// //           <h4 className="text-xl font-semibold text-gray-900">
// //             {editingCourse ? "Edit Course" : "Create New Course"}
// //           </h4>
// //           <button 
// //             onClick={handleClose}
// //             className="text-gray-400 hover:text-gray-600 transition-colors"
// //           >
// //             <X className="h-6 w-6" />
// //           </button>
// //         </div>

// //         <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-80px)]">
// //           <div className="p-6 space-y-6">
// //             {/* Error Messages */}
// //             {localError && (
// //               <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
// //                 <p className="text-red-800 text-sm font-medium">{localError}</p>
// //               </div>
// //             )}

// //             {/* Basic Information */}
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Course Title *
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="courseTitle"
// //                   value={formData.courseTitle}
// //                   onChange={handleInputChange}
// //                   required
// //                   placeholder="e.g., React JS Masterclass"
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Category *
// //                 </label>
// //                 <select
// //                   name="category"
// //                   value={formData.category}
// //                   onChange={handleInputChange}
// //                   required
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                 >
// //                   <option value="">Select Category</option>
// //                   <option value="Programming">Programming</option>
// //                   <option value="Design">Design</option>
// //                   <option value="Marketing">Marketing</option>
// //                   <option value="Business">Business</option>
// //                   <option value="Creative">Creative</option>
// //                   <option value="Technology">Technology</option>
// //                   <option value="Health">Health</option>
// //                   <option value="Language">Language</option>
// //                 </select>
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Price (₹) *
// //                 </label>
// //                 <input
// //                   type="number"
// //                   name="price"
// //                   value={formData.price}
// //                   onChange={handleInputChange}
// //                   required
// //                   min="0"
// //                   step="0.01"
// //                   placeholder="e.g., 4999"
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Duration *
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="duration"
// //                   value={formData.duration}
// //                   onChange={handleInputChange}
// //                   required
// //                   placeholder="e.g., 8 weeks, 40 hours"
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Mode *
// //                 </label>
// //                 <select
// //                   name="mode"
// //                   value={formData.mode}
// //                   onChange={handleInputChange}
// //                   required
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                 >
// //                   <option value="online">Online</option>
// //                   <option value="offline">Offline</option>
// //                   <option value="hybrid">Hybrid</option>
// //                 </select>
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Difficulty Level *
// //                 </label>
// //                 <select
// //                   name="difficulty"
// //                   value={formData.difficulty}
// //                   onChange={handleInputChange}
// //                   required
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                 >
// //                   <option value="beginner">Beginner</option>
// //                   <option value="intermediate">Intermediate</option>
// //                   <option value="advanced">Advanced</option>
// //                 </select>
// //               </div>
// //             </div>

// //             {/* Course Guide */}
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-2">
// //                 Course Guide *
// //               </label>
// //               <textarea
// //                 name="courseGuide"
// //                 value={formData.courseGuide}
// //                 onChange={handleInputChange}
// //                 required
// //                 rows={4}
// //                 placeholder="Detailed guide about the course, curriculum, learning outcomes..."
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               />
// //             </div>

// //             {/* Course Summary */}
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-2">
// //                 Course Summary *
// //               </label>
// //               <textarea
// //                 name="courseSummary"
// //                 value={formData.courseSummary}
// //                 onChange={handleInputChange}
// //                 required
// //                 rows={3}
// //                 placeholder="Brief summary of the course (max 1000 characters)"
// //                 maxLength={1000}
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               />
// //               <p className="text-xs text-gray-500 mt-1">
// //                 {formData.courseSummary.length}/1000 characters
// //               </p>
// //             </div>

// //             {/* Course Image */}
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-2">
// //                 Course Image {!editingCourse && '*'}
// //               </label>
// //               <div className="flex items-center space-x-4">
// //                 <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
// //                   <Image className="h-8 w-8 text-gray-400 mb-2" />
// //                   <span className="text-sm text-gray-600 text-center px-2">
// //                     {courseImage ? 'Change' : 'Upload'} Image
// //                   </span>
// //                   <input
// //                     type="file"
// //                     accept="image/*"
// //                     onChange={handleImageChange}
// //                     className="hidden"
// //                   />
// //                 </label>
// //                 {courseImage && (
// //                   <div className="relative">
// //                     <img
// //                       src={URL.createObjectURL(courseImage)}
// //                       alt="Course preview"
// //                       className="h-32 w-32 object-cover rounded-lg"
// //                     />
// //                   </div>
// //                 )}
// //                 {editingCourse && !courseImage && (
// //                   <img
// //                     src={editingCourse.courseImage?.url}
// //                     alt="Current course"
// //                     className="h-32 w-32 object-cover rounded-lg"
// //                   />
// //                 )}
// //               </div>
// //               <p className="text-xs text-gray-500 mt-2">
// //                 Recommended: 800x450px, JPG/PNG/WEBP, max 5MB
// //               </p>
// //             </div>

// //             {/* Preview Video */}
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-2">
// //                 Course Preview Video
// //               </label>
// //               <div className="flex items-center space-x-4">
// //                 <label className="flex flex-col items-center justify-center w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
// //                   <Video className="h-8 w-8 text-gray-400 mb-2" />
// //                   <span className="text-sm text-gray-600 text-center px-2">
// //                     {coursePreviewVideo ? 'Change' : 'Upload'} Video
// //                   </span>
// //                   <input
// //                     type="file"
// //                     accept="video/*"
// //                     onChange={handlePreviewVideoChange}
// //                     className="hidden"
// //                   />
// //                 </label>
// //                 {coursePreviewVideo && (
// //                   <div className="text-sm text-gray-600">
// //                     Selected: {coursePreviewVideo.name}
// //                   </div>
// //                 )}
// //               </div>
// //               <p className="text-xs text-gray-500 mt-2">
// //                 MP4, MOV, AVI, max 50MB
// //               </p>
// //             </div>

// //             {/* Tags */}
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-2">
// //                 Tags
// //               </label>
// //               <div className="flex flex-wrap gap-2 mb-3">
// //                 {formData.tags.map((tag, index) => (
// //                   <span
// //                     key={index}
// //                     className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
// //                   >
// //                     {tag}
// //                     <button
// //                       type="button"
// //                       onClick={() => handleRemoveTag(tag)}
// //                       className="ml-1 text-blue-600 hover:text-blue-800"
// //                     >
// //                       <X className="h-3 w-3" />
// //                     </button>
// //                   </span>
// //                 ))}
// //               </div>
// //               <div className="flex space-x-2">
// //                 <input
// //                   type="text"
// //                   value={tagInput}
// //                   onChange={(e) => setTagInput(e.target.value)}
// //                   onKeyPress={handleTagInputKeyPress}
// //                   placeholder="Add a tag..."
// //                   className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={handleAddTag}
// //                   className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
// //                 >
// //                   <Plus className="h-4 w-4" />
// //                 </button>
// //               </div>
// //             </div>

// //             {/* Additional Settings */}
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Language
// //                 </label>
// //                 <select
// //                   name="language"
// //                   value={formData.language}
// //                   onChange={handleInputChange}
// //                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                 >
// //                   <option value="English">English</option>
// //                   <option value="Hindi">Hindi</option>
// //                   <option value="Spanish">Spanish</option>
// //                   <option value="French">French</option>
// //                 </select>
// //               </div>

// //               <div className="flex items-center">
// //                 <input
// //                   type="checkbox"
// //                   name="isActive"
// //                   checked={formData.isActive}
// //                   onChange={handleInputChange}
// //                   className="rounded text-blue-600 mr-3"
// //                   id="isActive"
// //                 />
// //                 <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
// //                   Course is active and visible to students
// //                 </label>
// //               </div>
// //             </div>

// //             {/* Note about Lessons */}
// //             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
// //               <p className="text-sm text-blue-800">
// //                 <strong>Note:</strong> Lessons are managed separately after creating the course. 
// //                 You can add lessons from the course management page.
// //               </p>
// //             </div>
// //           </div>

// //           {/* Submit Buttons */}
// //           <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
// //             <button
// //               type="button"
// //               onClick={handleClose}
// //               className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
// //               disabled={loading}
// //             >
// //               Cancel
// //             </button>
// //             <button
// //               type="submit"
// //               disabled={loading}
// //               className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
// //             >
// //               <Save className="h-5 w-5" />
// //               <span>
// //                 {loading 
// //                   ? (editingCourse ? "Updating..." : "Creating...") 
// //                   : (editingCourse ? "Update Course" : "Create Course")
// //                 }
// //               </span>
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   )
// // }

// // export default AddCourse

// "use client"

// import { useState, useEffect } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { X, Save, Plus, Image, Video, FileText, Trash2 } from "lucide-react"
// import {
//   createCourse,
//   updateCourse,
//   setEditingCourse,
//   setIsCreatingCourse,
//   clearError,
//   clearSuccess
// } from "../store/slices/courseSlice"

// const AddCourse = ({ onClose, editingCourse }) => {
//   const dispatch = useDispatch()
//   const { loading, error } = useSelector((state) => state.courses)

//   const [formData, setFormData] = useState({
//     courseTitle: "",
//     courseGuide: "",
//     courseSummary: "",
//     price: "",
//     duration: "",
//     mode: "online",
//     category: "",
//     difficulty: "beginner",
//     language: "English",
//     tags: [],
//     isActive: true
//   })

//   const [courseImage, setCourseImage] = useState(null)
//   const [coursePreviewVideo, setCoursePreviewVideo] = useState(null)
//   const [courseBook, setCourseBook] = useState(null)
//   const [projectPDF, setProjectPDF] = useState(null)
//   const [localError, setLocalError] = useState("")
//   const [tagInput, setTagInput] = useState("")

//   // Initialize form with editing course data
//   useEffect(() => {
//     if (editingCourse) {
//       setFormData({
//         courseTitle: editingCourse.courseTitle || "",
//         courseGuide: editingCourse.courseGuide || "",
//         courseSummary: editingCourse.courseSummary || "",
//         price: editingCourse.price?.toString() || "",
//         duration: editingCourse.duration || "",
//         mode: editingCourse.mode || "online",
//         category: editingCourse.category || "",
//         difficulty: editingCourse.difficulty || "beginner",
//         language: editingCourse.language || "English",
//         tags: editingCourse.tags || [],
//         isActive: editingCourse.isActive !== false
//       })
//     }
//   }, [editingCourse])

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }))
//   }

//   const handleAddTag = () => {
//     if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
//       setFormData(prev => ({
//         ...prev,
//         tags: [...prev.tags, tagInput.trim()]
//       }))
//       setTagInput("")
//     }
//   }

//   const handleRemoveTag = (tagToRemove) => {
//     setFormData(prev => ({
//       ...prev,
//       tags: prev.tags.filter(tag => tag !== tagToRemove)
//     }))
//   }

//   const handleTagInputKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault()
//       handleAddTag()
//     }
//   }

//   const handleFileChange = (setter, fileType, maxSize) => (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       if (file.size > maxSize) {
//         setLocalError(`${fileType} size should be less than ${maxSize / (1024 * 1024)}MB`)
//         return
//       }
//       setter(file)
//       setLocalError("")
//     }
//   }

//   const validateForm = () => {
//     const errors = []
    
//     if (!formData.courseTitle.trim()) errors.push("Course title is required")
//     if (!formData.courseGuide.trim()) errors.push("Course guide is required")
//     if (!formData.courseSummary.trim()) errors.push("Course summary is required")
//     if (!formData.price || parseFloat(formData.price) < 0) errors.push("Valid price is required")
//     if (!formData.duration.trim()) errors.push("Course duration is required")
//     if (!formData.category) errors.push("Category is required")
    
//     if (!editingCourse && !courseImage) {
//       errors.push("Course image is required for new courses")
//     }

//     if (errors.length > 0) {
//       setLocalError(errors.join(", "))
//       return false
//     }
//     return true
//   }

// // In the handleSubmit function, update the file appending:

// const handleSubmit = async (e) => {
//   e.preventDefault()
//   setLocalError("")

//   if (!validateForm()) {
//     return
//   }

//   try {
//     const submitData = new FormData()
    
//     // Append form data
//     Object.keys(formData).forEach(key => {
//       if (key === 'tags') {
//         submitData.append(key, JSON.stringify(formData[key]))
//       } else if (key === 'price') {
//         submitData.append(key, parseFloat(formData[key]))
//       } else {
//         submitData.append(key, formData[key])
//       }
//     })

//     // Append files with correct field names
//     if (courseImage) {
//       submitData.append('courseImage', courseImage)
//     }
//     if (coursePreviewVideo) {
//       submitData.append('previewVideo', coursePreviewVideo)
//     }
//     if (courseBook) {
//       submitData.append('courseBook', courseBook)
//     }
//     if (projectPDF) {
//       submitData.append('projectPDF', projectPDF)
//     }

//     if (editingCourse) {
//       await dispatch(updateCourse({
//         courseId: editingCourse._id,
//         courseData: submitData
//       })).unwrap()
//     } else {
//       await dispatch(createCourse(submitData)).unwrap()
//     }
    
//     handleClose()
//   } catch (error) {
//     console.error("Error saving course:", error)
//     setLocalError(error.message || "Failed to save course")
//   }
// }

//   const handleClose = () => {
//     setFormData({
//       courseTitle: "",
//       courseGuide: "",
//       courseSummary: "",
//       price: "",
//       duration: "",
//       mode: "online",
//       category: "",
//       difficulty: "beginner",
//       language: "English",
//       tags: [],
//       isActive: true
//     })
//     setCourseImage(null)
//     setCoursePreviewVideo(null)
//     setCourseBook(null)
//     setProjectPDF(null)
//     setLocalError("")
//     dispatch(clearError())
//     dispatch(clearSuccess())
//     onClose()
//   }

//   const getFilePreview = (file, existingUrl) => {
//     if (file) {
//       return URL.createObjectURL(file)
//     }
//     return existingUrl
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
//         {/* Header */}
//         <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
//           <div>
//             <h4 className="text-2xl font-bold text-gray-900">
//               {editingCourse ? "Edit Course" : "Create New Course"}
//             </h4>
//             <p className="text-gray-600 mt-1">
//               {editingCourse ? "Update your course details" : "Fill in the details to create a new course"}
//             </p>
//           </div>
//           <button 
//             onClick={handleClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
//           >
//             <X className="h-6 w-6" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(95vh-80px)]">
//           <div className="p-6 space-y-8">
//             {/* Error Messages */}
//             {(error || localError) && (
//               <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
//                 <p className="text-red-800 text-sm font-medium">{error || localError}</p>
//               </div>
//             )}

//             {/* Basic Information Section */}
//             <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
//               <h5 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h5>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Course Title *
//                   </label>
//                   <input
//                     type="text"
//                     name="courseTitle"
//                     value={formData.courseTitle}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="e.g., React JS Masterclass"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Category *
//                   </label>
//                   <select
//                     name="category"
//                     value={formData.category}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="">Select Category</option>
//                     <option value="Programming">Programming</option>
//                     <option value="Design">Design</option>
//                     <option value="Marketing">Marketing</option>
//                     <option value="Business">Business</option>
//                     <option value="Creative">Creative</option>
//                     <option value="Technology">Technology</option>
//                     <option value="Health">Health</option>
//                     <option value="Language">Language</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Price (₹) *
//                   </label>
//                   <input
//                     type="number"
//                     name="price"
//                     value={formData.price}
//                     onChange={handleInputChange}
//                     required
//                     min="0"
//                     step="0.01"
//                     placeholder="e.g., 4999"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Duration *
//                   </label>
//                   <input
//                     type="text"
//                     name="duration"
//                     value={formData.duration}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="e.g., 8 weeks, 40 hours"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Mode *
//                   </label>
//                   <select
//                     name="mode"
//                     value={formData.mode}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="online">Online</option>
//                     <option value="offline">Offline</option>
//                     <option value="hybrid">Hybrid</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Difficulty Level *
//                   </label>
//                   <select
//                     name="difficulty"
//                     value={formData.difficulty}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="beginner">Beginner</option>
//                     <option value="intermediate">Intermediate</option>
//                     <option value="advanced">Advanced</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Language
//                   </label>
//                   <select
//                     name="language"
//                     value={formData.language}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="English">English</option>
//                     <option value="Hindi">Hindi</option>
//                     <option value="Spanish">Spanish</option>
//                     <option value="French">French</option>
//                   </select>
//                 </div>

//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     name="isActive"
//                     checked={formData.isActive}
//                     onChange={handleInputChange}
//                     className="rounded text-blue-600 mr-3 focus:ring-blue-500"
//                     id="isActive"
//                   />
//                   <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
//                     Course is active and visible to students
//                   </label>
//                 </div>
//               </div>
//             </section>

//             {/* Course Content Section */}
//             <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
//               <h5 className="text-lg font-semibold text-gray-900 mb-4">Course Content</h5>
              
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Course Guide *
//                   </label>
//                   <textarea
//                     name="courseGuide"
//                     value={formData.courseGuide}
//                     onChange={handleInputChange}
//                     required
//                     rows={6}
//                     placeholder="Detailed guide about the course, curriculum, learning outcomes, teaching methodology..."
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Course Summary *
//                   </label>
//                   <textarea
//                     name="courseSummary"
//                     value={formData.courseSummary}
//                     onChange={handleInputChange}
//                     required
//                     rows={4}
//                     placeholder="Brief summary of the course that will be displayed on the course card (max 1000 characters)"
//                     maxLength={1000}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
//                   />
//                   <p className="text-xs text-gray-500 mt-1">
//                     {formData.courseSummary.length}/1000 characters
//                   </p>
//                 </div>
//               </div>
//             </section>

//             {/* Media Files Section */}
//             <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
//               <h5 className="text-lg font-semibold text-gray-900 mb-4">Media & Resources</h5>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Course Image */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Course Image {!editingCourse && '*'}
//                   </label>
//                   <div className="space-y-3">
//                     <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors bg-white">
//                       <Image className="h-8 w-8 text-gray-400 mb-2" />
//                       <span className="text-sm text-gray-600">
//                         {courseImage ? 'Change Image' : 'Upload Course Image'}
//                       </span>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         onChange={handleFileChange(setCourseImage, 'Image', 5 * 1024 * 1024)}
//                         className="hidden"
//                       />
//                     </label>
//                     {(courseImage || editingCourse?.courseImage?.url) && (
//                       <div className="relative">
//                         <img
//                           src={getFilePreview(courseImage, editingCourse?.courseImage?.url)}
//                           alt="Course preview"
//                           className="h-32 w-full object-cover rounded-lg border"
//                         />
//                       </div>
//                     )}
//                   </div>
//                   <p className="text-xs text-gray-500 mt-2">
//                     Recommended: 800x450px, JPG/PNG/WEBP, max 5MB
//                   </p>
//                 </div>

//                 {/* Preview Video */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Course Preview Video
//                   </label>
//                   <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors bg-white">
//                     <Video className="h-8 w-8 text-gray-400 mb-2" />
//                     <span className="text-sm text-gray-600">
//                       {coursePreviewVideo ? 'Change Video' : 'Upload Preview Video'}
//                     </span>
//                     <input
//                       type="file"
//                       accept="video/*"
//                       onChange={handleFileChange(setCoursePreviewVideo, 'Video', 50 * 1024 * 1024)}
//                       className="hidden"
//                     />
//                   </label>
//                   {coursePreviewVideo && (
//                     <p className="text-xs text-green-600 mt-2">
//                       Selected: {coursePreviewVideo.name}
//                     </p>
//                   )}
//                   <p className="text-xs text-gray-500 mt-2">
//                     MP4, MOV, AVI, max 50MB
//                   </p>
//                 </div>

//                 {/* Course Book */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Course Book (PDF)
//                   </label>
//                   <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors bg-white">
//                     <FileText className="h-8 w-8 text-gray-400 mb-2" />
//                     <span className="text-sm text-gray-600">
//                       {courseBook ? 'Change PDF' : 'Upload Course Book'}
//                     </span>
//                     <input
//                       type="file"
//                       accept=".pdf"
//                       onChange={handleFileChange(setCourseBook, 'PDF', 10 * 1024 * 1024)}
//                       className="hidden"
//                     />
//                   </label>
//                   {courseBook && (
//                     <p className="text-xs text-green-600 mt-2">
//                       Selected: {courseBook.name}
//                     </p>
//                   )}
//                 </div>

//                 {/* Project PDF */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Project PDF
//                   </label>
//                   <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors bg-white">
//                     <FileText className="h-8 w-8 text-gray-400 mb-2" />
//                     <span className="text-sm text-gray-600">
//                       {projectPDF ? 'Change PDF' : 'Upload Project PDF'}
//                     </span>
//                     <input
//                       type="file"
//                       accept=".pdf"
//                       onChange={handleFileChange(setProjectPDF, 'PDF', 10 * 1024 * 1024)}
//                       className="hidden"
//                     />
//                   </label>
//                   {projectPDF && (
//                     <p className="text-xs text-green-600 mt-2">
//                       Selected: {projectPDF.name}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </section>

//             {/* Tags Section */}
//             <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
//               <h5 className="text-lg font-semibold text-gray-900 mb-4">Tags & Organization</h5>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Course Tags
//                 </label>
//                 <div className="flex flex-wrap gap-2 mb-3">
//                   {formData.tags.map((tag, index) => (
//                     <span
//                       key={index}
//                       className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
//                     >
//                       {tag}
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveTag(tag)}
//                         className="ml-1 text-blue-600 hover:text-blue-800"
//                       >
//                         <X className="h-3 w-3" />
//                       </button>
//                     </span>
//                   ))}
//                 </div>
//                 <div className="flex space-x-2">
//                   <input
//                     type="text"
//                     value={tagInput}
//                     onChange={(e) => setTagInput(e.target.value)}
//                     onKeyPress={handleTagInputKeyPress}
//                     placeholder="Add a tag and press Enter..."
//                     className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                   <button
//                     type="button"
//                     onClick={handleAddTag}
//                     className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
//                   >
//                     <Plus className="h-4 w-4" />
//                   </button>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-2">
//                   Add relevant tags to help students discover your course
//                 </p>
//               </div>
//             </section>

//             {/* Note about Lessons */}
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <InformationCircleIcon className="h-5 w-5 text-blue-400" />
//                 </div>
//                 <div className="ml-3">
//                   <h3 className="text-sm font-medium text-blue-800">
//                     Lessons Management
//                   </h3>
//                   <div className="mt-2 text-sm text-blue-700">
//                     <p>
//                       Lessons are managed separately after creating the course. 
//                       You can add, edit, and organize lessons from the course management page.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Submit Buttons */}
//           <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
//             <button
//               type="button"
//               onClick={handleClose}
//               className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
//               disabled={loading}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <Save className="h-5 w-5" />
//               <span>
//                 {loading 
//                   ? (editingCourse ? "Updating..." : "Creating...") 
//                   : (editingCourse ? "Update Course" : "Create Course")
//                 }
//               </span>
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// // Helper component for information icon
// const InformationCircleIcon = ({ className }) => (
//   <svg className={className} fill="currentColor" viewBox="0 0 20 20">
//     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//   </svg>
// )

// export default AddCourse

"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { X, Save, Plus, Image, Video, FileText, Trash2 } from "lucide-react"
import {
  createCourse,
  updateCourse,
  setEditingCourse,
  setIsCreatingCourse,
  clearError,
  clearSuccess
} from "../store/slices/courseSlice"

const AddCourse = ({ onClose, editingCourse }) => {
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.courses)

  const [formData, setFormData] = useState({
    courseTitle: "",
    courseGuide: "",
    courseSummary: "",
    price: "",
    duration: "",
    mode: "online",
    category: "",
    difficulty: "beginner",
    language: "English",
    tags: [],
    isActive: true
  })

  const [courseImage, setCourseImage] = useState(null)
  const [coursePreviewVideo, setCoursePreviewVideo] = useState(null)
  const [courseBook, setCourseBook] = useState(null)
  const [projectPDF, setProjectPDF] = useState(null)
  const [localError, setLocalError] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [qaPairs, setQaPairs] = useState([
    { id: 1, question: "", answer: "" }
  ])

  // Initialize form with editing course data
  useEffect(() => {
    if (editingCourse) {
      setFormData({
        courseTitle: editingCourse.courseTitle || "",
        courseGuide: editingCourse.courseGuide || "",
        courseSummary: editingCourse.courseSummary || "",
        price: editingCourse.price?.toString() || "",
        duration: editingCourse.duration || "",
        mode: editingCourse.mode || "online",
        category: editingCourse.category || "",
        difficulty: editingCourse.difficulty || "beginner",
        language: editingCourse.language || "English",
        tags: editingCourse.tags || [],
        isActive: editingCourse.isActive !== false
      })
    }
  }, [editingCourse])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleQaChange = (id, field, value) => {
    setQaPairs(prev => prev.map(pair =>
      pair.id === id ? { ...pair, [field]: value } : pair
    ))
  }

  const handleFileChange = (setter, fileType, maxSize) => (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > maxSize) {
        setLocalError(`${fileType} size should be less than ${maxSize / (1024 * 1024)}MB`)
        return
      }
      setter(file)
      setLocalError("")
    }
  }

  const validateForm = () => {
    const errors = []
    
    if (!formData.courseTitle.trim()) errors.push("Course title is required")
    if (!formData.courseGuide.trim()) errors.push("Course guide is required")
    if (!formData.courseSummary.trim()) errors.push("Course summary is required")
    if (!formData.price || parseFloat(formData.price) < 0) errors.push("Valid price is required")
    if (!formData.duration.trim()) errors.push("Course duration is required")
    if (!formData.category) errors.push("Category is required")
    
    if (!editingCourse && !courseImage) {
      errors.push("Course image is required for new courses")
    }

    if (errors.length > 0) {
      setLocalError(errors.join(", "))
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError("")

    if (!validateForm()) {
      return
    }

    try {
      const submitData = new FormData()
      
      // Append form data
      Object.keys(formData).forEach(key => {
        if (key === 'tags') {
          submitData.append(key, JSON.stringify(formData[key]))
        } else if (key === 'price') {
          submitData.append(key, parseFloat(formData[key]))
        } else {
          submitData.append(key, formData[key])
        }
      })

      // ✅ FIXED: Use correct field names that match your backend
      if (courseImage) {
        submitData.append('courseImage', courseImage)
      }
      if (coursePreviewVideo) {
        submitData.append('previewVideo', coursePreviewVideo)
      }
      if (courseBook) {
        submitData.append('courseBook', courseBook)
      }
      if (projectPDF) {
        submitData.append('projectPDF', projectPDF)
      }

      // ✅ DEBUG: Log form data to check field names
      console.log("FormData entries:")
      for (let [key, value] of submitData.entries()) {
        console.log(key, value instanceof File ? `File: ${value.name}` : value)
      }

      if (editingCourse) {
        await dispatch(updateCourse({
          courseId: editingCourse._id,
          courseData: submitData
        })).unwrap()
      } else {
        await dispatch(createCourse(submitData)).unwrap()
      }
      
      handleClose()
    } catch (error) {
      console.error("Error saving course:", error)
      setLocalError(error.message || "Failed to save course")
    }
  }

  const handleClose = () => {
    setFormData({
      courseTitle: "",
      courseGuide: "",
      courseSummary: "",
      price: "",
      duration: "",
      mode: "online",
      category: "",
      difficulty: "beginner",
      language: "English",
      tags: [],
      isActive: true
    })
    setCourseImage(null)
    setCoursePreviewVideo(null)
    setCourseBook(null)
    setProjectPDF(null)
    setLocalError("")
    dispatch(clearError())
    dispatch(clearSuccess())
    onClose()
  }

  const getFilePreview = (file, existingUrl) => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return existingUrl
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div>
            <h4 className="text-2xl font-bold text-gray-900">
              {editingCourse ? "Edit Course" : "Create New Course"}
            </h4>
            <p className="text-gray-600 mt-1">
              {editingCourse ? "Update your course details" : "Fill in the details to create a new course"}
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(95vh-80px)]">
          <div className="p-6 space-y-8">
            {/* Error Messages */}
            {(error || localError) && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm font-medium">{error || localError}</p>
              </div>
            )}

            {/* Basic Information Section */}
            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h5 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    name="courseTitle"
                    value={formData.courseTitle}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., React JS Masterclass"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Business">Business</option>
                    <option value="Creative">Creative</option>
                    <option value="Technology">Technology</option>
                    <option value="Health">Health</option>
                    <option value="Language">Language</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="e.g., 4999"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration *
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 8 weeks, 40 hours"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mode *
                  </label>
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level *
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="rounded text-blue-600 mr-3 focus:ring-blue-500"
                    id="isActive"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Course is active and visible to students
                  </label>
                </div>
              </div>
            </section>

            {/* Course Content Section */}
            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h5 className="text-lg font-semibold text-gray-900 mb-4">Course Content</h5>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Guide *
                  </label>
                  <textarea
                    name="courseGuide"
                    value={formData.courseGuide}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    placeholder="Detailed guide about the course, curriculum, learning outcomes, teaching methodology..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Summary *
                  </label>
                  <textarea
                    name="courseSummary"
                    value={formData.courseSummary}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Brief summary of the course that will be displayed on the course card (max 1000 characters)"
                    maxLength={1000}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.courseSummary.length}/1000 characters
                  </p>
                </div>
              </div>
            </section>

            {/* Media Files Section */}
            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h5 className="text-lg font-semibold text-gray-900 mb-4">Media & Resources</h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Course Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Image {!editingCourse && '*'}
                  </label>
                  <div className="space-y-3">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors bg-white">
                      <Image className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        {courseImage ? 'Change Image' : 'Upload Course Image'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange(setCourseImage, 'Image', 5 * 1024 * 1024)}
                        className="hidden"
                      />
                    </label>
                    {(courseImage || editingCourse?.courseImage?.url) && (
                      <div className="relative">
                        <img
                          src={getFilePreview(courseImage, editingCourse?.courseImage?.url)}
                          alt="Course preview"
                          className="h-32 w-full object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Recommended: 800x450px, JPG/PNG/WEBP, max 5MB
                  </p>
                </div>

                {/* Preview Video */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Preview Video
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors bg-white">
                    <Video className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      {coursePreviewVideo ? 'Change Video' : 'Upload Preview Video'}
                    </span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange(setCoursePreviewVideo, 'Video', 50 * 1024 * 1024)}
                      className="hidden"
                    />
                  </label>
                  {coursePreviewVideo && (
                    <p className="text-xs text-green-600 mt-2">
                      Selected: {coursePreviewVideo.name}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    MP4, MOV, AVI, max 50MB
                  </p>
                </div>

                {/* Course Book */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Book (PDF)
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors bg-white">
                    <FileText className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      {courseBook ? 'Change PDF' : 'Upload Course Book'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange(setCourseBook, 'PDF', 10 * 1024 * 1024)}
                      className="hidden"
                    />
                  </label>
                  {courseBook && (
                    <p className="text-xs text-green-600 mt-2">
                      Selected: {courseBook.name}
                    </p>
                  )}
                </div>

                {/* Project PDF */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project PDF
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors bg-white">
                    <FileText className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      {projectPDF ? 'Change PDF' : 'Upload Project PDF'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange(setProjectPDF, 'PDF', 10 * 1024 * 1024)}
                      className="hidden"
                    />
                  </label>
                  {projectPDF && (
                    <p className="text-xs text-green-600 mt-2">
                      Selected: {projectPDF.name}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Tags Section */}
            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h5 className="text-lg font-semibold text-gray-900 mb-4">Tags & Organization</h5>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagInputKeyPress}
                    placeholder="Add a tag and press Enter..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Add relevant tags to help students discover your course
                </p>
              </div>
            </section>

            {/* Q&A Section */}
            <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h5 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h5>
              <p className="text-sm text-gray-600 mb-6">
                Add common questions and answers that students might have about your course. This helps build trust and provides quick information.
              </p>

              <div className="space-y-4">
                {qaPairs.map((pair, index) => (
                  <div key={pair.id} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <h6 className="text-sm font-medium text-gray-900">Q&A Pair {index + 1}</h6>
                      {(pair.question.trim() || pair.answer.trim()) && (
                        <button
                          type="button"
                          onClick={() => handleQaChange(pair.id, 'question', '') || handleQaChange(pair.id, 'answer', '')}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Question
                        </label>
                        <input
                          type="text"
                          value={pair.question}
                          onChange={(e) => handleQaChange(pair.id, 'question', e.target.value)}
                          placeholder="e.g., What are the prerequisites for this course?"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Answer
                        </label>
                        <textarea
                          value={pair.answer}
                          onChange={(e) => handleQaChange(pair.id, 'answer', e.target.value)}
                          rows={2}
                          placeholder="Provide a clear and helpful answer..."
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Tip: Focus on the most common questions students ask. You can leave the pair empty if you don't need it.
              </p>
            </section>

            {/* Note about Lessons */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <InformationCircleIcon className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Lessons Management
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Lessons are managed separately after creating the course. 
                      You can add, edit, and organize lessons from the course management page.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
            <button
              type="button"
              onClick={handleClose}
              className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              <span>
                {loading 
                  ? (editingCourse ? "Updating..." : "Creating...") 
                  : (editingCourse ? "Update Course" : "Create Course")
                }
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Helper component for information icon
const InformationCircleIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
)

export default AddCourse