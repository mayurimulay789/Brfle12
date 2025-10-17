import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL ;
console.log("API URL:", API_URL)

// ----------------- Helpers -----------------
const createAuthHeaders = () => {
  const token = localStorage.getItem("token")
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }
}

const createFormDataHeaders = () => {
  const token = localStorage.getItem("token")
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  }
}

// ----------------- Admin API -----------------
const adminAPI = {
  // Dashboard Analytics
  getDashboardStats: () =>
    axios.get(`${API_URL}/admin/dashboard/stats`, createAuthHeaders()),
  
  getRevenueAnalytics: (params) =>
    axios.get(`${API_URL}/admin/dashboard/revenue-analytics`, {
      ...createAuthHeaders(),
      params,
    }),
  
  getCourseAnalytics: () =>
    axios.get(`${API_URL}/admin/dashboard/course-analytics`, createAuthHeaders()),
  
  getUserAnalytics: () =>
    axios.get(`${API_URL}/admin/dashboard/user-analytics`, createAuthHeaders()),
  
  getRecentActivities: (params) =>
    axios.get(`${API_URL}/admin/dashboard/recent-activities`, {
      ...createAuthHeaders(),
      params,
    }),

  // User Management
  getAllUsers: (params) =>
    axios.get(`${API_URL}/admin/users`, {
      ...createAuthHeaders(),
      params,
    }),
  
  updateUserRole: (userId, data) =>
    axios.put(`${API_URL}/admin/users/${userId}/role`, data, createAuthHeaders()),
  
  deleteUser: (userId) =>
    axios.delete(`${API_URL}/admin/users/${userId}`, createAuthHeaders()),
  
  updateUserStatus: (userId, data) =>
    axios.put(`${API_URL}/admin/users/${userId}/status`, data, createAuthHeaders()),
  
  bulkUserAction: (userIds, data) =>
    axios.post(`${API_URL}/admin/users/bulk-action`, {
      userIds,
      ...data
    }, createAuthHeaders()),

  // Course Management
  getAllCourses: (params) =>
    axios.get(`${API_URL}/admin/courses`, {
      ...createAuthHeaders(),
      params,
    }),
  
  createCourse: (courseData) =>
    axios.post(`${API_URL}/admin/courses`, courseData, createAuthHeaders()),
  
  updateCourse: (courseId, courseData) =>
    axios.put(`${API_URL}/admin/courses/${courseId}`, courseData, createAuthHeaders()),
  
  deleteCourse: (courseId) =>
    axios.delete(`${API_URL}/admin/courses/${courseId}`, createAuthHeaders()),
  
  updateCourseStatus: (courseId, data) =>
    axios.patch(`${API_URL}/admin/courses/${courseId}/status`, data, createAuthHeaders()),
  
  recalculateCourseDuration: (courseId) =>
    axios.post(`${API_URL}/admin/courses/${courseId}/recalculate-duration`, {}, createAuthHeaders()),
}

export default adminAPI;