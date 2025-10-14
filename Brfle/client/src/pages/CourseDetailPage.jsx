// "use client"

// import { useState, useEffect, useRef } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import { useSelector, useDispatch } from "react-redux"
// import { Play, Clock, Users, Star, BookOpen, Award, CheckCircle, Globe, Share2, Heart, X, Send } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"
// import { 
//   fetchCourseDetails, 
//   submitCourseReview,
//   fetchCourseReviews 
// } from "../store/slices/courseSlice"
// import { 
//   enrollInCourse, 
//   updateCourseProgress,
//   fetchCourseProgress 
// } from "../store/slices/enrollmentSlice"

// const CourseDetailPage = () => {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
  
//   // Redux selectors
//   const { user, isAuthenticated } = useSelector((state) => state.auth)
//   const { 
//     currentCourse: course, 
//     loading: courseLoading, 
//     error: courseError,
//     reviews,
//     reviewLoading 
//   } = useSelector((state) => state.courses)
  
//   const { 
//     enrollments,
//     currentProgress: userProgress,
//     enrollmentLoading,
//     progressLoading 
//   } = useSelector((state) => state.enrollments)

//   // Local state
//   const [activeTab, setActiveTab] = useState("overview")
//   const [isVideoPlaying, setIsVideoPlaying] = useState(false)
//   const [showVideoControls, setShowVideoControls] = useState(false)
//   const [relatedCourses, setRelatedCourses] = useState([])
//   const [relatedCoursesLoading, setRelatedCoursesLoading] = useState(false)
//   const [comment, setComment] = useState("")
//   const [rating, setRating] = useState(0)
//   const [showReviewModal, setShowReviewModal] = useState(false)
//   const [completedVideos, setCompletedVideos] = useState(new Set())
//   const [showReviewPrompt, setShowReviewPrompt] = useState(false)

//   const videoRef = useRef(null)
  
//   // Derived state
//   const isEnrolled = enrollments.some(enrollment => enrollment.course._id === id)
//   const currentEnrollment = enrollments.find(enrollment => enrollment.course._id === id)

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchCourseDetails(id))
//       dispatch(fetchCourseReviews(id))
      
//       if (isAuthenticated) {
//         dispatch(fetchCourseProgress(id))
//       }
//     }
//   }, [id, dispatch, isAuthenticated])

//   const markVideoAsCompleted = (videoId) => {
//     const newCompletedVideos = new Set(completedVideos)
//     newCompletedVideos.add(videoId)
//     setCompletedVideos(newCompletedVideos)
//     localStorage.setItem(`completedVideos_${id}`, JSON.stringify([...newCompletedVideos]))
    
//     if (!localStorage.getItem(`reviewSubmitted_${id}`)) {
//       setTimeout(() => {
//         setShowReviewModal(true)
//       }, 2000)
//     }
//   }

//   const handleSubmitReview = async (e) => {
//     e.preventDefault()

//     if (rating === 0 || !comment.trim()) {
//       alert("Please provide rating and comment")
//       return
//     }

//     if (!course?._id) {
//       alert("Course details not loaded yet.")
//       return
//     }

//     try {
//       const result = await dispatch(submitCourseReview({
//         courseId: id,
//         rating,
//         comment
//       })).unwrap()

//       // Reset form on success
//       setRating(0)
//       setComment("")
//       setShowReviewModal(false)
//       localStorage.setItem(`reviewSubmitted_${id}`, 'true')
//       alert("Your review has been submitted successfully!")
      
//     } catch (error) {
//       alert(error.message || "Failed to submit review")
//     }
//   }

//   const handleEnroll = () => {
//     if (!isAuthenticated) {
//       navigate("/login")
//       return
//     }

//     if (course.price === 0) {
//       dispatch(enrollInCourse(id))
//         .unwrap()
//         .then(() => {
//           alert("Enrolled successfully!")
//           // Refresh course details to update enrollment status
//           dispatch(fetchCourseDetails(id))
//         })
//         .catch(error => {
//           alert(error.message || "Failed to enroll")
//         })
//     } else {
//       navigate(`/checkout/${course._id}`)
//     }
//   }

