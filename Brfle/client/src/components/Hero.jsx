import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCourses } from "../api/courseApi";

export default function Hero() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getCourses = async () => {
      try {
        const data = await fetchCourses();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    getCourses();
  }, []);

  const handleSelectCourse = (id) => {
    navigate(`/course/${id}`);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[70vh]">
        <img src="/h2.jpg" alt="Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center bg-black/30">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            BRFLE
          </h1>
          <h2 className="text-xl md:text-2xl text-white font-semibold mt-2">
            International Open Learning
          </h2>
          <p className="text-lg md:text-xl text-gray-200 font-medium mt-2">
            Governing by Commune
          </p>
        </div>
      </section>

      {/* Select Course Section */}
      <section className="py-16 bg-black overflow-hidden">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-white mb-10">
          Select Course
        </h2>

        <div className="relative w-full overflow-hidden">
          <div className="flex animate-scroll gap-8 px-6">
            {courses.map((course) => (
              <div
                key={course._id}
                onClick={() => handleSelectCourse(course._id)}
                className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col items-center text-center min-w-[280px] hover:scale-105 transition cursor-pointer"
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 w-full">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {course.title}
                  </h3>
                  <button
                    onClick={() => handleSelectCourse(course._id)}
                    className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Infinite scroll animation */}
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

      {/* Feature Highlights */}
      <section className="py-16 bg-gray-50 text-gray-900">
        <h2 className="text-center text-3xl font-bold mb-10">
          Why Choose BRFLE?
        </h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-xl mb-2">Expert Guidance</h3>
            <p>Learn from industry leaders and experienced mentors to achieve your career goals.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-xl mb-2">Flexible Learning</h3>
            <p>Access courses online or offline at your own pace to fit your busy lifestyle.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-xl mb-2">Certification</h3>
            <p>Earn globally recognized certificates to showcase your skills and enhance your profile.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-100">
        <h2 className="text-center text-3xl font-bold mb-10">What Our Students Say</h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 px-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="mb-4">"BRFLE transformed my career. The courses are practical and mentors are amazing!"</p>
            <h4 className="font-semibold">- Priya S.</h4>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="mb-4">"I loved the flexibility and the quality of content. Highly recommend to anyone looking to grow."</p>
            <h4 className="font-semibold">- Raj K.</h4>
          </div>
        </div>
      </section>

      {/* Call-to-Action Banner */}
      <section className="py-16 bg-black text-white text-center rounded-t-3xl mt-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Learning Community Today!</h2>
        <p className="mb-6 text-lg">Start learning, growing, and achieving your dreams with BRFLE.</p>
        <button
          onClick={() => navigate("/courses")}
          className="px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Explore All Courses
        </button>
      </section>
    </>
  );
}
