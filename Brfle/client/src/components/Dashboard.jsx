import React, { useState } from 'react';
import AdminPanel from './AdminPanel';
import CourseUploadForm from './CourseUploadForm';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('users');
  const [showCourseForm, setShowCourseForm] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'users':
        return <AdminPanel />;
      case 'projects':
        return (
          <div className="p-8 text-gray-700">
            {!showCourseForm && (
              <>
                <div className="mb-4">Courses (Coming Soon)</div>
                <button
                  onClick={() => setShowCourseForm(true)}
                  className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Upload Course
                </button>
              </>
            )}
            {showCourseForm && <CourseUploadForm onCancel={() => setShowCourseForm(false)} />}
          </div>
        );
      case 'analytics':
        return <div className="p-8 text-gray-700">Instructors (Coming Soon)</div>;
      case 'settings':
        return <div className="p-8 text-gray-700">Overview(Coming Soon)</div>;
      default:
        return <AdminPanel />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <nav className="w-64 bg-gray-900 text-white p-6 shadow-lg">
        <h2 className="text-2xl font-extrabold mb-8 border-b border-gray-700 pb-4 text-white">Admin Panel</h2>
        <ul>
          <li
            className={`mb-4 cursor-pointer rounded px-3 py-2 transition-colors ${
              activeSection === 'users'
                ? 'bg-gray-700 font-semibold text-white'
                : 'text-white'
            }`}
            onClick={() => {
              setActiveSection('users');
              setShowCourseForm(false);
            }}
          >
            User Management
          </li>
          <li
            className={`mb-4 cursor-pointer rounded px-3 py-2 transition-colors ${
              activeSection === 'projects'
                ? 'bg-gray-700 font-semibold text-white'
                : 'text-white'
            }`}
            onClick={() => {
              setActiveSection('projects');
              setShowCourseForm(false);
            }}
          >
            Courses
          </li>
          <li
            className={`mb-4 cursor-pointer rounded px-3 py-2 transition-colors ${
              activeSection === 'analytics'
                ? 'bg-gray-700 font-semibold text-white'
                : 'text-white'
            }`}
            onClick={() => {
              setActiveSection('analytics');
              setShowCourseForm(false);
            }}
          >
            Instructors
          </li>
          <li
            className={`mb-4 cursor-pointer rounded px-3 py-2 transition-colors ${
              activeSection === 'settings'
                ? 'bg-gray-700 font-semibold text-white'
                : 'text-white'
            }`}
            onClick={() => {
              setActiveSection('settings');
              setShowCourseForm(false);
            }}
          >
            Overview
          </li>
        </ul>
      </nav>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow-md p-6 min-h-[80vh]">
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