//   const handleUpdateProgress = (lessonId) => {
//     if (!isEnrolled) return

//     dispatch(updateCourseProgress({
//       courseId: id,
//       lessonId,
//       timeSpent: 30 // minutes
//     }))
//       .unwrap()
//       .then(() => {
//         // Progress updated successfully
//         console.log("Progress updated")
//       })
//       .catch(error => {
//         console.error("Failed to update progress:", error)
//       })
//   }

//   const getUserInfoFromReview = (review) => {
//     if (review.user && review.user.name) {
//       return {
//         name: review.user.name,
//         avatar: review.user.avatar || review.user.profilePicture || "/placeholder.svg"
//       }
//     }
    
//     if (review.userId && review.userId.name) {
//       return {
//         name: review.userId.name,
//         avatar: review.userId.avatar || review.userId.profilePicture || "/placeholder.svg"
//       }
//     }
    
//     if (review.createdBy && review.createdBy.name) {
//       return {
//         name: review.createdBy.name,
//         avatar: review.createdBy.avatar || review.createdBy.profilePicture || "/placeholder.svg"
//       }
//     }
    
//     if (review.author && review.author.name) {
//       return {
//         name: review.author.name,
//         avatar: review.author.avatar || review.author.profilePicture || "/placeholder.svg"
//       }
//     }
    
//     if (review.userName) {
//       return {
//         name: review.userName,
//         avatar: review.userAvatar || "/placeholder.svg"
//       }
//     }
    
//     if (review.name) {
//       return {
//         name: review.name,
//         avatar: review.avatar || "/placeholder.svg"
//       }
//     }
    
//     return {
//       name: "Anonymous",
//       avatar: "/placeholder.svg"
//     }
//   }

//   const formatDuration = (minutes) => {
//     const hours = Math.floor(minutes / 60)
//     const mins = minutes % 60
//     return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
//   }

//   const formatPrice = (price) => {
//     return price === 0 ? "Free" : `₹${price}`
//   }

//   const handlePlayVideo = () => {
//     if (videoRef.current) {
//       setIsVideoPlaying(true)
//       setShowVideoControls(true)
//       videoRef.current.play().catch((error) => {
//         console.error('Error playing video:', error)
//         videoRef.current.controls = true
//       })
//     }
//   }

//   const fetchRelatedCourses = async (category) => {
//     setRelatedCoursesLoading(true)
//     try {
//       const response = await fetch(`http://localhost:2000/api/courses?category=${category}&limit=4`)
//       if (response.ok) {
//         const data = await response.json()
//         const filteredCourses = data.courses.filter(course => course._id !== id)
//         setRelatedCourses(filteredCourses)
//       }
//     } catch (error) {
//       console.error("Error fetching related courses:", error)
//     } finally {
//       setRelatedCoursesLoading(false)
//     }
//   }

//   const tabs = [
//     { id: "overview", label: "Overview" },
//     { id: "curriculum", label: "Curriculum" },
//     { id: "reviews", label: "Reviews" },
//     { 
//       id: "certificate", 
//       label: "Certificate", 
//       locked: isEnrolled && currentEnrollment?.progress?.completionPercentage < 100 
//     },
//   ]

//   // Review Modal Component
//   const ReviewModal = () => (
//     <AnimatePresence>
//       {showReviewModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.9, y: 20 }}
//             className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto overflow-hidden"
//           >
//             {/* Header */}
//             <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
//               <button
//                 onClick={() => setShowReviewModal(false)}
//                 className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
//               >
//                 <X className="h-6 w-6" />
//               </button>
//               <div className="text-center">
//                 <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
//                   <Star className="h-8 w-8" />
//                 </div>
//                 <h3 className="text-xl font-bold mb-2">How was your learning experience?</h3>
//                 <p className="text-blue-100">Share your thoughts with other students</p>
//               </div>
//             </div>

