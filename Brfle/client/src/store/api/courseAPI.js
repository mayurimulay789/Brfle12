

import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/courses';
const API_URL = `${import.meta.env.VITE_API_URL}/courses`;


// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
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

const courseAPI = {
  // Get all courses
  getAllCourses: async (params = {}) => {
    const response = await api.get('/', { params });
    return response;
  },

  // Get single course
  getCourse: async (courseId) => {
    const response = await api.get(`/${courseId}`);
    return response;
  },

  // Get courses by category
  getCoursesByCategory: async (category) => {
    const response = await api.get(`/category/${category}`);
    return response;
  },

  // Create course (Admin only)
  createCourse: async (courseData) => {
    const response = await api.post('/', courseData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Update course (Admin only)
  updateCourse: async (courseId, courseData) => {
    const response = await api.put(`/${courseId}`, courseData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Delete course (Admin only)
  deleteCourse: async (courseId) => {
    const response = await api.delete(`/${courseId}`);
    return response;
  },

  // Upload course image (Admin only)
  uploadCourseImage: async (courseId, imageData) => {
    const response = await api.post(`/${courseId}/image`, imageData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Upload preview video (Admin only)
  uploadPreviewVideo: async (courseId, videoData) => {
    const response = await api.post(`/${courseId}/preview-video`, videoData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Upload course book (Admin only)
  uploadCourseBook: async (courseId, fileData) => {
    const response = await api.post(`/${courseId}/course-book`, fileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Upload project PDF (Admin only)
  uploadProjectPDF: async (courseId, fileData) => {
    const response = await api.post(`/${courseId}/project-pdf`, fileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Upload certificate template (Admin only)
  uploadCertificateTemplate: async (courseId, fileData) => {
    const response = await api.post(`/${courseId}/certificate-template`, fileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // ✅ ADDED: Get MCQ Test
  getMCQTest: async (courseId) => {
    const response = await api.get(`/${courseId}/mcq-test`);
    return response;
  },

  // MCQ Test Management (Admin only)
  createMCQTest: async (courseId, testData) => {
    const response = await api.post(`/${courseId}/mcq-test`, testData);
    return response;
  },

  updateMCQTest: async (courseId, testData) => {
    const response = await api.put(`/${courseId}/mcq-test`, testData);
    return response;
  },

  deleteMCQTest: async (courseId) => {
    const response = await api.delete(`/${courseId}/mcq-test`);
    return response;
  },

  // Course Experiences
  addExperience: async (courseId, experienceData) => {
    const response = await api.post(`/${courseId}/experiences`, experienceData);
    return response;
  },

  // Get course experiences
  getCourseExperiences: async (courseId) => {
    const response = await api.get(`/${courseId}/experiences`);
    return response;
  },

  // Delete experience
  deleteExperience: async (courseId, experienceId) => {
    const response = await api.delete(`/${courseId}/experiences/${experienceId}`);
    return response;
  },

  // Test Attempts
  attemptMCQTest: async (courseId, attemptData) => {
    const response = await api.post(`/${courseId}/test/attempt`, attemptData);
    return response;
  },

  // Get test attempts for a course (Admin only)
  getTestAttempts: async (courseId) => {
    const response = await api.get(`/${courseId}/test/attempts`);
    return response;
  },

  // Get user's test attempts
  getMyTestAttempts: async (courseId) => {
    const response = await api.get(`/${courseId}/test/my-attempts`);
    return response;
  },

  // Course Analytics (Admin only)
  getCourseAnalytics: async (courseId) => {
    const response = await api.get(`/${courseId}/analytics`);
    return response;
  },

  // Update course status (Admin only)
  updateCourseStatus: async (courseId, statusData) => {
    const response = await api.patch(`/${courseId}/status`, statusData);
    return response;
  },

  // Search courses
  searchCourses: async (searchQuery, filters = {}) => {
    const response = await api.get('/search', {
      params: { q: searchQuery, ...filters }
    });
    return response;
  },

  // Get popular courses
  getPopularCourses: async (limit = 10) => {
    const response = await api.get('/popular', {
      params: { limit }
    });
    return response;
  },

  // Get featured courses
  getFeaturedCourses: async (limit = 10) => {
    const response = await api.get('/featured', {
      params: { limit }
    });
    return response;
  },

  // Get courses by instructor
  getCoursesByInstructor: async (instructorId) => {
    const response = await api.get(`/instructor/${instructorId}`);
    return response;
  },

  // Get course statistics (Admin only)
  getCourseStatistics: async () => {
    const response = await api.get('/statistics');
    return response;
  },

  // Duplicate course (Admin only)
  duplicateCourse: async (courseId, courseData = {}) => {
    const response = await api.post(`/${courseId}/duplicate`, courseData);
    return response;
  },

  // Export course data (Admin only)
  exportCourseData: async (courseId, format = 'json') => {
    const response = await api.get(`/${courseId}/export`, {
      params: { format },
      responseType: 'blob'
    });
    return response;
  },

  // Bulk operations (Admin only)
  bulkUpdateCourses: async (courseIds, updateData) => {
    const response = await api.patch('/bulk-update', {
      courseIds,
      updateData
    });
    return response;
  },

  bulkDeleteCourses: async (courseIds) => {
    const response = await api.post('/bulk-delete', { courseIds });
    return response;
  },

  // Course reviews and ratings
  addCourseReview: async (courseId, reviewData) => {
    const response = await api.post(`/${courseId}/reviews`, reviewData);
    return response;
  },

  getCourseReviews: async (courseId, params = {}) => {
    const response = await api.get(`/${courseId}/reviews`, { params });
    return response;
  },

  updateCourseReview: async (courseId, reviewId, reviewData) => {
    const response = await api.put(`/${courseId}/reviews/${reviewId}`, reviewData);
    return response;
  },

  deleteCourseReview: async (courseId, reviewId) => {
    const response = await api.delete(`/${courseId}/reviews/${reviewId}`);
    return response;
  },

  // Course progress tracking
  updateCourseProgress: async (courseId, progressData) => {
    const response = await api.post(`/${courseId}/progress`, progressData);
    return response;
  },

  getCourseProgress: async (courseId) => {
    const response = await api.get(`/${courseId}/progress`);
    return response;
  },

  // Certificate generation
  generateCertificate: async (courseId) => {
    const response = await api.post(`/${courseId}/certificate`);
    return response;
  },

  getCertificate: async (courseId) => {
    const response = await api.get(`/${courseId}/certificate`);
    return response;
  },

  // Course recommendations
  getRecommendedCourses: async (courseId, limit = 5) => {
    const response = await api.get(`/${courseId}/recommendations`, {
      params: { limit }
    });
    return response;
  },

  // Course prerequisites
  addPrerequisite: async (courseId, prerequisiteCourseId) => {
    const response = await api.post(`/${courseId}/prerequisites`, {
      prerequisiteCourseId
    });
    return response;
  },

  removePrerequisite: async (courseId, prerequisiteCourseId) => {
    const response = await api.delete(`/${courseId}/prerequisites/${prerequisiteCourseId}`);
    return response;
  },

  // Course completion
  markCourseCompleted: async (courseId) => {
    const response = await api.post(`/${courseId}/complete`);
    return response;
  },

  // Course favorites
  addToFavorites: async (courseId) => {
    const response = await api.post(`/${courseId}/favorite`);
    return response;
  },

  removeFromFavorites: async (courseId) => {
    const response = await api.delete(`/${courseId}/favorite`);
    return response;
  },

  getFavoriteCourses: async () => {
    const response = await api.get('/favorites');
    return response;
  }
};

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default courseAPI;