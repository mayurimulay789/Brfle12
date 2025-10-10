import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// 🧩 Courses Data
const courses = [
  {
    title: "Well Being and Conscious Life",
    category: "Personal Development",
    description:
      "Develop holistic wellness through mindful living, spiritual growth, and balanced lifestyle practices.",
    image: "/images/Wellness.jpeg",
    duration: "6 Weeks",
    fees: "₹12,000",
    mode: "Online",
  },
  {
    title: "Holistic Governance and Administration",
    category: "Leadership",
    description:
      "Master the art of ethical leadership and comprehensive administrative practices for modern organizations.",
    image: "/images/Governor.jpeg",
    duration: "8 Weeks",
    fees: "₹15,000",
    mode: "Hybrid (Online + Workshop)",
  },
  {
    title: "AI",
    category: "Technology",
    description:
      "Explore the fascinating world of AI, machine learning, and their practical applications in various industries.",
    image: "/images/AI.jpeg",
    duration: "10 Weeks",
    fees: "₹18,000",
    mode: "Online",
  },
  {
    title: "Innovator",
    category: "Business",
    description:
      "Learn to cultivate creativity, problem-solving skills, and innovative thinking for real-world applications.",
    image: "/images/Innovator.jpeg",
    duration: "6 Weeks",
    fees: "₹14,000",
    mode: "Offline/Online",
  },
  {
    title: "Exporter",
    category: "Business",
    description:
      "Understand international trade, export strategies, and global market opportunities.",
    image: "/images/exporter.jpeg",
    duration: "8 Weeks",
    fees: "₹16,000",
    mode: "Online",
  },
  {
    title: "Tourism",
    category: "Industry",
    description:
      "Discover the dynamics of tourism industry and learn to create memorable travel experiences.",
    image: "/images/t1.jpg",
    duration: "6 Weeks",
    fees: "₹10,000",
    mode: "Hybrid",
  },
  {
    title: "Heritage Conservation",
    category: "Culture & History",
    description:
      "Learn to preserve and manage cultural heritage and historical sites.",
    image: "/images/heritage.jpg",
    duration: "6 Weeks",
    fees: "₹12,000",
    mode: "Online",
  },
  {
    title: "Intelligence Investigator",
    category: "Security & Investigation",
    description:
      "Develop skills in intelligence gathering, investigation techniques, and analytical reasoning.",
    image: "/images/Intelligence1.jpeg",
    duration: "8 Weeks",
    fees: "₹15,000",
    mode: "Offline/Online",
  },
];

// 🧾 Google Form Link
const googleFormLink =
  "https://docs.google.com/forms/d/e/1FAIpQLSdx2nW8wIvZOHT7k4w8mNzG-Va5e0K7w4URGhhO0G4GwqtUaw/viewform?embedded=true";

// 🎥 Hero Section (Updated with Swiper Slider)
const Hero = () => {
  const images = ["/computer.jpg", "/hills.jpg", "/office.jpg", "/culture.jpg"];

  return (
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
  );
};

// 📚 Courses Section
function Courses({ videoRef }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const openModal = (course) => {
    setSelectedCourse(course);
    setShowForm(false);
    if (videoRef?.current) videoRef.current.pause();
  };

  const closeModal = () => {
    setSelectedCourse(null);
    if (videoRef?.current) videoRef.current.play();
  };

  const allCourses = [...courses, ...courses]; // Duplicate for smooth scrolling

  return (
    <section className="py-16 bg-black overflow-hidden">
      <h2 className="text-center text-2xl md:text-3xl font-bold text-white mb-10">
        Select Course
      </h2>

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
                  <div>
                    <h3 className="font-semibold text-gray-900">Course Info</h3>
                    <p className="text-sm">{selectedCourse.description}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Duration</h3>
                    <p className="text-sm">{selectedCourse.duration}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Fees for Admission
                    </h3>
                    <p className="text-sm">{selectedCourse.fees}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Mode</h3>
                    <p className="text-sm">{selectedCourse.mode}</p>
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
                <iframe
                  src={googleFormLink}
                  width="100%"
                  height="600"
                  frameBorder="0"
                  marginHeight="0"
                  marginWidth="0"
                  title="Google Form"
                >
                  Loading…
                </iframe>
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

// 🌍 Main Page
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
