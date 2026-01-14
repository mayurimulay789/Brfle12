// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { fetchAllCourses } from "../store/slices/courseSlice";
// import { createPaymentOrder } from "../store/slices/paymentSlice";

// const googleFormLink = "https://docs.google.com/forms/d/e/1FAIpQLSc4fy4tKIvNkEUdDhtm63CQWLNOH9qufQoL4Rndy-RnPz-yzg/viewform";

// export default function Courses() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { courses, loading, error } = useSelector((state) => state.courses);
//   const { paymentStatus, loading: paymentLoading, currentOrder } = useSelector((state) => state.payments);

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
//         const result = await dispatch(createPaymentOrder(selectedCourse._id)).unwrap();

//         // Navigate to checkout with course and order data
//         navigate("/checkout", {
//           state: {
//             course: selectedCourse,
//             order: result.order,
//             razorpayKey: result.key
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
//                 src={course.courseImage?.url || "/default-course.jpg"}
//                 alt={course.courseTitle}
//                 className="w-full h-56 object-cover transition-transform duration-500 hover:scale-110"
//               />
//               <div className="p-4 text-center flex flex-col flex-1">
//                 <p className="text-2xl font-bold text-gray-900">{course.courseTitle}</p>
//                 <p className="text-[100%] text-gray-600 mt-2">{course.category}</p>
//                 <p className="text-[100%] text-gray-700 mt-2 line-clamp-3">{course.courseSummary}</p>
//                 <p className="text-lg font-bold text-gray-900 mt-2">
//                   ₹{course.price?.toLocaleString() || "15,000"}
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
//                 {selectedCourse.coursePreviewVideo?.url && (
//                   <video
//                     src={selectedCourse.coursePreviewVideo.url}
//                     className="w-full h-56 object-cover rounded-lg mb-4"
//                     controls
//                     autoPlay
//                     muted
//                   />
//                 )}
//                 <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
//                   {selectedCourse.courseTitle}
//                 </h2>

//                 <div className="space-y-4 text-gray-700">
//                   <div>
//                     <h3 className="font-semibold text-gray-900 mb-4">Course Benefits</h3>
//                     <ul className="space-y-2 text-gray-700">
//                       {(selectedCourse.courseBenifits || "Comprehensive course with hands-on learning")
//                         .split('\n')
//                         .filter(line => line.trim() !== "") // remove empty lines
//                         .map((benefit, index) => (
//                           <li key={index} className="flex items-start">
//                             <svg
//                               className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth="2"
//                                 d="M5 13l4 4L19 7"
//                               />
//                             </svg>
//                             <span>{benefit}</span>
//                           </li>
//                         ))}
//                     </ul>
//                   </div>

//                   <div>
//                     <h3 className="font-semibold text-gray-900">Course Guide</h3>
//                     <p className="text-sm">{selectedCourse.courseGuide || "Step-by-step learning path"}</p>
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-900">Course Summary</h3>
//                     <p className="text-sm">{selectedCourse.courseSummary}</p>
//                   </div>

//                   <div>
//                     <h3 className="font-semibold text-gray-900">Duration</h3>
//                     <p className="text-sm">{selectedCourse.duration || "Self-paced"}</p>
//                   </div>

//                   <div>
//                     <h3 className="font-semibold text-gray-900">Mode</h3>
//                     <p className="text-sm">{selectedCourse.mode || "Online"}</p>
//                   </div>

//                   <div className="bg-yellow-50 p-4 rounded-lg">
//                     <h3 className="font-semibold text-gray-900">Pricing</h3>
//                     <div className="flex justify-between items-center mt-2">
//                       <span>Course Fees:</span>
//                       <span className="font-bold">₹{selectedCourse.price?.toLocaleString() || "15,000"}</span>
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






// In your Courses component, update the useEffect and add search logic
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom"; // Add useLocation
import { fetchAllCourses } from "../store/slices/courseSlice";
import { createPaymentOrder } from "../store/slices/paymentSlice";

const googleFormLink = "https://docs.google.com/forms/d/e/1FAIpQLSc4fy4tKIvNkEUdDhtm63CQWLNOH9qufQoL4Rndy-RnPz-yzg/viewform";

