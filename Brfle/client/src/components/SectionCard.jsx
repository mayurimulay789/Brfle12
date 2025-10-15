import React from "react";

const SectionCard = ({ title, points, description, completed, onComplete }) => {
  return (
    <div
      className={`bg-gray-900 border border-gray-700 rounded-2xl p-5 shadow-lg transition-all duration-300 ${
        completed ? "opacity-60" : "hover:scale-[1.02]"
      }`}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-blue-400">{title}</h3>
        <span className="text-gray-300 text-sm">{points} Points</span>
      </div>
      <p className="text-gray-400 text-sm mt-2">{description}</p>

      <button
        onClick={onComplete}
        disabled={completed}
        className={`mt-4 px-4 py-2 rounded-full text-sm font-medium ${
          completed
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:scale-105 transition-transform"
        }`}
      >
        {completed ? "Completed ✅" : "Mark as Done"}
      </button>
    </div>
  );
};

export default SectionCard;
