import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; 

const authAPI = {
  // Register user
  register: async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response;
  },

  // Login user
  login: async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response;
  },

  // Logout user
  logout: async () => {
    const response = await axios.post(`${API_URL}/logout`);
    return response;
  },

  // Get current user
  getMe: async () => {
    const response = await axios.get(`${API_URL}/me`);
    return response;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await axios.put(`${API_URL}/profile`, userData);
    return response;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response;
  },

  // Reset password
  resetPassword: async (token, passwords) => {
    const response = await axios.put(`${API_URL}/reset-password/${token}`, passwords);
    return response;
  },
};

export default authAPI;