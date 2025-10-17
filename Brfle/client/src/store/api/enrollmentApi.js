
import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/enrollments';
const API_URL = `${import.meta.env.VITE_API_URL}/enrollments`;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const enrollmentAPI = {
  // Enroll in a course
  enrollInCourse: async (courseId) => {
    const response = await api.post(`/courses/${courseId}`);
    return response;
  },

  // Get user's enrollments
  getMyEnrollments: async () => {
    const response = await api.get('/my-courses');
    return response;
  },

  // Get enrollment status for a course
  getEnrollmentStatus: async (courseId) => {
    const response = await api.get(`/courses/${courseId}`);
    return response;
  },

  // Cancel enrollment
  cancelEnrollment: async (courseId) => {
    const response = await api.delete(`/courses/${courseId}`);
    return response;
  },

  // Get course progress
  getCourseProgress: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/progress`);
    return response;
  },

  // Mark lesson as completed
  markLessonCompleted: async (courseId, lessonId) => {
    const response = await api.post(`/courses/${courseId}/lessons/${lessonId}/complete`);
    return response;
  },

  // Mark lesson as uncompleted
  markLessonUncompleted: async (courseId, lessonId) => {
    const response = await api.post(`/courses/${courseId}/lessons/${lessonId}/uncomplete`);
    return response;
  },

  // ✅ NEW: Mark material as accessed
  markMaterialAccessed: async (courseId, materialType) => {
    const response = await api.post(`/courses/${courseId}/access-material`, { materialType });
    return response;
  },

  // ✅ NEW: Add test attempt
  addTestAttempt: async (courseId, attemptData) => {
    const response = await api.post(`/courses/${courseId}/test-attempt`, attemptData);
    return response;
  },

// enrollmentAPI.js - Fix the addExperience function
addExperience: async (courseId) => {
  console.log('📞 API Call: Adding experience for course:', courseId)
  
  if (!courseId || courseId === 'undefined') {
    throw new Error('Course ID is required')
  }

  const response = await api.post(`/courses/${courseId}/experience`)
  return response
},
  // Get certificate
  getCertificate: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/certificate`);
    return response;
  },

  // Admin - Get enrollment analytics
  getEnrollmentAnalytics: async () => {
    const response = await api.get('/admin/analytics');
    return response;
  },

  // Admin - Get course enrollments
  getCourseEnrollments: async (courseId) => {
    const response = await api.get(`/admin/courses/${courseId}/enrollments`);
    return response;
  }
};

export default enrollmentAPI;