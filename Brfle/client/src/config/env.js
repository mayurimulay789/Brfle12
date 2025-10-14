// src/config/env.js

const config = {
  razorpayKey: process.env.REACT_APP_RAZORPAY_KEY_ID,
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  // Add other environment variables here
};

// Validate environment variables
export const validateEnv = () => {
  const missing = [];
  
  if (!config.razorpayKey) {
    missing.push('REACT_APP_RAZORPAY_KEY_ID');
  }
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
  }
  
  return config;
};

export default config;