//             {/* Review Form */}
//             <div className="p-6">
//               <form onSubmit={handleSubmitReview} className="space-y-4">
//                 {/* Star Rating */}
//                 <div className="text-center">
//                   <div className="flex justify-center space-x-1 mb-2">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <button
//                         key={star}
//                         type="button"
//                         onClick={() => setRating(star)}
//                         className="text-3xl transition-transform hover:scale-110 focus:scale-110"
//                       >
//                         {star <= rating ? (
//                           <Star className="h-8 w-8 text-yellow-400 fill-current" />
//                         ) : (
//                           <Star className="h-8 w-8 text-gray-300 hover:text-yellow-400" />
//                         )}
//                       </button>
//                     ))}
//                   </div>
//                   <p className="text-sm text-gray-600">
//                     {rating === 0 ? "Tap to rate" : `You rated ${rating} star${rating > 1 ? 's' : ''}`}
//                   </p>
//                 </div>

//                 {/* Comment */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Your Review
//                   </label>
//                   <textarea
//                     value={comment}
//                     onChange={(e) => setComment(e.target.value)}
//                     placeholder="What did you like about this course? What could be improved?"
//                     className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                     rows={4}
//                   />
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                   type="submit"
//                   disabled={reviewLoading || rating === 0 || !comment.trim()}
//                   className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
//                 >
//                   {reviewLoading ? (
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                   ) : (
//                     <>
//                       <Send className="h-4 w-4" />
//                       <span>Submit Review</span>
//                     </>
//                   )}
//                 </button>

//                 {/* Skip Button */}
//                 <button
//                   type="button"
//                   onClick={() => setShowReviewModal(false)}
//                   className="w-full text-gray-600 py-2 rounded-lg font-medium hover:text-gray-800 transition-colors"
//                 >
//                   Maybe later
//                 </button>
//               </form>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </AnimatePresence>
//   )

//   // Review Prompt Component (floating button)
//   const ReviewPrompt = () => (
//     <AnimatePresence>
//       {showReviewPrompt && (
//         <motion.button
//           initial={{ opacity: 0, scale: 0, x: 100 }}
//           animate={{ opacity: 1, scale: 1, x: 0 }}
//           exit={{ opacity: 0, scale: 0, x: 100 }}
//           onClick={() => setShowReviewModal(true)}
//           className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl z-40 hover:shadow-3xl transition-all hover:scale-110 group"
//         >
//           <div className="flex items-center space-x-2">
//             <Star className="h-5 w-5" />
//             <span className="font-semibold text-sm">Review Course</span>
//           </div>
//           <div className="absolute -top-2 -right-2">
//             <motion.div
//               animate={{ scale: [1, 1.2, 1] }}
//               transition={{ duration: 2, repeat: Infinity }}
//               className="w-3 h-3 bg-green-400 rounded-full"
//             />
//           </div>
//         </motion.button>
//       )}
//     </AnimatePresence>
//   )

//   if (courseLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="animate-pulse">
//             <div className="bg-gray-300 h-64 rounded-lg mb-8"></div>
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               <div className="lg:col-span-2">
//                 <div className="bg-gray-300 h-8 rounded mb-4"></div>
//                 <div className="bg-gray-300 h-4 rounded mb-2"></div>
//                 <div className="bg-gray-300 h-4 rounded w-3/4"></div>
//               </div>
//               <div className="bg-gray-300 h-96 rounded-lg"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (courseError || !course) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">
//             {courseError || "Course not found"}
//           </h2>
//           <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
//           <button
//             onClick={() => navigate("/courses")}
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Browse Courses
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Review Modal */}
//       <ReviewModal />
      
//       {/* Floating Review Prompt */}
//       <ReviewPrompt />

//       {/* Hero Section */}
//       <div className="bg-gray-900 text-white py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-2">
//               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
//                 <div className="flex items-center space-x-2 mb-4">
//                   <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">{course.category}</span>
//                   <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">{course.level}</span>
//                 </div>

//                 <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
//                 <p className="text-xl text-gray-300 mb-6">{course.description}</p>

