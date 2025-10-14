// import axios from "axios";

// const API_URL = "http://localhost:5000/api/enrollments";

// const createAuthHeaders = () => {
//   const token = localStorage.getItem("token")
//   return {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//   }
// }

// const enrollmentAPI = {
//   // Enroll in a course
//   enroll: async (courseId) => {
//     const response = await axios.post(API_URL, { courseId }, createAuthHeaders());
//     return response.data;
//   },

//   // Get user enrollments
//   getMyEnrollments: async () => {
//     const response = await axios.get(`${API_URL}/me`,createAuthHeaders());
//     return response.data;
//   },

//   // Get specific enrollment by course ID
//   getEnrollmentByCourse: async (courseId) => {
//     const response = await axios.get(`${API_URL}/${courseId}`,createAuthHeaders());
//     return response.data;
//   },

//   // Update course progress
//   updateProgress: async (progressData) => {
//     const response = await axios.post(`${API_URL}/progress`, progressData,createAuthHeaders());
//     return response.data;
//   },

//   // Get progress for specific course
//   getProgress: async (courseId) => {
//     const response = await axios.get(`${API_URL}/progress/${courseId}`,createAuthHeaders());
//     return response.data;
//   },

//   // Force certificate generation (dev only)
//   forceCertificate: async (courseId) => {
//     const response = await axios.post(`${API_URL}/${courseId}/force-certificate`,createAuthHeaders());
//     return response.data;
//   },

//   // Get user certificates
//   getMyCertificates: async () => {
//     const response = await axios.get(`${API_URL}/certificates/me`,createAuthHeaders());
//     return response.data;
//   },
// };

// export default enrollmentAPI;

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/enrollments';

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