import React, { useState } from "react";
import SectionCard from "./SectionCard";
import QuestionAnswer from "./QuestionAnswer";

const CourseProgress = () => {
  const [sections, setSections] = useState([
    {
      id: 1,
      title: "🎥 Course Videos",
      points: 20,
      description: "Watch all the course videos to understand core concepts.",
      completed: false,
    },
    {
      id: 2,
      title: "📘 PDF Book",
      points: 20,
      description: "Read the provided PDF materials to strengthen your knowledge.",
      completed: false,
    },
    {
      id: 3,
      title: "📗 Project Book",
      points: 20,
      description: "Complete your course project and review its content.",
      completed: false,
    },
    {
      id: 4,
      title: "❓ Q&A Section",
      points: 20,
      description: "Answer a few questions to test your understanding.",
      completed: false,
    },
    {
      id: 5,
      title: "📝 Experience Diary",
      points: 20,
      description: "Share your personal experience and feedback about the course.",
      completed: false,
    },
  ]);

  const handleComplete = (id) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, completed: true } : section
      )
    );
  };

  const completedPoints = sections
    .filter((section) => section.completed)
    .reduce((acc, curr) => acc + curr.points, 0);

  const totalPoints = sections.reduce((acc, curr) => acc + curr.points, 0);
  const progressPercent = (completedPoints / totalPoints) * 100;

  return (
    <div className="max-w-4xl mx-auto bg-gray-950 text-white p-8 rounded-3xl shadow-2xl border border-gray-800">
      <h1 className="text-2xl font-bold text-blue-400 mb-4">🎯 Course Progress Tracker</h1>

      <div className="w-full bg-gray-800 rounded-full h-4 mb-6">
        <div
          className="bg-gradient-to-r from-blue-600 to-blue-700 h-4 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
      <p className="text-gray-300 mb-8">
        Total Progress: <span className="text-blue-400 font-semibold">{progressPercent.toFixed(1)}%</span>
      </p>

      <div className="grid gap-4">
        {sections.map((section) => (
          <div key={section.id}>
            {section.title === "❓ Q&A Section" && !section.completed ? (
              <QuestionAnswer onComplete={() => handleComplete(section.id)} />
            ) : section.title === "📝 Experience Diary" && !section.completed ? (
              <ExperienceDiary onComplete={() => handleComplete(section.id)} />
            ) : (
              <SectionCard {...section} onComplete={() => handleComplete(section.id)} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Experience Diary inline component
const ExperienceDiary = ({ onComplete }) => {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!text.trim()) return;
    setSubmitted(true);
    if (onComplete) onComplete();
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-700 shadow-lg text-white">
      <h2 className="text-xl font-semibold mb-4 text-blue-400">📝 Experience Diary</h2>
      {!submitted ? (
        <>
          <textarea
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            rows="4"
            placeholder="Write your thoughts or experiences about this course..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2 rounded-full hover:scale-105 transition-transform duration-300"
          >
            Submit Experience
          </button>
        </>
      ) : (
        <p className="text-green-400">✅ Thanks for sharing your experience!</p>
      )}
    </div>
  );
};

export default CourseProgress;
