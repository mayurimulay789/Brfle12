<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
=======
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCourses } from "../store/slices/courseSlice";
// import { useNavigate } from "react-router-dom";

// export default function Courses() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { courses, loading, error } = useSelector((state) => state.courses);

//   useEffect(() => {
//     dispatch(fetchCourses());
//     console.log("thumbnail", courses.thumbnail);
//   }, [dispatch]);

//   if (loading) return <p className="text-center py-20">Loading courses...</p>;
//   if (error) return <p className="text-center py-20 text-red-500">Error: {error}</p>;

//   return (
//     <div className="py-16 px-6 bg-gray-100">
//       <div className="max-w-7xl mx-auto text-center">
//         <h1 className="text-4xl font-bold mb-4 text-gray-900">Initial Course Offerings</h1>
//         <p className="text-gray-700 mb-12 max-w-2xl mx-auto">
//           Practical and immediate career-oriented courses designed to transform lives.
//         </p>

//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {(courses || []).map((course, index) => (
//             <div
//               key={index}
//               className="rounded-xl overflow-hidden shadow-md bg-white flex flex-col"
//             >
//               <div>
//                 <img
//                   src={course.thumbnail}
//                   alt={course.title}
//                   className="w-full h-56 object-cover"
//                   onError={(e) => console.log('Error loading image:', course.thumbnail)}
//                 />
//               </div>
//               <div className="p-4 text-center flex flex-col flex-1">
//                 <p className="text-lg font-bold text-gray-900">{course.title}</p>
//                 <p className="text-sm text-gray-500 mt-2">{course.category}</p>
//                 <p className="text-xs text-gray-600 mt-2 line-clamp-3">{course.description}</p>

//                 <button
//                   onClick={() => navigate(`/courses/${course._id}`)}
//                   className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
//                 >
//                   Proceed to Enroll
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCourses, setFilters } from "../store/slices/courseSlice";
>>>>>>> b668140c6dd6cc15d243b0b08727e62c843ef342
import { useNavigate } from "react-router-dom";
import { fetchCourses } from "../store/slices/courseSlice";

// ✅ Common Google Form link
const googleFormLink =
  "https://docs.google.com/forms/d/e/1FAIpQLSdx2nW8wIvZOHT7k4w8mNzG-Va5e0K7w4URGhhO0G4GwqtUaw/viewform?embedded=true";

export default function Courses() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { 
    courses, 
    loading, 
    error, 
    filters,
    pagination 
  } = useSelector((state) => state.courses);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    dispatch(fetchAllCourses());
  }, [dispatch]);

<<<<<<< HEAD
  const openModal = (course) => {
    setSelectedCourse(course);
    setShowForm(false);
    setFormSubmitted(false);
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setShowForm(false);
    setFormSubmitted(false);
  };

  const handleProceedToEnroll = () => {
    setShowForm(true);
  };

  const handleFormSubmission = () => {
    setFormSubmitted(true);
    setTimeout(() => {
      if (selectedCourse) {
        navigate(`/checkout/${selectedCourse._id}`);
      }
      closeModal();
    }, 2000);
  };

  if (loading)
    return <p className="text-center py-20 text-lg text-gray-700">Loading courses...</p>;
  if (error)
    return <p className="text-center py-20 text-red-500">Error: {error}</p>;
=======
  const handleCategoryFilter = (category) => {
    dispatch(setFilters({ category }));
    dispatch(fetchAllCourses({ ...filters, category }));
  };

  const handleSearch = (searchTerm) => {
    dispatch(setFilters({ search: searchTerm }));
    dispatch(fetchAllCourses({ ...filters, search: searchTerm }));
  };

  const clearFilters = () => {
    dispatch(setFilters({ 
      category: '', 
      difficulty: '', 
      search: '' 
    }));
    dispatch(fetchAllCourses());
  };

  if (loading) return <p className="text-center py-20">Loading courses...</p>;
  if (error) return <p className="text-center py-20 text-red-500">Error: {error}</p>;
