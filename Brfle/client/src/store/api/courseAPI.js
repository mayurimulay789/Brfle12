import axios from "axios";

const API_URL = "http://localhost:5000/api/courses";

const courseAPI = {
  // Fetch all courses
  getAll: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Add a course (for admin)
  addCourse: async (courseData) => {
    const response = await axios.post(API_URL, courseData);
    return response.data;
  },
};

export default courseAPI;
