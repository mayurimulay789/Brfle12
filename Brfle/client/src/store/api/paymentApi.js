import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/payments';
const API_URL = `${import.meta.env.VITE_API_URL}/payments`;

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

const paymentAPI = {
  // Create Razorpay order
  createOrder: async (courseId) => {
    const response = await api.post('/create-order', { courseId });
    return response;
  },

  // Verify payment
  verifyPayment: async (paymentData) => {
    const response = await api.post('/verify', paymentData);
    return response;
  },

  // Handle failed payment
  paymentFailed: async (paymentData) => {
    const response = await api.post('/failed', paymentData);
    return response;
  },

  // Get payment details
  getPaymentDetails: async (paymentId) => {
    const response = await api.get(`/${paymentId}`);
    return response;
  },

  // Get user's payment history
  getMyPayments: async () => {
    const response = await api.get('/history/my-payments');
    return response;
  },

  // Admin - Get all payments
  getAllPayments: async (params = {}) => {
    const response = await api.get('/admin/all-payments', { params });
    return response;
  },

  // Admin - Get payment analytics
  getPaymentAnalytics: async () => {
    const response = await api.get('/admin/analytics');
    return response;
  },

  // Admin - Process refund
  processRefund: async (paymentId, refundData) => {
    const response = await api.post(`/admin/refund/${paymentId}`, refundData);
    return response;
  }
};

export default paymentAPI;