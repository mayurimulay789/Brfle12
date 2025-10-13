import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../store/slices/courseSlice";
import { useNavigate } from "react-router-dom";

export default function Courses() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courses, loading, error } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  if (loading) return <p className="text-center py-20">Loading courses...</p>;
  if (error) return <p className="text-center py-20 text-red-500">Error: {error}</p>;

  return (
    <div className="py-16 px-6 bg-gray-100">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Initial Course Offerings</h1>
        <p className="text-gray-700 mb-12 max-w-2xl mx-auto">
          Practical and immediate career-oriented courses designed to transform lives.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(courses || []).map((course, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden shadow-md bg-white flex flex-col"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-4 text-center flex flex-col flex-1">
                <p className="text-lg font-bold text-gray-900">{course.title}</p>
                <p className="text-sm text-gray-500 mt-2">{course.category}</p>
                <p className="text-xs text-gray-600 mt-2 line-clamp-3">{course.description}</p>

                <button
                  onClick={() => navigate(`/courses/${course._id}`)}
                  className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                  Proceed to Enroll
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
