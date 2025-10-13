import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../store/slices/courseSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// 🧾 Google Form Link
const googleFormLink =
  "https://docs.google.com/forms/d/e/1FAIpQLSdx2nW8wIvZOHT7k4w8mNzG-Va5e0K7w4URGhhO0G4GwqtUaw/viewform?embedded=true";

// 🎥 Hero Section
const Hero = () => {
  const images = ["/h2.jpg", "/business.jpg", "/h3.jpeg", "/earth.jpeg"];

  return (
    <section className="relative w-full h-[72vh] md:h-[91vh]">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
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
  );
};

// 📚 Courses Section
function Courses({ videoRef }) {
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector((state) => state.courses);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const openModal = (course) => {
    setSelectedCourse(course);
    setShowForm(false);
    if (videoRef?.current) videoRef.current.pause();
  };

  const closeModal = () => {
    setSelectedCourse(null);
    if (videoRef?.current) videoRef.current.play();
  };

  // Map backend courses to desired structure
  const mappedCourses = (courses || []).map((c) => ({
    title: c.title,
    category: c.category,
    description: c.shortDescription || c.description,
    image: c.images?.[0]?.url || c.thumbnail || "/images/default.jpg",
    duration: c.totalDurationHours ? `${c.totalDurationHours} hrs` : "N/A",
    fees: c.formattedPrice || "N/A",
    mode: "Online",
  }));

  const allCourses = [...mappedCourses, ...mappedCourses]; // duplicate for smooth scroll

  return (
    <section className="py-16 bg-black overflow-hidden">
      <h2 className="text-center text-2xl md:text-3xl font-bold text-white mb-10">
        Select Course
      </h2>

      {loading && <p className="text-center text-white py-10">Loading courses...</p>}
      {error && <p className="text-center text-red-500 py-10">{error}</p>}

      <div className="relative w-full overflow-hidden">
        <div className="flex animate-scroll gap-8">
          {allCourses.map((course, index) => (
            <div
              key={index}
              onClick={() => openModal(course)}
              className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col items-center text-center min-w-[250px] hover:scale-105 transition cursor-pointer"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-80 h-48 object-cover"
              />
              <h3 className="mt-4 mb-6 text-lg font-semibold text-gray-800">
                {course.title}
              </h3>
            </div>
          ))}
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

            {!showForm ? (
              <>
                <img
                  src={selectedCourse.image}
                  alt={selectedCourse.title}
                  className="w-full h-56 object-cover rounded-lg mb-4"
                />
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  {selectedCourse.title}
                </h2>

                <div className="space-y-4 text-gray-700">
                  <p>{selectedCourse.description}</p>
                  <p><strong>Duration:</strong> {selectedCourse.duration}</p>
                  <p><strong>Fees:</strong> {selectedCourse.fees}</p>
                  <p><strong>Mode:</strong> {selectedCourse.mode}</p>
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
              <iframe
                src={googleFormLink}
                width="100%"
                height="600"
                frameBorder="0"
                title="Google Form"
              />
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          display: flex;
          width: max-content;
          animation: scroll 40s linear infinite;
        }
      `}</style>
    </section>
  );
}

// 🏁 Banner Section
function Banner() {
  return (
    <section className="relative w-full h-[70vh]">
      <img src="/business.jpg" alt="Banner" className="w-full h-full object-cover" />
      <div className="absolute inset-0 flex justify-center items-center bg-black/30">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Join Our Global Learning Community
        </h2>
      </div>
    </section>
  );
}

// 🌍 Home Page
export default function HomePage() {
  const videoRef = useRef(null); // optional, if you add video later
  return (
    <>
      <Hero />
      <Courses videoRef={videoRef} />
      <Banner />
    </>
  );
}