//                 <div className="flex items-center space-x-6 mb-6">
//                   <div className="flex items-center space-x-1">
//                     <Star className="h-5 w-5 text-yellow-400 fill-current" />
//                     <span className="font-medium">{course.avgRating}</span>
//                     <span className="text-gray-300">({course.reviewCount} reviews)</span>
//                   </div>
//                   <div className="flex items-center space-x-1">
//                     <Users className="h-5 w-5" />
//                     <span>{course.enrollmentCount.toLocaleString()} students</span>
//                   </div>
//                   <div className="flex items-center space-x-1">
//                     <Clock className="h-5 w-5" />
//                     <span>{formatDuration(course.duration)}</span>
//                   </div>
//                 </div>
//               </motion.div>
//             </div>

//             {/* Course Preview */}
//             <div className="lg:col-span-1">
//               <motion.div
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.6, delay: 0.2 }}
//                 className="bg-white rounded-lg shadow-lg overflow-hidden"
//               >
//                 <div className="relative bg-gray-100">
//                   {course.thumbnail && course.thumbnail.match(/\.(mp4|webm|ogg|mov|avi|flv)$/i) ? (
//                     <video
//                       ref={videoRef}
//                       src={course.thumbnail}
//                       className="w-full h-48 object-cover"
//                       muted
//                       controls={false}
//                       preload="metadata"
//                       onEnded={() => markVideoAsCompleted('preview')}
//                     />
//                   ) : (
//                     <img
//                       src={course.thumbnail || "/placeholder.svg"}
//                       alt={course.title}
//                       className="w-full h-48 object-cover"
//                     />
//                   )}
//                   <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
//                     <button
//                       onClick={handlePlayVideo}
//                       className="bg-white bg-opacity-90 rounded-full p-4 hover:bg-opacity-100 transition-all"
//                     >
//                       <Play className="h-8 w-8 text-gray-900 ml-1" />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="p-6">
//                   <div className="text-3xl font-bold text-gray-900 mb-4">{formatPrice(course.price)}</div>

//                   {isEnrolled ? (
//                     <div className="space-y-3">
//                       <button
//                         onClick={() => navigate(`/courses/${course._id}/learn`)}
//                         className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
//                       >
//                         <Play className="h-5 w-5" />
//                         <span>Continue Learning</span>
//                       </button>
//                     </div>
//                   ) : (
//                     <button
//                       onClick={handleEnroll}
//                       disabled={enrollmentLoading}
//                       className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {enrollmentLoading ? "Enrolling..." : course.price === 0 ? "Enroll for Free" : "Buy Now"}
//                     </button>
//                   )}

//                   <div className="mt-4 space-y-2 text-sm text-gray-600">
//                     <div className="flex items-center justify-between">
//                       <span>Full lifetime access</span>
//                       <CheckCircle className="h-4 w-4 text-green-500" />
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span>Access on mobile</span>
//                       <CheckCircle className="h-4 w-4 text-green-500" />
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span>Certificate of completion</span>
//                       <Award className="h-4 w-4 text-green-500" />
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Course Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2">
//             {/* Tabs */}
//             <div className="border-b border-gray-200 mb-8">
//               <nav className="flex space-x-8">
//                 {tabs.map((tab) => (
//                   <button
//                     key={tab.id}
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                       activeTab === tab.id
//                         ? "border-blue-500 text-blue-600"
//                         : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                     } ${tab.locked ? 'opacity-50 cursor-not-allowed' : ''}`}
//                     disabled={tab.locked}
//                   >
//                     {tab.label}
//                   </button>
//                 ))}
//               </nav>
//             </div>

