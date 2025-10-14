// import axios from "axios";

// const API_URL = "http://localhost:5000/api/courses";

// const courseAPI = {
//   // Fetch all courses
//   getAll: async () => {
//     const response = await axios.get(API_URL);
//     return response.data;
//   },

//   // Fetch single course by ID
//   getCourseById: async (courseId) => {
//     const response = await axios.get(`${API_URL}/${courseId}`);
//     return response.data;
//   },

//   // Fetch course reviews
//   getCourseReviews: async (courseId) => {
//     const response = await axios.get(`${API_URL}/${courseId}/reviews`);
//     return response.data;
//   },

//   // Submit course review
//   submitReview: async (courseId, reviewData) => {
//     const response = await axios.post(`${API_URL}/${courseId}/reviews`, reviewData);
//     console.log(response);
//     return response.data;
//   },

//   // Add a course (for admin)
//   addCourse: async (courseData) => {
//     const response = await axios.post(API_URL, courseData);
//     return response.data;
//   },
// };

// export default courseAPI;



import axios from 'axios';

const API_URL = 'http://localhost:5000/api/courses';

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

  // Create MCQ test (Admin only)
  createMCQTest: async (courseId, testData) => {
    const response = await api.post(`/${courseId}/mcq-test`, testData);
    return response;
  },

  // Update MCQ test (Admin only)
  updateMCQTest: async (courseId, testData) => {
    const response = await api.put(`/${courseId}/mcq-test`, testData);
    return response;
  },

  // Delete MCQ test (Admin only)
  deleteMCQTest: async (courseId) => {
    const response = await api.delete(`/${courseId}/mcq-test`);
    return response;
  },

  // Add experience
  addExperience: async (courseId, experienceData) => {
    const response = await api.post(`/${courseId}/experiences`, experienceData);
    return response;
  },

  // Get course experiences
  getCourseExperiences: async (courseId) => {
    const response = await api.get(`/${courseId}/experiences`);
    return response;
  },

  // Attempt MCQ test
  attemptMCQTest: async (courseId, attemptData) => {
    const response = await api.post(`/${courseId}/test/attempt`, attemptData);
    return response;
  },

  // Get test attempts
  getTestAttempts: async (courseId) => {
    const response = await api.get(`/${courseId}/test/attempts`);
    return response;
  },
};

export default courseAPI;