>>>>>>> b668140c6dd6cc15d243b0b08727e62c843ef342

  return (
    <div className="py-16 px-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Our Course Catalog</h1>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            Practical and immediate career-oriented courses designed to transform lives and boost your career.
          </p>

<<<<<<< HEAD
        {/* ===== Courses Grid ===== */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(courses || []).map((course, index) => (
            <div
              key={course._id || index}
              className="rounded-xl overflow-hidden shadow-md bg-white flex flex-col hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-56 object-cover transition-transform duration-500 hover:scale-110"
              />
              <div className="p-5 text-center flex flex-col flex-1">
                <p className="text-xl font-semibold text-gray-900">{course.title}</p>
                <p className="text-sm text-gray-500 mt-1">{course.category}</p>

                {course.guideBy && (
                  <p className="text-sm text-gray-600 mt-1 italic">
                    Guided by <span className="font-medium">{course.guideBy}</span>
                  </p>
                )}

                <p className="text-xs text-gray-600 mt-2 line-clamp-3">{course.description}</p>

                <div className="mt-3">
                  <p className="text-gray-900 font-bold text-lg">
                    ₹{course.price}{" "}
                    {course.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-1">
                        ₹{course.originalPrice}
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex justify-center gap-3 mt-2 text-xs text-gray-600">
                  {course.duration && <p>🕒 {course.duration} weeks</p>}
                  {course.mode && <p>📚 {course.mode}</p>}
                  {course.level && <p>⭐ {course.level}</p>}
                </div>

                <button
                  onClick={() => openModal(course)}
                  className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
=======
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={clearFilters}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                !filters.category 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Courses
            </button>
            {['Programming', 'Design', 'Marketing', 'Business', 'Technology', 'Language'].map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  filters.category === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-gray-600 mb-4">
            Showing {courses.length} of {pagination.total} courses
          </div>
>>>>>>> b668140c6dd6cc15d243b0b08727e62c843ef342
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No courses found matching your criteria.</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="rounded-xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                {/* Course Image */}
                <div className="relative">
                  <img
                    src={course.courseImage?.url || '/api/placeholder/300/200'}
                    alt={course.courseTitle}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/300/200';
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      course.difficulty === 'beginner' 
                        ? 'bg-green-100 text-green-800'
                        : course.difficulty === 'intermediate'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {course.difficulty?.charAt(0).toUpperCase() + course.difficulty?.slice(1)}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {course.category}
                    </span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {course.courseTitle}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
                    {course.courseSummary}
                  </p>

                  {/* Course Meta */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>⏱️ {course.duration}</span>
                      <span>👥 {course.totalStudents} students</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-gray-700 ml-1">
                          {course.averageRating || 'New'}
                        </span>
                        {course.totalRatings > 0 && (
                          <span className="text-gray-500 ml-1">
                            ({course.totalRatings})
                          </span>
                        )}
                      </div>
                      <span className="text-gray-500">{course.mode}</span>
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div className="text-2xl font-bold text-gray-900">
                      ₹{course.price}
                    </div>
                    <button
                      onClick={() => navigate(`/courses/${course._id}`)}
                      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button (if pagination exists) */}
        {pagination.pages > pagination.page && (
          <div className="text-center mt-12">
            <button
              onClick={() => dispatch(fetchAllCourses({ 
                ...filters, 
                page: pagination.page + 1 
              }))}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Load More Courses
            </button>
          </div>
        )}
      </div>

      {/* ===== Modal Section ===== */}
      {selectedCourse && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative shadow-lg overflow-y-auto max-h-[90vh]">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-2xl font-bold z-10"
            >
              ✕
            </button>

            {/* ===== Show course info or Google Form ===== */}
            {!showForm ? (
              <>
                <img
                  src={selectedCourse.image}
                  alt={selectedCourse.title}
                  className="w-full h-56 object-cover rounded-lg mb-4"
                />
                <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                  {selectedCourse.title}
                </h2>
                <p className="text-center text-gray-600 mb-4">
                  Guided by <span className="font-medium">{selectedCourse.guideBy}</span>
                </p>

                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="font-semibold text-gray-900">Course Overview</h3>
                    <p className="text-sm leading-relaxed">{selectedCourse.description}</p>
                  </div>

                  {selectedCourse.introduction && (
                    <div>
                      <h3 className="font-semibold text-gray-900">Introduction</h3>
                      <p className="text-sm leading-relaxed">{selectedCourse.introduction}</p>
                    </div>
                  )}

                  {selectedCourse.benefits?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900">Benefits</h3>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {selectedCourse.benefits.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {selectedCourse.duration && (
                      <p>
                        <span className="font-semibold">Duration:</span> {selectedCourse.duration} weeks
                      </p>
                    )}
                    {selectedCourse.mode && (
                      <p>
                        <span className="font-semibold">Mode:</span> {selectedCourse.mode}
                      </p>
                    )}
                    {selectedCourse.level && (
                      <p>
                        <span className="font-semibold">Level:</span> {selectedCourse.level}
                      </p>
                    )}
                    <p>
                      <span className="font-semibold">Fee:</span> ₹{selectedCourse.price}{" "}
                      {selectedCourse.originalPrice && (
                        <span className="line-through text-gray-500 ml-1">
                          ₹{selectedCourse.originalPrice}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={handleProceedToEnroll}
                    className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                  >
                    Proceed to Enroll
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Enrollment Form - {selectedCourse.title}
                </h2>

                {formSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Form Submitted Successfully!
                    </h3>
                    <p className="text-gray-600">Redirecting to checkout page...</p>
                  </div>
                ) : (
                  <>
                    <iframe
                      src={googleFormLink}
                      width="100%"
                      height="400"
                      frameBorder="0"
                      marginHeight="0"
                      marginWidth="0"
                      title="Google Form"
                      className="mb-4 rounded-lg"
                    >
                      Loading…
                    </iframe>
                    <div className="text-center">
                      <button
                        onClick={handleFormSubmission}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                      >
                        Submit Form & Proceed to Checkout
                      </button>
                      <p className="text-xs text-gray-500 mt-2">
                        After filling the form, click above to proceed to payment
                      </p>
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