//             {/* Tab Content */}
//             <motion.div
//               key={activeTab}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               {activeTab === "overview" && (
//                 <div className="space-y-8">
//                   <div>
//                     <h3 className="text-2xl font-bold text-gray-900 mb-4">What you'll learn</h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {course.whatYouWillLearn?.map((item, index) => (
//                         <div key={index} className="flex items-start space-x-3">
//                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
//                           <span className="text-gray-700">{item}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <div>
//                     <h3 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h3>
//                     <ul className="space-y-2">
//                       {course.requirements?.map((requirement, index) => (
//                         <li key={index} className="flex items-start space-x-3">
//                           <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
//                           <span className="text-gray-700">{requirement}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div>
//                     <h3 className="text-2xl font-bold text-gray-900 mb-4">Course Details</h3>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                       <div className="text-center p-4 bg-gray-50 rounded-lg">
//                         <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
//                         <div className="font-semibold">{course.lessons?.length || 0}</div>
//                         <div className="text-sm text-gray-600">Lessons</div>
//                       </div>
//                       <div className="text-center p-4 bg-gray-50 rounded-lg">
//                         <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
//                         <div className="font-semibold">{formatDuration(course.duration)}</div>
//                         <div className="text-sm text-gray-600">Duration</div>
//                       </div>
//                       <div className="text-center p-4 bg-gray-50 rounded-lg">
//                         <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
//                         <div className="font-semibold">{course.language}</div>
//                         <div className="text-sm text-gray-600">Language</div>
//                       </div>
//                       <div className="text-center p-4 bg-gray-50 rounded-lg">
//                         <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
//                         <div className="font-semibold">Certificate</div>
//                         <div className="text-sm text-gray-600">Included</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {activeTab === "curriculum" && (
//                 <div>
//                   <div className="mb-6">
//                     <h3 className="text-2xl font-bold text-gray-900">Course Curriculum</h3>
//                   </div>
//                   <div className="space-y-4">
//                     {course.lessons?.map((lesson, index) => (
//                       <div
//                         key={lesson._id}
//                         className={`border border-gray-200 rounded-lg p-4 ${
//                           isEnrolled ? "cursor-pointer hover:shadow-md hover:border-blue-300 transition-all" : ""
//                         }`}
//                         onClick={() => {
//                           if (isEnrolled) {
//                             navigate(`/courses/${course._id}/learn?lesson=${lesson._id}`)
//                             handleUpdateProgress(lesson._id)
//                           }
//                         }}
//                       >
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center space-x-4">
//                             <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                               <span className="text-sm font-medium text-blue-600">{index + 1}</span>
//                             </div>
//                             <div>
//                               <h4 className="font-medium text-gray-900">{lesson.title}</h4>
//                               <div className="flex items-center space-x-4 text-sm text-gray-600">
//                                 <span className="flex items-center space-x-1">
//                                   <Clock className="h-4 w-4" />
//                                   <span>{formatDuration(lesson.duration)}</span>
//                                 </span>
//                                 {lesson.preview && (
//                                   <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Preview</span>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                           {lesson.preview ? (
//                             <button
//                               className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
//                               onClick={(e) => {
//                                 e.stopPropagation()
//                                 navigate(`/courses/${course._id}/learn?lesson=${lesson._id}`)
//                               }}
//                             >
//                               <Play className="h-4 w-4" />
//                               <span>Preview</span>
//                             </button>
//                           ) : isEnrolled ? (
//                             <div className="text-blue-600 flex items-center space-x-1">
//                               <Play className="h-4 w-4" />
//                               <span className="text-sm">Watch</span>
//                             </div>
//                           ) : null}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {activeTab === "reviews" && (
//                 <div>
//                   <h3 className="text-2xl font-bold text-gray-900 mb-6">Student Reviews</h3>

//                   {/* Review Form - Only show if user is authenticated */}
//                   {isAuthenticated ? (
//                     <form onSubmit={handleSubmitReview} className="space-y-3 mb-6">
//                       <div>
//                         <label className="block mb-1 font-medium">Rating</label>
//                         <div className="flex space-x-1">
//                           {[1, 2, 3, 4, 5].map((star) => (
//                             <button
//                               key={star}
//                               type="button"
//                               onClick={() => setRating(star)}
//                               className="text-2xl transition-transform hover:scale-110"
//                             >
//                               {star <= rating ? (
//                                 <Star className="h-8 w-8 text-yellow-400 fill-current" />
//                               ) : (
//                                 <Star className="h-8 w-8 text-gray-300 hover:text-yellow-400" />
//                               )}
//                             </button>
//                           ))}
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block mb-1 font-medium">Comment</label>
//                         <textarea
//                           value={comment}
//                           onChange={(e) => setComment(e.target.value)}
//                           className="w-full p-2 border rounded"
//                           rows={3}
//                           placeholder="Write your review..."
//                         />
//                       </div>