export default function Courses() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Add this
  const { courses, loading, error } = useSelector((state) => state.courses);
  const { paymentStatus, loading: paymentLoading, currentOrder } = useSelector((state) => state.payments);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showCheckoutButton, setShowCheckoutButton] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState([]); // Add this state
  const [searchTerm, setSearchTerm] = useState(""); // Add this state

  // Get search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('search') || '';
    setSearchTerm(searchQuery);
  }, [location.search]);

  // Fetch courses and filter them
  useEffect(() => {
    dispatch(fetchAllCourses());
  }, [dispatch]);

  // Filter courses when searchTerm or courses change
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course => {
        const searchLower = searchTerm.toLowerCase();
        return (
          (course.courseTitle && course.courseTitle.toLowerCase().includes(searchLower)) ||
          (course.category && course.category.toLowerCase().includes(searchLower)) ||
          (course.courseSummary && course.courseSummary.toLowerCase().includes(searchLower)) ||
          (course.courseBenifits && course.courseBenifits.toLowerCase().includes(searchLower))
        );
      });
      setFilteredCourses(filtered);
    }
  }, [courses, searchTerm]);

  const openModal = (course) => {
    setSelectedCourse(course);
    setShowForm(false);
    setShowCheckoutButton(false);
    setFormSubmitted(false);
  };

  const handleProceedToCheckout = async () => {
    if (selectedCourse) {
      try {
        const result = await dispatch(createPaymentOrder(selectedCourse._id)).unwrap();
        navigate("/checkout", {
          state: {
            course: selectedCourse,
            order: result.order,
            razorpayKey: result.key
          }
        });
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

        {/* Search Results Info */}
        {searchTerm && (
          <div className="mb-6 text-left max-w-2xl mx-auto">
            <p className="text-gray-700">
              Search results for: <span className="font-semibold">"{searchTerm}"</span>
              <span className="ml-4 text-sm text-gray-600">
                ({filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found)
              </span>
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                navigate('/courses');
              }}
              className="mt-2 text-sm text-amber-600 hover:text-amber-800"
            >
              Clear search
            </button>
          </div>
        )}

        <p className="text-gray-700 mb-12 max-w-2xl mx-auto">
          Practical and immediate career-oriented courses designed to transform
          lives and build expertise in emerging fields.
        </p>

        {/* No Results Message */}
        {searchTerm && filteredCourses.length === 0 && (
          <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              No courses found matching "<span className="font-semibold">{searchTerm}</span>".
              Try different keywords or browse all courses below.
            </p>
          </div>
        )}

        {/* Courses List */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(searchTerm ? filteredCourses : courses).map((course, index) => (
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
                <p className="text-2xl font-bold text-gray-900">{course.courseTitle}</p>
                <p className="text-[100%] text-gray-600 mt-2">{course.category}</p>
                <p className="text-[100%] text-gray-700 mt-2 line-clamp-3">{course.courseSummary}</p>
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

      {/* Modal (Keep your existing modal code exactly as is) */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-2xl w-full max-w-6xl shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">

            {/* Close Button */}
            <button
              onClick={() => setSelectedCourse(null)}
              className="absolute top-4 right-4 z-20 text-gray-400 hover:text-black text-2xl font-bold"
            >
              ✕
            </button>

            {/* ================= STEP 1 ================= */}
            {!showForm ? (
              <>
                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 px-10 py-7">

                  {/* LEFT : Course Details (60%) */}
                  <div className="lg:col-span-3 space-y-5">

                    {/* Title */}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 leading-snug">
                        {selectedCourse.courseTitle}
                      </h2>
                      <p className="text-sm text-gray-500 mt-2 max-w-2xl">
                        Learn with a structured curriculum designed for real-world skills and outcomes.
                      </p>
                    </div>

                    {/* Benefits */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-5">
                        What you’ll learn
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(selectedCourse.courseBenifits ||
                          "Comprehensive course with hands-on learning")
                          .split("\n")
                          .filter(line => line.trim() !== "")
                          .map((benefit, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 "
                            >
                              <svg
                                className="h-5 w-5 text-green-500 mt-1 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span className="text-sm text-gray-700 leading-relaxed">
                                {benefit}
                              </span>
                            </div>

                          ))}

                      </div>
                    </div>
                    <hr></hr>
                    {/* Info Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      {[
                        {
                          label: "Guide",
                          value: selectedCourse.courseGuide || "Step-by-step learning path",
                          icon: (
                            <svg
                              className="h-4 w-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6v6l4 2"
                              />
                            </svg>
                          ),
                        },
                        {
                          label: "Duration",
                          value: selectedCourse.duration || "Self-paced",
                          icon: (
                            <svg
                              className="h-4 w-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          ),
                        },
                        {
                          label: "Mode",
                          value: selectedCourse.mode || "Online",
                          icon: (
                            <svg
                              className="h-4 w-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9.75 17L8 21l4-2 4 2-1.75-4M12 3a5 5 0 100 10 5 5 0 000-10z"
                              />
                            </svg>
                          ),
                        },
                      ].map((item, i) => (
                       <div
  key={i}
  className="relative group bg-gradient-to-br from-gray-50 to-white
             rounded-xl border
             border-amber-300 hover:shadow-lg
             transition-all duration-300 p-5
             before:absolute before:inset-0 before:rounded-xl 
             before:bg-gradient-to-r before:from-amber-500/0 before:via-amber-500/5 before:to-amber-500/0
             before:opacity-0 before:group-hover:opacity-100 before:transition-opacity"
>
  <div className="flex items-center gap-4">
    {/* Simple but elegant icon */}
    <div className="flex items-center justify-center w-12 h-12 
                    rounded-lg bg-white border border-amber-400 group-hover:bg-amber-50
                    transition-all duration-300 shadow-sm">
      <span className="text-gray-700 group-hover:text-amber-700 transition-colors">
        {item.icon}
      </span>
    </div>
    
    <div>
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
        {item.label}
      </span>
      <p className="text-xl font-bold text-gray-900">
        {item.value}
      </p>
    </div>
    
    {/* Minimal indicator */}
    <div className="ml-auto">
      <div className="w-2 h-2 rounded-full bg-amber-500 opacity-0 
                      group-hover:opacity-100 transition-opacity" />
    </div>
  </div>
</div>

                      ))}
                    </div>


                    {/* Summary */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        Course Summary
                      </h3>
                      <p className="text-sm text-gray-700 leading-relaxed max-w-3xl">
                        {selectedCourse.courseSummary}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT : Preview + Pricing (40%) */}
                  <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-6 self-start">

                    {/* Preview */}
                    {selectedCourse.coursePreviewVideo?.url ? (
                      <video
                        src={selectedCourse.coursePreviewVideo.url}
                        controls
                        autoPlay
                        muted
                        className="w-full h-72 rounded-2xl object-cover border shadow-md"
                      />
                    ) : (
                      <div className="w-full h-72 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                        No Preview Available
                      </div>
                    )}

                    {/* Pricing Card */}
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-2xl p-6 shadow-sm">
                      <h3 className="text-xs text-gray-500 uppercase tracking-wide">
                        Course Pricing
                      </h3>
                      <div className="flex justify-between items-end mt-4">
                        <span className="text-gray-700">Total Fees</span>
                        <span className="text-3xl font-bold text-gray-900">
                          ₹{selectedCourse.price?.toLocaleString() || "15,000"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sticky CTA */}
                <div className="sticky bottom-0 bg-white border-t px-8 py-4 flex justify-center">
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-12 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition font-semibold text-lg"
                  >
                    Enroll Now
                  </button>
                </div>
              </>
            ) : (
              /* ================= STEP 2 (UNCHANGED LOGIC) ================= */
              <div className="px-6 sm:px-10 py-8 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                  Enrollment Form
                </h2>

                {showCheckoutButton ? (
                  <div className="text-center">
                    <div className="bg-green-100 border border-green-400 text-green-700 px-5 py-4 rounded-xl mb-6">
                      Form submitted successfully! Click below to proceed to checkout.
                    </div>
                    <button
                      onClick={handleProceedToCheckout}
                      disabled={paymentLoading}
                      className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-semibold disabled:opacity-50 text-lg"
                    >
                      {paymentLoading ? "Processing..." : "Proceed to Checkout"}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-5 py-4 rounded-xl mb-6">
                      Please fill out the form below. After submission, click the
                      "I've Submitted the Form" button.
                    </div>

                    <iframe
                      src={googleFormLink}
                      width="100%"
                      height="520"
                      frameBorder="0"
                      title="Google Form"
                      className="rounded-xl border"
                    />

                    <div className="mt-6 text-center">
                      <button
                        onClick={handleFormSubmission}
                        className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition font-semibold"
                      >
                        I've Submitted the Form – Proceed to Checkout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}




    </div>
  );
}