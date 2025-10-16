// import React, { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCourses } from "../store/slices/courseSlice";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination, Autoplay } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";

// // 🧾 Google Form Link
// const googleFormLink =
//   "https://docs.google.com/forms/d/e/1FAIpQLSdx2nW8wIvZOHT7k4w8mNzG-Va5e0K7w4URGhhO0G4GwqtUaw/viewform?embedded=true";

// // 🎥 Hero Section
// const Hero = () => {
//   const images = ["/h2.jpg", "/business.jpg", "/h3.jpeg", "/earth.jpeg"];

//   return (
//     <section className="relative w-full h-[72vh] md:h-[91vh]">
//       <Swiper
//         modules={[Pagination, Autoplay]}
//         pagination={{ clickable: true }}
//         autoplay={{ delay: 3000, disableOnInteraction: false }}
//         loop={true}
//         className="h-full w-full"
//       >
//         {images.map((src, index) => (
//           <SwiperSlide key={index}>
//             <div className="relative h-full w-full">
//               <img
//                 src={src}
//                 alt={`Hero ${index + 1}`}
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0 flex flex-col justify-center items-center text-center bg-black/40">
//                 <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg tracking-wide">
//                   BRFLE
//                 </h1>
//                 <h2 className="text-lg md:text-2xl text-white font-semibold mt-2">
//                   International Open Learning
//                 </h2>
//                 <p className="text-base md:text-xl text-gray-200 font-medium mt-2">
//                   Governing by Commune
//                 </p>
//               </div>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </section>
//   );
// };

// // 📚 Courses Section
// function Courses({ videoRef }) {
//   const dispatch = useDispatch();
//   const { courses, loading, error } = useSelector((state) => state.courses);

//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [showForm, setShowForm] = useState(false);

//   useEffect(() => {
//     dispatch(fetchCourses());
//   }, [dispatch]);

//   const openModal = (course) => {
//     setSelectedCourse(course);
//     setShowForm(false);
//     if (videoRef?.current) videoRef.current.pause();
//   };

//   const closeModal = () => {
//     setSelectedCourse(null);
//     if (videoRef?.current) videoRef.current.play();
//   };

//   // Map backend courses to desired structure
//   const mappedCourses = (courses || []).map((c) => ({
//     title: c.title,
//     category: c.category,
//     description: c.shortDescription || c.description,
//     image: c.images?.[0]?.url || c.thumbnail || "/images/default.jpg",
//     duration: c.totalDurationHours ? `${c.totalDurationHours} hrs` : "N/A",
//     fees: c.formattedPrice || "N/A",
//     mode: "Online",
//   }));

//   const allCourses = [...mappedCourses, ...mappedCourses]; // duplicate for smooth scroll

//   return (
//     <section className="py-16 bg-black overflow-hidden">
//       <h2 className="text-center text-2xl md:text-3xl font-bold text-white mb-10">
//         Select Course
//       </h2>

//       {loading && <p className="text-center text-white py-10">Loading courses...</p>}
//       {error && <p className="text-center text-red-500 py-10">{error}</p>}

