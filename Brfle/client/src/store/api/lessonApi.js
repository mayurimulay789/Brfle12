import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/lessons';
const API_URL = `${import.meta.env.VITE_API_URL}/lessons`;

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

const lessonAPI = {
  // Get course lessons
  getCourseLessons: async (courseId) => {
    const response = await api.get(`/course/${courseId}`);
    return response;
  },

  // Create lesson
  createLesson: async (lessonData) => {
    const response = await api.post('/', lessonData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Update lesson
  updateLesson: async (lessonId, lessonData) => {
    const response = await api.put(`/${lessonId}`, lessonData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // Delete lesson
  deleteLesson: async (lessonId) => {
    const response = await api.delete(`/${lessonId}`);
    return response;
  },

  // Mark lesson as completed
  markLessonCompleted: async (lessonId) => {
    const response = await api.post(`/${lessonId}/complete`);
    return response;
  },

  // Get lesson progress
  getLessonProgress: async (lessonId) => {
    const response = await api.get(`/${lessonId}/progress`);
    return response;
  },

  // Add lesson resource
  addLessonResource: async (lessonId, resourceData) => {
    const response = await api.post(`/${lessonId}/resources`, resourceData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },
};

export default lessonAPI;