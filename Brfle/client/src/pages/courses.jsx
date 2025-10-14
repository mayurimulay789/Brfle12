// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { fetchAllCourses } from "../store/slices/courseSlice";

// // ✅ Common Google Form link
// const googleFormLink =
//   "https://docs.google.com/forms/d/e/1FAIpQLSdx2nW8wIvZOHT7k4w8mNzG-Va5e0K7w4URGhhO0G4GwqtUaw/viewform?embedded=true";

// export default function Courses() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { courses, loading, error } = useSelector((state) => state.courses);

//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [formSubmitted, setFormSubmitted] = useState(false);

//   useEffect(() => {
//     dispatch(fetchAllCourses());
//   }, [dispatch]);

//   const openModal = (course) => {
//     setSelectedCourse(course);
//     setShowForm(false);
//     setFormSubmitted(false);
//   };

//   const closeModal = () => {
//     setSelectedCourse(null);
//     setShowForm(false);
//     setFormSubmitted(false);
//   };

//   const handleProceedToEnroll = () => {
//     setShowForm(true);
//   };

//   const handleFormSubmission = () => {
//     setFormSubmitted(true);
//     setTimeout(() => {
//       if (selectedCourse) {
//         navigate(`/checkout/${selectedCourse._id}`);
//       }
//       closeModal();
//     }, 2000);
//   };

//   if (loading)
//     return <p className="text-center py-20 text-lg text-gray-700">Loading courses...</p>;
//   if (error)
//     return <p className="text-center py-20 text-red-500">Error: {error}</p>;

//   return (
//     <div className="py-16 px-6 bg-gray-100">
//       <div className="max-w-7xl mx-auto text-center">
//         <h1 className="text-4xl font-bold mb-4 text-gray-900">Initial Course Offerings</h1>
//         <p className="text-gray-700 mb-12 max-w-2xl mx-auto">
//           Practical and immediate career-oriented courses designed to transform lives.
//         </p>