//       <div className="relative w-full overflow-hidden">
//         <div className="flex animate-scroll gap-8">
//           {allCourses.map((course, index) => (
//             <div
//               key={index}
//               onClick={() => openModal(course)}
//               className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col items-center text-center min-w-[250px] hover:scale-105 transition cursor-pointer"
//             >
//               <img
//                 src={course.image}
//                 alt={course.title}
//                 className="w-80 h-48 object-cover"
//               />
//               <h3 className="mt-4 mb-6 text-lg font-semibold text-gray-800">
//                 {course.title}
//               </h3>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Modal */}
//       {selectedCourse && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
//           <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative shadow-lg overflow-y-auto max-h-[90vh]">
//             <button
//               onClick={closeModal}
//               className="absolute top-2 right-3 text-gray-500 hover:text-black text-2xl font-bold"
//             >
//               ✕
//             </button>

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
//                   <p>{selectedCourse.description}</p>
//                   <p><strong>Duration:</strong> {selectedCourse.duration}</p>
//                   <p><strong>Fees:</strong> {selectedCourse.fees}</p>
//                   <p><strong>Mode:</strong> {selectedCourse.mode}</p>
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
//               <iframe
//                 src={googleFormLink}
//                 width="100%"
//                 height="600"
//                 frameBorder="0"
//                 title="Google Form"
//               />
//             )}
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         @keyframes scroll {
//           0% { transform: translateX(0); }
//           100% { transform: translateX(-50%); }
//         }
//         .animate-scroll {
//           display: flex;
//           width: max-content;
//           animation: scroll 40s linear infinite;
//         }
//       `}</style>
//     </section>
//   );
// }

// // 🏁 Banner Section
// function Banner() {
//   return (
//     <section className="relative w-full h-[70vh]">
//       <img src="/business.jpg" alt="Banner" className="w-full h-full object-cover" />
//       <div className="absolute inset-0 flex justify-center items-center bg-black/30">
//         <h2 className="text-2xl md:text-3xl font-bold text-white">
//           Join Our Global Learning Community
//         </h2>
//       </div>
//     </section>
//   );
// }

// // 🌍 Home Page
// export default function HomePage() {
//   const videoRef = useRef(null); // optional, if you add video later
//   return (
//     <>
//       <Hero />
//       <Courses videoRef={videoRef} />
//       <Banner />
//     </>
//   );
// }


// import React, { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAllCourses } from "../store/slices/courseSlice";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination, Autoplay } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";

// // 🧾 Google Form Link
// const googleFormLink =
//   "https://docs.google.com/forms/d/e/1FAIpQLSdx2nW8wIvZOHT7k4w8mNzG-Va5e0K7w4URGhhO0G4GwqtUaw/viewform?embedded=true";

// // 🎥 Hero Section
// const Hero = () => {
//   const images = ["/h2.jpg", "/business.jpg", "/h3.jpeg", "/earth.jpeg"];

//   return (
//     <section className="relative w-full h-[72vh] md:h-[91vh]">
//       <Swiper
//         modules={[Pagination, Autoplay]}
//         pagination={{ clickable: true }}
//         autoplay={{ delay: 3000, disableOnInteraction: false }}
//         loop={true}
//         className="h-full w-full"
//       >
//         {images.map((src, index) => (
//           <SwiperSlide key={index}>
//             <div className="relative h-full w-full">
//               <img
//                 src={src}
//                 alt={`Hero ${index + 1}`}
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0 flex flex-col justify-center items-center text-center bg-black/40">
//                 <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg tracking-wide">
//                   BRFLE
//                 </h1>
//                 <h2 className="text-lg md:text-2xl text-white font-semibold mt-2">
//                   International Open Learning
//                 </h2>
//                 <p className="text-base md:text-xl text-gray-200 font-medium mt-2">
//                   Governing by Commune
//                 </p>
//               </div>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </section>
//   );
// };

// // 📚 Courses Section
// function Courses({ videoRef }) {
//   const dispatch = useDispatch();
//   const { courses, loading, error } = useSelector((state) => state.courses);

//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [showForm, setShowForm] = useState(false);

//   useEffect(() => {
//     dispatch(fetchAllCourses());
//   }, [dispatch]);

//   const openModal = (course) => {
//     setSelectedCourse(course);
//     setShowForm(false);
//     if (videoRef?.current) videoRef.current.pause();
//   };

//   const closeModal = () => {
//     setSelectedCourse(null);
//     if (videoRef?.current) videoRef.current.play();
//   };

//   // Map backend courses to frontend structure
//   const mappedCourses = (courses || []).map((course) => ({
//     _id: course._id,
//     title: course.courseTitle,
//     category: course.category,
//     description: course.courseSummary,
//     image: course.courseImage?.url || "/api/placeholder/300/200",
//     duration: course.duration || "Self-paced",
//     price: course.price,
//     mode: course.mode,
//     difficulty: course.difficulty,
//     totalStudents: course.totalStudents || 0,
//     averageRating: course.averageRating || 0
//   }));

//   const allCourses = [...mappedCourses, ...mappedCourses]; // duplicate for smooth scroll

//   const formatPrice = (price) => {
//     if (!price && price !== 0) return "Free";
//     return `₹${price}`;
//   };

//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty) {
//       case 'beginner':
//         return 'bg-green-100 text-green-800';
//       case 'intermediate':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'advanced':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <section className="py-16 bg-black overflow-hidden">
//       <div className="text-center mb-12">
//         <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
//           Featured Courses
//         </h2>
//         <p className="text-gray-300 max-w-2xl mx-auto">
//           Discover our carefully curated selection of career-transforming courses designed for modern learners
//         </p>
//       </div>

//       {loading && (
//         <div className="flex justify-center items-center py-10">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
//         </div>
//       )}
      
//       {error && (
//         <div className="text-center text-red-500 py-10 bg-red-50 mx-4 rounded-lg">
//           <p className="font-medium">Error loading courses</p>
//           <p className="text-sm">{error}</p>
//         </div>
//       )}

//       {!loading && !error && mappedCourses.length === 0 && (
//         <div className="text-center text-gray-300 py-10">
//           <p className="text-lg">No courses available at the moment</p>
//           <p className="text-sm">Check back soon for new courses!</p>
//         </div>
//       )}

//       {!loading && !error && mappedCourses.length > 0 && (
//         <div className="relative w-full overflow-hidden">
//           <div className="flex animate-scroll gap-6 px-4">
//             {allCourses.map((course, index) => (
//               <div
//                 key={`${course._id}-${index}`}
//                 onClick={() => openModal(course)}
//                 className="bg-white shadow-xl rounded-xl overflow-hidden flex flex-col min-w-[280px] hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-200 hover:shadow-2xl"
//               >
//                 {/* Course Image */}
//                 <div className="relative h-48 overflow-hidden">
//                   <img
//                     src={course.image}
//                     alt={course.title}
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.target.src = '/api/placeholder/300/200';
//                     }}
//                   />
//                   <div className="absolute top-3 left-3">
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
//                       {course.difficulty?.charAt(0).toUpperCase() + course.difficulty?.slice(1)}
//                     </span>
//                   </div>
//                   <div className="absolute top-3 right-3">
//                     <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
//                       {course.category}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Course Content */}
//                 <div className="p-4 flex-1 flex flex-col">
//                   <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight">
//                     {course.title}
//                   </h3>
                  
//                   <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
//                     {course.description}
//                   </p>

//                   {/* Course Meta */}
//                   <div className="space-y-2 mb-3">
//                     <div className="flex items-center justify-between text-sm text-gray-500">
//                       <span>⏱️ {course.duration}</span>
//                       <span>👥 {course.totalStudents}</span>
//                     </div>
//                     <div className="flex items-center justify-between text-sm">
//                       <div className="flex items-center">
//                         <span className="text-yellow-400">⭐</span>
//                         <span className="text-gray-700 ml-1">
//                           {course.averageRating || 'New'}
//                         </span>
//                       </div>
//                       <span className="text-gray-500 capitalize">{course.mode}</span>
//                     </div>
//                   </div>

//                   {/* Price */}
//                   <div className="mt-auto pt-3 border-t border-gray-100">
//                     <div className="flex items-center justify-between">
//                       <span className="text-2xl font-bold text-gray-900">
//                         {formatPrice(course.price)}
//                       </span>
//                       <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
//                         Enroll Now
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Course Details Modal */}
//       {selectedCourse && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
//           <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative shadow-2xl overflow-y-auto max-h-[90vh]">
//             <button
//               onClick={closeModal}
//               className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
//             >
//               ✕
//             </button>

