import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/courses");

        if (!response.ok) {
          throw new Error(`Server Error: ${response.status}`);
        }

        const data = await response.json();
        setCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Unable to load courses. Please check your backend connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnrollClick = (courseId) => {
    console.log("Navigating to course detail page with ID:", courseId);
    navigate(`/courses/${courseId}`);
  };

  if (loading) {
    return (
      <div className="py-16 px-6 bg-gray-100 text-center">
        <p className="text-lg">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 px-6 bg-gray-100 text-center text-red-600">
        <p className="text-lg font-semibold">{error}</p>
        <p className="mt-2 text-gray-700">
          Make sure your backend server (port 5000) is running.
        </p>
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
          {courses.map((course) => (
            <div
              key={course._id}
              className="rounded-xl overflow-hidden shadow-md bg-white flex flex-col"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-56 object-cover transition-transform duration-500 hover:scale-110"
              />
              <div className="p-4 text-center flex flex-col flex-1">
                <p className="text-lg font-bold text-gray-900">{course.title}</p>
                <p className="text-sm text-gray-500 mt-2">{course.category}</p>
                <p className="text-xs text-gray-600 mt-2 line-clamp-3">
                  {course.description}
                </p>

                <button
                  onClick={() => handleEnrollClick(course._id)}
                  className="mt-4 inline-block px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <p className="text-center text-gray-600 mt-8">
            No courses available at the moment.
          </p>
        )}
      </div>
    </div>
  );
}