//         {/* ===== Courses Grid ===== */}
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {(courses || []).map((course, index) => (
//             <div
//               key={course._id || index}
//               className="rounded-xl overflow-hidden shadow-md bg-white flex flex-col hover:shadow-xl transition-shadow duration-300"
//             >
//               <img
//                 src={course.image}
//                 alt={course.title}
//                 className="w-full h-56 object-cover transition-transform duration-500 hover:scale-110"
//               />
//               <div className="p-5 text-center flex flex-col flex-1">
//                 <p className="text-xl font-semibold text-gray-900">{course.title}</p>
//                 <p className="text-sm text-gray-500 mt-1">{course.category}</p>

//                 {course.guideBy && (
//                   <p className="text-sm text-gray-600 mt-1 italic">
//                     Guided by <span className="font-medium">{course.guideBy}</span>
//                   </p>
//                 )}

//                 <p className="text-xs text-gray-600 mt-2 line-clamp-3">{course.description}</p>

//                 <div className="mt-3">
//                   <p className="text-gray-900 font-bold text-lg">
//                     ₹{course.price}{" "}
//                     {course.originalPrice && (
//                       <span className="text-sm text-gray-500 line-through ml-1">
//                         ₹{course.originalPrice}
//                       </span>
//                     )}
//                   </p>
//                 </div>

//                 <div className="flex justify-center gap-3 mt-2 text-xs text-gray-600">
//                   {course.duration && <p>🕒 {course.duration} weeks</p>}
//                   {course.mode && <p>📚 {course.mode}</p>}
//                   {course.level && <p>⭐ {course.level}</p>}
//                 </div>

//                 <button
//                   onClick={() => openModal(course)}
//                   className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
//                 >
//                   View Details
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ===== Modal Section ===== */}
//       {selectedCourse && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
//           <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative shadow-lg overflow-y-auto max-h-[90vh]">
//             <button
//               onClick={closeModal}
//               className="absolute top-2 right-3 text-gray-500 hover:text-black text-2xl font-bold z-10"
//             >
//               ✕
//             </button>

//             {/* ===== Show course info or Google Form ===== */}
//             {!showForm ? (
//               <>
//                 <img
//                   src={selectedCourse.image}
//                   alt={selectedCourse.title}
//                   className="w-full h-56 object-cover rounded-lg mb-4"
//                 />
//                 <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
//                   {selectedCourse.title}
//                 </h2>
//                 <p className="text-center text-gray-600 mb-4">
//                   Guided by <span className="font-medium">{selectedCourse.guideBy}</span>
//                 </p>

//                 <div className="space-y-4 text-gray-700">
//                   <div>
//                     <h3 className="font-semibold text-gray-900">Course Overview</h3>
//                     <p className="text-sm leading-relaxed">{selectedCourse.description}</p>
//                   </div>

//                   {selectedCourse.introduction && (
//                     <div>
//                       <h3 className="font-semibold text-gray-900">Introduction</h3>
//                       <p className="text-sm leading-relaxed">{selectedCourse.introduction}</p>
//                     </div>
//                   )}

//                   {selectedCourse.benefits?.length > 0 && (
//                     <div>
//                       <h3 className="font-semibold text-gray-900">Benefits</h3>
//                       <ul className="list-disc list-inside text-sm space-y-1">
//                         {selectedCourse.benefits.map((b, i) => (
//                           <li key={i}>{b}</li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}

//                   <div className="grid grid-cols-2 gap-4 text-sm">
//                     {selectedCourse.duration && (
//                       <p>
//                         <span className="font-semibold">Duration:</span> {selectedCourse.duration} weeks
//                       </p>
//                     )}
//                     {selectedCourse.mode && (
//                       <p>
//                         <span className="font-semibold">Mode:</span> {selectedCourse.mode}
//                       </p>
//                     )}
//                     {selectedCourse.level && (
//                       <p>
//                         <span className="font-semibold">Level:</span> {selectedCourse.level}
//                       </p>
//                     )}
//                     <p>
//                       <span className="font-semibold">Fee:</span> ₹{selectedCourse.price}{" "}
//                       {selectedCourse.originalPrice && (
//                         <span className="line-through text-gray-500 ml-1">
//                           ₹{selectedCourse.originalPrice}
//                         </span>
//                       )}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="mt-6 text-center">
//                   <button
//                     onClick={handleProceedToEnroll}
//                     className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
//                   >
//                     Proceed to Enroll
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
//                   Enrollment Form - {selectedCourse.title}
//                 </h2>

//                 {formSubmitted ? (
//                   <div className="text-center py-8">
//                     <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <svg
//                         className="w-8 h-8 text-green-600"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M5 13l4 4L19 7"
//                         ></path>
//                       </svg>
//                     </div>
//                     <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                       Form Submitted Successfully!
//                     </h3>
//                     <p className="text-gray-600">Redirecting to checkout page...</p>
//                   </div>
//                 ) : (
//                   <>
//                     <iframe
//                       src={googleFormLink}
//                       width="100%"
//                       height="400"
//                       frameBorder="0"
//                       marginHeight="0"
//                       marginWidth="0"
//                       title="Google Form"
//                       className="mb-4 rounded-lg"
//                     >
//                       Loading…
//                     </iframe>
//                     <div className="text-center">
//                       <button
//                         onClick={handleFormSubmission}
//                         className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
//                       >
//                         Submit Form & Proceed to Checkout
//                       </button>
//                       <p className="text-xs text-gray-500 mt-2">
//                         After filling the form, click above to proceed to payment
//                       </p>
//                     </div>
//                   </>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// import React, { useState } from "react";
// const courses = [
//   {
//     title: "Well Being and Conscious Life",
//     category: "Personal Development",
//     description:
//       "Develop holistic wellness through mindful living, spiritual growth, and balanced lifestyle practices.",
//     image: "/images/Wellness.jpeg",
//     duration: "6 Weeks",
//     fees: "₹12,000",
//     mode: "Online",
//   },
//   {
//     title: "Holistic Governance and Administration",
//     category: "Leadership",
//     description:
//       "Master the art of ethical leadership and comprehensive administrative practices for modern organizations.",
//     image: "/images/Governor.jpeg",
//     duration: "8 Weeks",
//     fees: "₹15,000",
//     mode: "Hybrid (Online + Workshop)",
//   },
//   {
//     title: "AI",
//     category: "Technology",
//     description:
//       "Explore the fascinating world of AI, machine learning, and their practical applications in various industries.",
//     image: "/images/AI.jpeg",
//     duration: "10 Weeks",
//     fees: "₹18,000",
//     mode: "Online",
//   },
//   {
//     title: "Innovator",
//     category: "Business",
//     description:
//       "Learn to cultivate creativity, problem-solving skills, and innovative thinking for real-world applications.",
//     image: "/images/Innovator.jpeg",
//     duration: "6 Weeks",
//     fees: "₹14,000",
//     mode: "Offline/Online",
//   },
//   {
//     title: "Exporter",
//     category: "Business",
//     description:
//       "Understand international trade, export strategies, and global market opportunities.",
//     image: "/images/exporter.jpeg",
//     duration: "8 Weeks",
//     fees: "₹16,000",
//     mode: "Online",
//   },
//   {
//     title: "Tourism",
//     category: "Industry",
//     description:
//       "Discover the dynamics of tourism industry and learn to create memorable travel experiences.",
//     image: "/images/t1.jpg",
//     duration: "6 Weeks",
//     fees: "₹10,000",
//     mode: "Hybrid",
//   },

//   {
//     title: "Heritage Conservation",
//     category: "Culture & History",
//     description:
//       "Learn to preserve and manage cultural heritage and historical sites.",
//     image: "/heritage.jpg",
//     duration: "6 Weeks",
//     fees: "₹12,000",
//     mode: "Online",
//   },
//   {
//     title: "Intelligence Investigator",
//     category: "Security & Investigation",
//     description:
//       "Develop skills in intelligence gathering, investigation techniques, and analytical reasoning.",
//     image: "/images/Intelligence1.jpeg",
//     duration: "8 Weeks",
//     fees: "₹15,000",
//     mode: "Offline/Online",
//   },
// ];


// // ✅ Common Google Form link
// const googleFormLink =
//   "https://docs.google.com/forms/d/e/1FAIpQLSdx2nW8wIvZOHT7k4w8mNzG-Va5e0K7w4URGhhO0G4GwqtUaw/viewform?embedded=true";

// export default function Courses() {
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [showForm, setShowForm] = useState(false);

//   const openModal = (course) => {
//     setSelectedCourse(course);
//     setShowForm(false);
//   };

//   return (
//     <div className="py-16 px-6 bg-gray-100">
//       <div className="max-w-7xl mx-auto text-center">
//         <h1 className="text-4xl font-bold mb-4 text-gray-900">
//           Initial Course Offerings
//         </h1>
//         <p className="text-gray-700 mb-12 max-w-2xl mx-auto">
//           Practical and immediate career-oriented courses designed to transform
//           lives and build expertise in emerging fields.
//         </p>

//         {/* Courses List */}
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {courses.map((course, index) => (
//             <div
//               key={index}
//               className="rounded-xl overflow-hidden shadow-md bg-white flex flex-col"
//             >
//               <img
//                 src={course.image}
//                 alt={course.title}
//                 className="w-full h-56 object-cover transition-transform duration-500 hover:scale-110"
//               />
//               <div className="p-4 text-center flex flex-col flex-1">
//                 <p className="text-lg font-bold text-gray-900">{course.title}</p>
//                  <p className="text-sm text-gray-500 mt-2">{course.category}</p>
//                 <p className="text-xs text-gray-600 mt-2">{course.description}</p>

//                 <button
//                   onClick={() => openModal(course)}
//                   className="mt-4 inline-block px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
//                 >
//                   Enroll Now
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Modal */}
//       {selectedCourse && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
//           <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative shadow-lg overflow-y-auto max-h-[90vh]">
//             <button
//               onClick={() => setSelectedCourse(null)}
//               className="absolute top-2 right-3 text-gray-500 hover:text-black text-2xl font-bold"
//             >
//               ✕
//             </button>

//             {/* Show course info or Google Form */}
//             {!showForm ? (
//               <>
//                 <img
//                   src={selectedCourse.image}
//                   alt={selectedCourse.title}
//                   className="w-full h-56 object-cover rounded-lg mb-4"
//                 />
//                 <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
//                   {selectedCourse.title}
//                 </h2>

//                 <div className="space-y-4 text-gray-700">
//                   <div>
//                     <h3 className="font-semibold text-gray-900">Course Info</h3>
//                     <p className="text-sm">{selectedCourse.description}</p>
//                   </div>

//                   <div>
//                     <h3 className="font-semibold text-gray-900">Duration</h3>
//                     <p className="text-sm">{selectedCourse.duration}</p>
//                   </div>

//                   <div>
//                     <h3 className="font-semibold text-gray-900">Fees for Admission</h3>
//                     <p className="text-sm">{selectedCourse.fees}</p>
//                   </div>

//                   <div>
//                     <h3 className="font-semibold text-gray-900">Mode</h3>
//                     <p className="text-sm">{selectedCourse.mode}</p>
//                   </div>
//                 </div>

//                 <div className="mt-6 text-center">
//                   <button
//                     onClick={() => setShowForm(true)}
//                     className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
//                   >
//                     Proceed to Enroll
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
//                   Enrollment Form
//                 </h2>
//                 <iframe
//                   src={googleFormLink}
//                   width="100%"
//                   height="600"
//                   frameBorder="0"
//                   marginHeight="0"
//                   marginWidth="0"
//                   title="Google Form"
//                 >
//                   Loading…
//                 </iframe>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { fetchAllCourses } from "../store/slices/courseSlice";
// import { createPaymentOrder } from "../store/slices/paymentSlice";

// const googleFormLink = "https://docs.google.com/forms/d/e/1FAIpQLSdx2nW8wIvZOHT7k4w8mNzG-Va5e0K7w4URGhhO0G4GwqtUaw/viewform?embedded=true";

// export default function Courses() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { courses, loading, error } = useSelector((state) => state.courses);
//   const { order, loading: paymentLoading } = useSelector((state) => state.payments);

//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [showCheckoutButton, setShowCheckoutButton] = useState(false);
//   const [formSubmitted, setFormSubmitted] = useState(false);

//   useEffect(() => {
//     dispatch(fetchAllCourses());
//   }, [dispatch]);

//   const openModal = (course) => {
//     setSelectedCourse(course);
//     setShowForm(false);
//     setShowCheckoutButton(false);
//     setFormSubmitted(false);
//   };

//   const handleProceedToCheckout = async () => {
//     if (selectedCourse) {
//       try {
//         // Create payment order
//         await dispatch(createPaymentOrder(selectedCourse._id)).unwrap();
        
//         // Navigate to checkout with course and order data
//         navigate("/courses/checkout", { 
//           state: { 
//             course: selectedCourse,
//             formSubmitted: true
//           } 
//         });
        
//         // Reset modal state
//         setSelectedCourse(null);
//         setShowForm(false);
//         setShowCheckoutButton(false);
//         setFormSubmitted(false);
//       } catch (error) {
//         console.error("Failed to create payment order:", error);
//         alert("Failed to proceed to checkout. Please try again.");
//       }
//     }
//   };

//   const handleFormSubmission = () => {
//     setFormSubmitted(true);
//     setShowCheckoutButton(true);
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="py-16 px-6 bg-gray-100">
//         <div className="max-w-7xl mx-auto text-center">
//           <div className="animate-pulse">
//             <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
//             <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-12"></div>
//             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {[...Array(6)].map((_, index) => (
//                 <div key={index} className="rounded-xl overflow-hidden shadow-md bg-white">
//                   <div className="w-full h-56 bg-gray-300"></div>
//                   <div className="p-4">
//                     <div className="h-6 bg-gray-300 rounded mb-2"></div>
//                     <div className="h-4 bg-gray-300 rounded mb-2"></div>
//                     <div className="h-4 bg-gray-300 rounded mb-4"></div>
//                     <div className="h-10 bg-gray-300 rounded"></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="py-16 px-6 bg-gray-100">
//         <div className="max-w-7xl mx-auto text-center">
//           <h1 className="text-4xl font-bold mb-4 text-gray-900">
//             Initial Course Offerings
//           </h1>
//           <div className="text-red-500 bg-red-100 p-4 rounded-lg">
//             Error loading courses: {error}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="py-16 px-6 bg-gray-100">
//       <div className="max-w-7xl mx-auto text-center">
//         <h1 className="text-4xl font-bold mb-4 text-gray-900">
//           Initial Course Offerings
//         </h1>
//         <p className="text-gray-700 mb-12 max-w-2xl mx-auto">
//           Practical and immediate career-oriented courses designed to transform
//           lives and build expertise in emerging fields.
//         </p>

//         {/* Courses List */}
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {courses.map((course, index) => (
//             <div
//               key={course._id || index}
//               className="rounded-xl overflow-hidden shadow-md bg-white flex flex-col"
//             >
//               <img
//                 src={course.courseImage.url}
//                 alt={course.courseTitle}
//                 className="w-full h-56 object-cover transition-transform duration-500 hover:scale-110"
//               />
//               <div className="p-4 text-center flex flex-col flex-1">
//                 <p className="text-lg font-bold text-gray-900">{course.courseTitle}</p>
//                 <p className="text-sm text-gray-500 mt-2">{course.category}</p>
//                 <p className="text-xs text-gray-600 mt-2">{course.courseSummary}</p>
//                 <p className="text-lg font-bold text-gray-900 mt-2">
//                   {course.price || "₹15,000"}
//                 </p>

//                 <button
//                   onClick={() => openModal(course)}
//                   className="mt-4 inline-block px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
//                 >
//                   Enroll Now
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Modal */}
//       {selectedCourse && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
//           <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative shadow-lg overflow-y-auto max-h-[90vh]">
//             <button
//               onClick={() => setSelectedCourse(null)}
//               className="absolute top-2 right-3 text-gray-500 hover:text-black text-2xl font-bold"
//             >
//               ✕
//             </button>

//             {/* Show course info or Google Form */}
//             {!showForm ? (
//               <>
//                 <video
//                   src={selectedCourse.coursePreviewVideo.url}
//                   alt={selectedCourse.courseTitle}
//                   className="w-full h-56 object-cover rounded-lg mb-4"
//                   controls
//                   autoPlay
//                   muted
//                 />
//                 <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
//                   {selectedCourse.courseTitle}
//                 </h2>

//                 <div className="space-y-4 text-gray-700">
//                   <div>
//                     <h3 className="font-semibold text-gray-900">Course Benefits</h3>
//                     <p className="text-sm">{selectedCourse.description}</p>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-900">Course Guide</h3>
//                     <p className="text-sm">{selectedCourse.courseGuide}</p>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-900">Course Summary</h3>
//                     <p className="text-sm">{selectedCourse.courseSummary}</p>
//                   </div>

//                   <div>
//                     <h3 className="font-semibold text-gray-900">Duration</h3>
//                     <p className="text-sm">{selectedCourse.duration}</p>
//                   </div>

//                   <div>
//                     <h3 className="font-semibold text-gray-900">Mode</h3>
//                     <p className="text-sm">{selectedCourse.mode}</p>
//                   </div>

//                   <div className="bg-yellow-50 p-4 rounded-lg">
//                     <h3 className="font-semibold text-gray-900">Pricing</h3>
//                     <div className="flex justify-between items-center mt-2">
//                       <span>Course Fees:</span>
//                       <span className="font-bold">{selectedCourse.price || "₹0"}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-6 text-center">
//                   <button
//                     onClick={() => setShowForm(true)}
//                     className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
//                   >
//                     Proceed to Enroll
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
//                   Enrollment Form
//                 </h2>
                
//                 {showCheckoutButton ? (
//                   <div className="text-center">
//                     <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//                       Form submitted successfully! Click below to proceed to checkout.
//                     </div>
//                     <button
//                       onClick={handleProceedToCheckout}
//                       disabled={paymentLoading}
//                       className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
//                     >
//                       {paymentLoading ? "Processing..." : "Proceed to Checkout"}
//                     </button>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
//                       Please fill out the form below. After submission, click the "I've Submitted the Form" button.
//                     </div>
//                     <iframe
//                       src={googleFormLink}
//                       width="100%"
//                       height="500"
//                       frameBorder="0"
//                       marginHeight="0"
//                       marginWidth="0"
//                       title="Google Form"
//                       onLoad={() => {
//                         // This will trigger when iframe loads, but note: 
//                         // We can't detect form submission due to cross-origin restrictions
//                         // So we rely on manual button click
//                       }}
//                     >
//                       Loading…
//                     </iframe>
//                     <div className="mt-4 text-center">
//                       <button
//                         onClick={handleFormSubmission}
//                         className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
//                       >
//                         I've Submitted the Form - Proceed to Checkout
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllCourses } from "../store/slices/courseSlice";
import { createPaymentOrder } from "../store/slices/paymentSlice";

const googleFormLink = "https://docs.google.com/forms/d/e/1FAIpQLSdx2nW8wIvZOHT7k4w8mNzG-Va5e0K7w4URGhhO0G4GwqtUaw/viewform?embedded=true";

export default function Courses() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courses, loading, error } = useSelector((state) => state.courses);
  const { paymentStatus, loading: paymentLoading, currentOrder } = useSelector((state) => state.payments);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showCheckoutButton, setShowCheckoutButton] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    dispatch(fetchAllCourses());
  }, [dispatch]);

  const openModal = (course) => {
    setSelectedCourse(course);
    setShowForm(false);
    setShowCheckoutButton(false);
    setFormSubmitted(false);
  };

  const handleProceedToCheckout = async () => {
    if (selectedCourse) {
      try {
        // Create payment order
        const result = await dispatch(createPaymentOrder(selectedCourse._id)).unwrap();
        
        // Navigate to checkout with course and order data
        navigate("/checkout", { 
          state: { 
            course: selectedCourse,
            order: result.order,
            razorpayKey: result.key
          } 
        });
        
        // Reset modal state
        setSelectedCourse(null);
        setShowForm(false);
        setShowCheckoutButton(false);
        setFormSubmitted(false);
      } catch (error) {
        console.error("Failed to create payment order:", error);
        alert("Failed to proceed to checkout. Please try again.");
      }
    }
  };

  const handleFormSubmission = () => {
    setFormSubmitted(true);
    setShowCheckoutButton(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="py-16 px-6 bg-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-12"></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="rounded-xl overflow-hidden shadow-md bg-white">
                  <div className="w-full h-56 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-16 px-6 bg-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Initial Course Offerings
          </h1>
          <div className="text-red-500 bg-red-100 p-4 rounded-lg">
            Error loading courses: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-6 bg-gray-100">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Initial Course Offerings
        </h1>
        <p className="text-gray-700 mb-12 max-w-2xl mx-auto">
          Practical and immediate career-oriented courses designed to transform
          lives and build expertise in emerging fields.
        </p>

        {/* Courses List */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <div
              key={course._id || index}
              className="rounded-xl overflow-hidden shadow-md bg-white flex flex-col"
            >
              <img
                src={course.courseImage?.url || "/default-course.jpg"}
                alt={course.courseTitle}
                className="w-full h-56 object-cover transition-transform duration-500 hover:scale-110"
              />
              <div className="p-4 text-center flex flex-col flex-1">
                <p className="text-lg font-bold text-gray-900">{course.courseTitle}</p>
                <p className="text-sm text-gray-500 mt-2">{course.category}</p>
                <p className="text-xs text-gray-600 mt-2 line-clamp-3">{course.courseSummary}</p>
                <p className="text-lg font-bold text-gray-900 mt-2">
                  ₹{course.price?.toLocaleString() || "15,000"}
                </p>

                <button
                  onClick={() => openModal(course)}
                  className="mt-4 inline-block px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative shadow-lg overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedCourse(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-2xl font-bold"
            >
              ✕
            </button>

            {/* Show course info or Google Form */}
            {!showForm ? (
              <>
                {selectedCourse.coursePreviewVideo?.url && (
                  <video
                    src={selectedCourse.coursePreviewVideo.url}
                    className="w-full h-56 object-cover rounded-lg mb-4"
                    controls
                    autoPlay
                    muted
                  />
                )}
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  {selectedCourse.courseTitle}
                </h2>

                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="font-semibold text-gray-900">Course Benefits</h3>
                    <p className="text-sm">{selectedCourse.description || "Comprehensive course with hands-on learning"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Course Guide</h3>
                    <p className="text-sm">{selectedCourse.courseGuide || "Step-by-step learning path"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Course Summary</h3>
                    <p className="text-sm">{selectedCourse.courseSummary}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Duration</h3>
                    <p className="text-sm">{selectedCourse.duration || "Self-paced"}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Mode</h3>
                    <p className="text-sm">{selectedCourse.mode || "Online"}</p>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900">Pricing</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span>Course Fees:</span>
                      <span className="font-bold">₹{selectedCourse.price?.toLocaleString() || "15,000"}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                  >
                    Proceed to Enroll
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Enrollment Form
                </h2>
                
                {showCheckoutButton ? (
                  <div className="text-center">
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                      Form submitted successfully! Click below to proceed to checkout.
                    </div>
                    <button
                      onClick={handleProceedToCheckout}
                      disabled={paymentLoading}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
                    >
                      {paymentLoading ? "Processing..." : "Proceed to Checkout"}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
                      Please fill out the form below. After submission, click the "I've Submitted the Form" button.
                    </div>
                    <iframe
                      src={googleFormLink}
                      width="100%"
                      height="500"
                      frameBorder="0"
                      marginHeight="0"
                      marginWidth="0"
                      title="Google Form"
                    >
                      Loading…
                    </iframe>
                    <div className="mt-4 text-center">
                      <button
                        onClick={handleFormSubmission}
                        className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                      >
                        I've Submitted the Form - Proceed to Checkout
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}