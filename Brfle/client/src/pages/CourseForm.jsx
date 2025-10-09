import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCourseById } from "../api/courseApi";

export default function CourseForm() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const getCourse = async () => {
      try {
        const data = await fetchCourseById(id);
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };
    getCourse();
  }, [id]);

  if (!course)
    return <div className="text-center mt-10 text-lg">Loading course...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <img
        src={course.image}
        alt={course.title}
        className="w-full h-64 object-cover rounded-md mb-6"
      />
      <h1 className="text-3xl font-bold text-gray-800 mb-3">{course.title}</h1>
      <p className="text-gray-600 mb-4">{course.description}</p>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        <p><strong>Category:</strong> {course.category}</p>
        <p><strong>Duration:</strong> {course.duration}</p>
        <p><strong>Mode:</strong> {course.mode}</p>
        <p><strong>Guide:</strong> {course.guideName}</p>
        <p><strong>Prize:</strong> ₹{course.prize}</p>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-3">Course Benefits:</h2>
      <ul className="list-disc pl-5 space-y-1 text-gray-600">
        {course.benefits.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>

      <div className="text-center mt-8">
        <button
          onClick={() =>
            window.open(
             "https://docs.google.com/forms/d/1UUqGTVv5FWBa4rXfBS2HDwFglTYRaaq4wcl9nTbtRXw",
              "_blank"
            )
          }
          className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
        >
          Enroll Now
        </button>
      </div>
    </div>
  );
}
