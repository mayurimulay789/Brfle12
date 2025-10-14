import axios from 'axios';

const API_URL = 'http://localhost:5000/api/payments';

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
  // Create order
  createOrder: async (courseId) => {
    const response = await api.post('/create-order', { courseId });
    return response;
  },

  // Verify payment
  verifyPayment: async (paymentData) => {
    const response = await api.post('/verify', paymentData);
    return response;
  },

  // Record failed payment
  recordFailedPayment: async (paymentData) => {
    const response = await api.post('/failed', paymentData);
    return response;
  },

  // Get payment details
  getPaymentDetails: async (paymentId) => {
    const response = await api.get(`/${paymentId}`);
    return response;
  },

  // Get my payments
  getMyPayments: async () => {
    const response = await api.get('/history/my-payments');
    return response;
  },
};

export default paymentAPI;