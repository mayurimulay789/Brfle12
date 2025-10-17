import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { fetchAllCourses } from "../store/slices/courseSlice";
import { createPaymentOrder } from "../store/slices/paymentSlice";

// 🧾 Google Form Link from vite .env
const googleFormLink =import.meta.env.VITE_GOOGLE_FORM_LINK ||
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
                      {(selectedCourse.courseBenifits || "Comprehensive course with hands-on learning")
                        .split('\n')
                        .filter(line => line.trim() !== "") // remove empty lines
                        .map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <svg
                              className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
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
                            <span>{benefit}</span>
                          </li>
                        ))}
                    </ul>
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