import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import AdminPanel from './AdminPanel';
import CourseUploadForm from './CourseUploadForm';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('users');
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [errorCourses, setErrorCourses] = useState(null);

  const { token } = useSelector((state) => state.auth);

  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const response = await fetch('/api/admin/courses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      setErrorCourses(err.message);
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      const response = await fetch(`/api/admin/courses/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete');
      fetchCourses();
    } catch (err) {
      alert('Error deleting course: ' + err.message);
    }
  };

  useEffect(() => {
    if (activeSection === 'projects') {
      fetchCourses();
    }
  }, [activeSection]);

  const renderCourseManagement = () => (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Course Management</h1>
        {!showCourseForm && (
          <button
            onClick={() => setShowCourseForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all duration-300 transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload Course
          </button>
        )}
      </div>

      {showCourseForm && (
        <CourseUploadForm
          onCancel={() => {
            setShowCourseForm(false);
            setEditingCourse(null);
            fetchCourses();
          }}
          course={editingCourse}
          onUpdate={() => {
            setShowCourseForm(false);
            setEditingCourse(null);
            fetchCourses();
          }}
        />
      )}

      {loadingCourses && <div>Loading courses...</div>}
      {errorCourses && <div className="text-red-500">Error: {errorCourses}</div>}

      {!loadingCourses && !errorCourses && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => {
                // Helper to get full thumbnail URL
                const getThumbnailUrl = (thumb) => {
                  if (!thumb) return '';
                  return thumb.startsWith('http') ? thumb : `http://localhost:5000/uploads/${thumb}`;
                };
                // Helper to detect file type by extension
                const getFileType = (thumb) => {
                  if (!thumb) return 'none';
                  const ext = thumb.split('.').pop().toLowerCase();
                  if (["mp4","webm","ogg"].includes(ext)) return 'video';
                  if (["jpg","jpeg","png","gif","bmp","avif","svg","webp"].includes(ext)) return 'image';
                  return 'unknown';
                };
                const thumbUrl = getThumbnailUrl(course.thumbnail);
                const fileType = getFileType(course.thumbnail);
                return (
                  <tr key={course._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {fileType === 'image' ? (
                        <img
                          src={thumbUrl}
                          alt="Thumbnail"
                          className="w-20 h-20 rounded-lg object-cover shadow-sm hover:shadow-md transition-shadow duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/default-thumbnail.png';
                          }}
                        />
                      ) : fileType === 'video' ? (
                        <video
                          src={thumbUrl}
                          className="w-20 h-20 rounded-lg object-cover shadow-sm hover:shadow-md transition-shadow duration-300"
                          controls
                          onError={(e) => {
                            e.target.poster = '/images/default-thumbnail.png';
                          }}
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          src="/images/default-thumbnail.png"
                          alt="Default Thumbnail"
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      )}
                    </td>
                  <td className="px-6 py-4 whitespace-nowrap">{course.courseName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{course.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{course.level}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{course.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => alert(JSON.stringify(course, null, 2))}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-sm"
                        title="View Course"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </button>
                      <button
                        onClick={() => {
                          setEditingCourse(course);
                          setShowCourseForm(true);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-sm"
                        title="Update Course"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
                        </svg>
                        Update
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-sm"
                        title="Delete Course"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'users':
        return <AdminPanel />;
      case 'projects':
        return renderCourseManagement();
      case 'analytics':
        return <div className="p-8 text-gray-700">Instructors (Coming Soon)</div>;
      case 'settings':
        return <div className="p-8 text-gray-700">Overview (Coming Soon)</div>;
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
            Course Management
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
      <main className="flex-1">
        <div className="bg-white rounded-lg shadow-md m-8 min-h-[80vh]">
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