//                       <button
//                         type="submit"
//                         disabled={reviewLoading}
//                         className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//                       >
//                         {reviewLoading ? "Submitting..." : "Submit Review"}
//                       </button>
//                     </form>
//                   ) : (
//                     <div className="mb-6 p-4 bg-blue-50 rounded-lg">
//                       <p className="text-blue-800">
//                         <strong>Want to share your experience?</strong>{' '}
//                         <button 
//                           onClick={() => navigate('/login')} 
//                           className="text-blue-600 underline hover:text-blue-800"
//                         >
//                           Login to submit a review
//                         </button>
//                       </p>
//                     </div>
//                   )}

//                   {/* List of existing reviews - ALWAYS SHOW TO PUBLIC */}
//                   {reviews.length > 0 ? (
//                     <div className="space-y-6">
//                       <h4 className="text-lg font-semibold text-gray-900 mb-4">
//                         What students are saying ({reviews.length} reviews)
//                       </h4>
//                       {reviews.map((review) => {
//                         const userInfo = getUserInfoFromReview(review);
                        
//                         return (
//                           <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
//                             <div className="flex items-start space-x-4">
//                               <img
//                                 src={userInfo.avatar}
//                                 alt={userInfo.name}
//                                 className="w-12 h-12 rounded-full"
//                               />
//                               <div className="flex-1">
//                                 <div className="flex items-center space-x-2 mb-2">
//                                   <h4 className="font-medium text-gray-900">{userInfo.name}</h4>
//                                   <div className="flex items-center">
//                                     {[...Array(review.rating)].map((_, i) => (
//                                       <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
//                                     ))}
//                                   </div>
//                                   <span className="text-sm text-gray-600">
//                                     {new Date(review.createdAt).toLocaleDateString()}
//                                   </span>
//                                 </div>
//                                 <p className="text-gray-700">{review.comment}</p>
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   ) : (
//                     <div className="text-center py-8">
//                       <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//                       <p className="text-gray-600">No reviews yet. Be the first to review this course!</p>
//                       {!isAuthenticated && (
//                         <button 
//                           onClick={() => navigate('/login')}
//                           className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                         >
//                           Login to Review
//                         </button>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </motion.div>
//           </div>

//           {/* Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="sticky top-8 space-y-6">
//               {/* Related Courses */}
//               <div className="bg-white rounded-lg shadow-sm p-6">
//                 <h4 className="text-lg font-semibold text-gray-900 mb-4">Related Courses</h4>
//                 {relatedCoursesLoading ? (
//                   <div className="space-y-4">
//                     {[1, 2, 3].map((i) => (
//                       <div key={i} className="animate-pulse flex space-x-3">
//                         <div className="w-16 h-12 bg-gray-300 rounded"></div>
//                         <div className="flex-1">
//                           <div className="h-4 bg-gray-300 rounded mb-2"></div>
//                           <div className="h-3 bg-gray-300 rounded w-3/4"></div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : relatedCourses.length > 0 ? (
//                   <div className="space-y-4">
//                     {relatedCourses.map((course) => (
//                       <div 
//                         key={course._id} 
//                         className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer" 
//                         onClick={() => navigate(`/courses/${course._id}`)}
//                       >
//                         <img
//                           src={course.thumbnail || "/placeholder.svg"}
//                           alt={course.title}
//                           className="w-16 h-12 object-cover rounded"
//                         />
//                         <div className="flex-1 min-w-0">
//                           <h5 className="font-medium text-gray-900 text-sm truncate">{course.title}</h5>
//                           <p className="text-xs text-gray-600 truncate">By {course.createdBy?.name }</p>
//                           <div className="flex items-center justify-between mt-1">
//                             <span className="text-sm font-semibold text-gray-900">{formatPrice(course.price)}</span>
//                             <div className="flex items-center space-x-1">
//                               <Star className="h-3 w-3 text-yellow-400 fill-current" />
//                               <span className="text-xs text-gray-600">{course.avgRating}</span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-gray-600">No related courses found.</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default CourseDetailPage