//             {!showForm ? (
//               <>
//                 {/* Course Header */}
//                 <div className="relative h-64 rounded-lg overflow-hidden mb-6">
//                   <img
//                     src={selectedCourse.image}
//                     alt={selectedCourse.title}
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.target.src = '/api/placeholder/300/200';
//                     }}
//                   />
//                   <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
//                     <div className="flex flex-wrap gap-2">
//                       <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedCourse.difficulty)}`}>
//                         {selectedCourse.difficulty?.charAt(0).toUpperCase() + selectedCourse.difficulty?.slice(1)}
//                       </span>
//                       <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
//                         {selectedCourse.category}
//                       </span>
//                       <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium capitalize">
//                         {selectedCourse.mode}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Course Details */}
//                 <div className="space-y-6">
//                   <div>
//                     <h2 className="text-3xl font-bold text-gray-900 mb-3">
//                       {selectedCourse.title}
//                     </h2>
//                     <p className="text-gray-700 leading-relaxed">
//                       {selectedCourse.description}
//                     </p>
//                   </div>

//                   {/* Course Stats */}
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-gray-200">
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-gray-900">{formatPrice(selectedCourse.price)}</div>
//                       <div className="text-sm text-gray-500">Course Fee</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-gray-900">{selectedCourse.duration}</div>
//                       <div className="text-sm text-gray-500">Duration</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-gray-900">{selectedCourse.totalStudents}+</div>
//                       <div className="text-sm text-gray-500">Students</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-gray-900 flex items-center justify-center">
//                         <span className="text-yellow-400 mr-1">⭐</span>
//                         {selectedCourse.averageRating || 'New'}
//                       </div>
//                       <div className="text-sm text-gray-500">Rating</div>
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex flex-col sm:flex-row gap-3 pt-4">
//                     <button
//                       onClick={() => setShowForm(true)}
//                       className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold text-lg"
//                     >
//                       Enroll Now - {formatPrice(selectedCourse.price)}
//                     </button>
//                     <button
//                       onClick={closeModal}
//                       className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
//                     >
//                       Browse More Courses
//                     </button>
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <div>
//                 <div className="mb-4">
//                   <h3 className="text-xl font-bold text-gray-900 mb-2">
//                     Enroll in {selectedCourse.title}
//                   </h3>
//                   <p className="text-gray-600">
//                     Please fill out the form below to enroll in this course.
//                   </p>
//                 </div>
//                 <iframe
//                   src={googleFormLink}
//                   width="100%"
//                   height="600"
//                   frameBorder="0"
//                   title="Course Enrollment Form"
//                   className="rounded-lg"
//                 />
//                 <div className="mt-4 text-center">
//                   <button
//                     onClick={() => setShowForm(false)}
//                     className="text-blue-600 hover:text-blue-800 font-medium"
//                   >
//                     ← Back to Course Details
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         @keyframes scroll {
//           0% { transform: translateX(0); }
//           100% { transform: translateX(-50%); }
//         }
//         .animate-scroll {
//           display: flex;
//           width: max-content;
//           animation: scroll 40s linear infinite;
//         }
        
//         .line-clamp-2 {
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//       `}</style>
//     </section>
//   );
// }

// // 🏁 Banner Section
// function Banner() {
//   return (
//     <section className="relative w-full h-[70vh]">
//       <img 
//         src="/business.jpg" 
//         alt="Banner" 
//         className="w-full h-full object-cover" 
//       />
//       <div className="absolute inset-0 flex justify-center items-center bg-black/30">
//         <div className="text-center text-white max-w-2xl mx-4">
//           <h2 className="text-3xl md:text-4xl font-bold mb-4">
//             Join Our Global Learning Community
//           </h2>
//           <p className="text-lg md:text-xl mb-6">
//             Transform your career with industry-relevant skills and join thousands of successful learners worldwide
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <button className="px-8 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition font-semibold">
//               Explore All Courses
//             </button>
//             <button className="px-8 py-3 border border-white text-white rounded-lg hover:bg-white/10 transition font-semibold">
//               Learn More
//             </button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// // 🌍 Home Page
// export default function HomePage() {
//   const videoRef = useRef(null);
  
//   return (
//     <div className="min-h-screen bg-white">
//       <Hero />
//       <Courses videoRef={videoRef} />
//       <Banner />
//     </div>
//   );
// }



// import React, { useState, useRef } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination, Autoplay } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";

// // 🧩 Courses Data
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
//     image: "/images/heritage.jpg",
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

// // 🧾 Google Form Link
// const googleFormLink =
//   "https://docs.google.com/forms/d/e/1FAIpQLSdx2nW8wIvZOHT7k4w8mNzG-Va5e0K7w4URGhhO0G4GwqtUaw/viewform?embedded=true";

// // 🎥 Hero Section (Updated with Swiper Slider)
// const Hero = () => {
//   const images = ["/computer.jpg", "/hills.jpg", "/office.jpg", "/culture.jpg"];

//   return (
//     <section className="relative w-full h-[72vh] md:h-[91vh]">
//       <Swiper
//         modules={[Pagination, Autoplay]}
//         pagination={{ clickable: true }}
//         autoplay={{
//           delay: 3000,
//           disableOnInteraction: false,
//         }}
//         loop={true}
//         className="h-full w-full"
//       >
//         {images.map((src, index) => (
//           <SwiperSlide key={index}>
//             <div className="relative h-full w-full">
//               <img
//                 src={src}
//                 alt={`Hero ${index + 1}`}
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0 flex flex-col justify-center items-center text-center bg-black/40">
//                 <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg tracking-wide">
//                   BRFLE
//                 </h1>
//                 <h2 className="text-lg md:text-2xl text-white font-semibold mt-2">
//                   International Open Learning
//                 </h2>
//                 <p className="text-base md:text-xl text-gray-200 font-medium mt-2">
//                   Governing by Commune
//                 </p>
//               </div>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </section>
//   );
// };

// // 📚 Courses Section
// function Courses({ videoRef }) {
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [showForm, setShowForm] = useState(false);

//   const openModal = (course) => {
//     setSelectedCourse(course);
//     setShowForm(false);
//     if (videoRef?.current) videoRef.current.pause();
//   };

//   const closeModal = () => {
//     setSelectedCourse(null);
//     if (videoRef?.current) videoRef.current.play();
//   };

//   const allCourses = [...courses, ...courses]; // Duplicate for smooth scrolling

//   return (
//     <section className="py-16 bg-black overflow-hidden">
//       <h2 className="text-center text-2xl md:text-3xl font-bold text-white mb-10">
//         Select Course
//       </h2>

//       <div className="relative w-full overflow-hidden">
//         <div className="flex animate-scroll gap-8">
//           {allCourses.map((course, index) => (
//             <div
//               key={index}
//               onClick={() => openModal(course)}
//               className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col items-center text-center min-w-[250px] hover:scale-105 transition cursor-pointer"
//             >
//               <img
//                 src={course.image}
//                 alt={course.title}
//                 className="w-80 h-48 object-cover"
//               />
//               <h3 className="mt-4 mb-6 text-lg font-semibold text-gray-800">
//                 {course.title}
//               </h3>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Modal */}
//       {selectedCourse && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
//           <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative shadow-lg overflow-y-auto max-h-[90vh]">
//             <button
//               onClick={closeModal}
//               className="absolute top-2 right-3 text-gray-500 hover:text-black text-2xl font-bold"
//             >
//               ✕
//             </button>

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
//                     <h3 className="font-semibold text-gray-900">
//                       Fees for Admission
//                     </h3>
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

//       <style jsx>{`
//         @keyframes scroll {
//           0% {
//             transform: translateX(0);
//           }
//           100% {
//             transform: translateX(-50%);
//           }
//         }
//         .animate-scroll {
//           display: flex;
//           width: max-content;
//           animation: scroll 40s linear infinite;
//         }
//       `}</style>
//     </section>
//   );
// }

// // 🏁 Banner Section
// function Banner() {
//   return (
//     <section className="relative w-full h-[70vh]">
//       <img src="/business.jpg" alt="Banner" className="w-full h-full object-cover" />
//       <div className="absolute inset-0 flex justify-center items-center bg-black/30">
//         <h2 className="text-2xl md:text-3xl font-bold text-white">
//           Join Our Global Learning Community
//         </h2>
//       </div>
//     </section>
//   );
// }

// // 🌍 Main Page
// export default function HomePage() {
//   const videoRef = useRef(null); // optional, if you add video later
//   return (
//     <>
//       <Hero />
//       <Courses videoRef={videoRef} />
//       <Banner />
//     </>
//   );
// }


import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { fetchAllCourses } from "../store/slices/courseSlice";
import { createPaymentOrder } from "../store/slices/paymentSlice";

// 🧾 Google Form Link
const googleFormLink =
  "https://docs.google.com/forms/d/e/1FAIpQLSc4fy4tKIvNkEUdDhtm63CQWLNOH9qufQoL4Rndy-RnPz-yzg/viewform";

// 🎥 Hero Section with Redux Integration
const Hero = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courses, loading, error } = useSelector((state) => state.courses);
  const { loading: paymentLoading } = useSelector((state) => state.payments);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showCheckoutButton, setShowCheckoutButton] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const images = ["/hhh.jpg", "/business.jpg", "/h3.jpeg", "/earth.jpeg"];

  useEffect(() => {
    // Fetch courses when component mounts
    dispatch(fetchAllCourses());
  }, [dispatch]);

  const openModal = (course) => {
    setSelectedCourse(course);
    setShowForm(false);
    setShowCheckoutButton(false);
    setFormSubmitted(false);
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setShowForm(false);
    setShowCheckoutButton(false);
    setFormSubmitted(false);
  };

  const handleProceedToCheckout = async () => {
    if (selectedCourse) {
      try {
        // Create payment order using Redux
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
        closeModal();
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

  // Use Redux courses data instead of static data
  const displayCourses = courses.length > 0 ? courses : [];

  // Duplicate courses for smooth scrolling effect if we have courses
  const allCourses = displayCourses.length > 0 ? [...displayCourses, ...displayCourses] : [];

  return (
    <>
      {/* Hero Slider Section */}
      <section className="relative w-full h-[72vh] md:h-[91vh]">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="h-full w-full"
        >
          {images.map((src, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full w-full">
                <img
                  src={src}
                  alt={`Hero ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center bg-black/40">
                  <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg tracking-wide">
                    BRFLE
                  </h1>
                  <h2 className="text-lg md:text-2xl text-white font-semibold mt-2">
                    International Open Learning
                  </h2>
                  <p className="text-base md:text-xl text-gray-200 font-medium mt-2">
                    Governing by Commune
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Courses Section with Redux Data */}
      <section className="py-16 bg-black overflow-hidden">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Select Course
          </h2>
        </div>

        {loading && (
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4">Loading courses...</p>
          </div>
        )}

        {error && (
          <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-lg mx-4">
            Error loading courses: {error}
          </div>
        )}

        {!loading && displayCourses.length === 0 && (
          <div className="text-center text-white">
            <p>No courses available at the moment.</p>
          </div>
        )}

        {!loading && displayCourses.length > 0 && (
          <div className="relative w-full h-[70%] overflow-hidden">
            <div className="flex animate-scroll gap-9">
              {allCourses.map((course, index) => (
                <div
                  key={`${course._id || index}-${index}`}
                  onClick={() => openModal(course)}
                  className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col items-center text-center min-w-[250px] hover:scale-105 transition cursor-pointer"
                >
                  <img
                    src={course.courseImage?.url || course.image || "/default-course.jpg"}
                    alt={course.courseTitle || course.title}
                    className="w-80 h-[78%]  object-cover"
                  />
                  <h3 className="mt-2 mb-2 text-lg font-semibold text-gray-800 px-4">
                    {course.courseTitle || course.title}
                  </h3>
                  <h4 className="text-[100%] text-gray-800 mb-2">
                    {course.category || "General"}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Join Our Global Learning Community Section - FULL WIDTH */}
        <div className="relative w-full mt-16 overflow-hidden">
          <img 
            src="/images/three.jpg" 
            alt="Join Our Global Learning Community"
            className="w-full h-60 md:h-[600px] object-cover"
            onError={(e) => {
              e.target.src = "/images/earth.jpeg"; // Fallback image
            }}
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h3 className="text-3xl md:text-4xl text-white lg:text-3xl font-bold mb-5 drop-shadow-lg">
                Join Our Global Learning Community
              </h3>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto drop-shadow-md">
                Connect with learners from around the world and transform your career
              </p>
            </div>
          </div>
        </div>

        {/* Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative shadow-lg overflow-y-auto max-h-[90vh]">
              <button
                onClick={closeModal}
                className="absolute top-2 right-3 text-gray-500 hover:text-black text-2xl font-bold"
              >
                ✕
              </button>

              {/* Show course info or Google Form */}
              {!showForm ? (
                <>
                  <img
                    src={selectedCourse.courseImage?.url || selectedCourse.image || "/default-course.jpg"}
                    alt={selectedCourse.courseTitle || selectedCourse.title}
                    className="w-full h-56 object-cover rounded-lg mb-4"
                  />
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    {selectedCourse.courseTitle || selectedCourse.title}
                  </h2>

                  <div className="space-y-4 text-gray-700">
                    <div>
                      <h3 className="font-semibold text-gray-900">Course Description</h3>
                      <p className="text-sm">{selectedCourse.courseSummary || selectedCourse.description}</p>
                    </div>
                    
                    {selectedCourse.courseGuide && (
                      <div>
                        <h3 className="font-semibold text-gray-900">Course Guide</h3>
                        <p className="text-sm">{selectedCourse.courseGuide}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold text-gray-900">Duration</h3>
                      <p className="text-sm">{selectedCourse.duration || "Self-paced"}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">Mode</h3>
                      <p className="text-sm">{selectedCourse.mode || "Online"}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">Category</h3>
                      <p className="text-sm">{selectedCourse.category || "General"}</p>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900">Pricing</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span>Course Fees:</span>
                        <span className="font-bold">
                          {selectedCourse.price ? `₹${selectedCourse.price.toLocaleString()}` : (selectedCourse.fees || "₹15,000")}
                        </span>
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
                          I've Submitted the Form - Proceed To Checkout
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-scroll {
            display: flex;
            width: max-content;
            animation: scroll 40s linear infinite;
          }
        `}</style>
      </section>
    </>
  );
};

export default Hero;