import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCourses } from "../store/slices/courseSlice";

// ✅ Common Google Form link
const googleFormLink =
  "https://docs.google.com/forms/d/e/1FAIpQLSdx2nW8wIvZOHT7k4w8mNzG-Va5e0K7w4URGhhO0G4GwqtUaw/viewform?embedded=true";

export default function Courses() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courses, loading, error } = useSelector((state) => state.courses);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

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

  return (
    <div className="py-16 px-6 bg-gray-100">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Initial Course Offerings</h1>
        <p className="text-gray-700 mb-12 max-w-2xl mx-auto">
          Practical and immediate career-oriented courses designed to transform lives.
        </p>

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
        </div>
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
