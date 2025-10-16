

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
                    <h3 className="font-semibold text-gray-900 mb-4">Course Benefits</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Master industry-relevant skills with hands-on projects</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Learn from expert instructors with real-world experience</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Get lifetime access to course materials and updates</span>
                      </li>


                    </ul>
                    {/* <p className="text-sm">{selectedCourse.description || "Comprehensive course with hands-on learning"}</p> */}
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