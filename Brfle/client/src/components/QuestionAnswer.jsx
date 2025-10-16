// src/components/QuestionAnswer.jsx
import React, { useState } from "react";

const QuestionAnswer = ({ onComplete }) => {
  const questions = [
    {
      id: 1,
      question: "What is the main benefit of practicing Yoga daily?",
      options: [
        "Improves flexibility and mental peace",
        "Increases body fat",
        "Causes more stress",
        "Reduces focus",
      ],
      answer: 0,
    },
    {
      id: 2,
      question: "Meditation primarily helps in improving?",
      options: ["Physical strength", "Mental focus", "Speed", "Vision"],
      answer: 1,
    },
    {
      id: 3,
      question: "Which of these is a Yoga posture?",
      options: ["Vrikshasana", "Sprint", "Pushup", "Jump"],
      answer: 0,
    },
    {
      id: 4,
      question: "Mindfulness is best described as?",
      options: [
        "Being aware of the present moment",
        "Thinking about the future",
        "Revising the past",
        "Sleeping",
      ],
      answer: 0,
    },
    {
      id: 5,
      question: "What is essential for personal development?",
      options: ["Continuous learning", "Avoiding change", "Complaining", "Fear"],
      answer: 0,
    },
  ];

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptionSelect = (qId, optionIndex) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: optionIndex }));
  };

  const handleSubmit = () => {
    let total = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.answer) total += 4; // 5 questions × 4 points = 20 total
    });
    setScore(total);
    setSubmitted(true);
    if (total >= 20 && onComplete) onComplete(); // mark section as complete
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-700 shadow-lg text-white">
      <h2 className="text-xl font-semibold mb-4 text-blue-400">❓ Question & Answer Section</h2>

      {questions.map((q) => (
        <div key={q.id} className="mb-5">
          <p className="font-medium mb-2">{q.id}. {q.question}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOptionSelect(q.id, i)}
                className={`px-3 py-2 rounded-lg border text-sm transition-all duration-200 ${
                  answers[q.id] === i
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-gray-800 border-gray-600 hover:bg-gray-700"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2 rounded-full hover:scale-105 transition-transform duration-300"
        >
          Submit Answers
        </button>
      ) : (
        <div className="mt-4">
          <p className="text-lg text-gray-300">
            ✅ You scored <span className="text-blue-400 font-semibold">{score}</span> / 20 points
          </p>
          {score === 20 ? (
            <p className="text-green-400 font-medium mt-2">
              🎉 Excellent! You completed this section.
            </p>
          ) : (
            <p className="text-yellow-400 font-medium mt-2">
              Try again to improve your score!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionAnswer;