import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import paymentAPI from '../api/paymentApi';

// Get Razorpay key from environment variables
const getRazorpayKey = () => {
  
  // Fallback for Vite or other setups
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_RAZORPAY_KEY_ID) {
    return import.meta.env.VITE_RAZORPAY_KEY_ID;
  }
  
  // Fallback to a default or throw error
  console.warn('Razorpay key not found in environment variables');
  return 'rzp_test_default_key'; // Use a test key or throw error
};

// Async Thunks
export const createPaymentOrder = createAsyncThunk(
  'payments/createOrder',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.createOrder(courseId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create payment order'
      );
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'payments/verify',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.verifyPayment(paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Payment verification failed'
      );
    }
  }
);

export const recordPaymentFailure = createAsyncThunk(
  'payments/recordFailure',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.paymentFailed(paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to record payment failure'
      );
    }
  }
);

export const fetchPaymentDetails = createAsyncThunk(
  'payments/fetchDetails',
  async (paymentId, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.getPaymentDetails(paymentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch payment details'
      );
    }
  }
);

export const fetchMyPayments = createAsyncThunk(
  'payments/fetchMyPayments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.getMyPayments();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch payment history'
      );
    }
  }
);

// Admin thunks
export const fetchAllPayments = createAsyncThunk(
  'payments/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.getAllPayments(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch all payments'
      );
    }
  }
);

export const fetchPaymentAnalytics = createAsyncThunk(
  'payments/fetchAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.getPaymentAnalytics();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch payment analytics'
      );
    }
  }
);

export const processRefund = createAsyncThunk(
  'payments/processRefund',
  async ({ paymentId, refundData }, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.processRefund(paymentId, refundData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to process refund'
      );
    }
  }
);

const initialState = {
  currentOrder: null,
  paymentStatus: 'idle', // 'idle', 'processing', 'success', 'failed', 'order_created', 'verifying'
  paymentDetails: null,
  paymentHistory: [],
  allPayments: [],
  analytics: null,
  loading: false,
  error: null,
  success: null,
  razorpayConfig: {
    key: getRazorpayKey(), // Use the function to get the key
  }
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearPaymentDetails: (state) => {
      state.paymentDetails = null;
    },
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    },
    resetPaymentState: (state) => {
      state.currentOrder = null;
      state.paymentStatus = 'idle';
      state.paymentDetails = null;
      state.error = null;
      state.success = null;
    },
    clearPaymentHistory: (state) => {
      state.paymentHistory = [];
    },
    clearAnalytics: (state) => {
      state.analytics = null;
    },
    // NEW: Update Razorpay key dynamically
    setRazorpayKey: (state, action) => {
      state.razorpayConfig.key = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create payment order
      .addCase(createPaymentOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentStatus = 'processing';
      })
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.order;
        state.paymentStatus = 'order_created';
        // Use the key from the backend response instead of env
        state.razorpayConfig.key = action.payload.key;
        state.success = 'Payment order created successfully';
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.paymentStatus = 'failed';
        state.currentOrder = null;
      })
      // Verify payment
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentStatus = 'verifying';
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentStatus = 'success';
        state.success = action.payload.message;
        state.currentOrder = null;
        
        // Add to payment history if it's a new payment
        if (action.payload.payment) {
          state.paymentHistory.unshift(action.payload.payment);
        }
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.paymentStatus = 'failed';
      })
      // Record payment failure
      .addCase(recordPaymentFailure.fulfilled, (state) => {
        state.paymentStatus = 'failed';
        state.currentOrder = null;
        state.error = 'Payment failed';
      })
      // Fetch payment details
      .addCase(fetchPaymentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentDetails = action.payload.payment;
      })
      .addCase(fetchPaymentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch my payments
      .addCase(fetchMyPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentHistory = action.payload.payments || [];
      })
      .addCase(fetchMyPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch all payments (Admin)
      .addCase(fetchAllPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.allPayments = action.payload.payments || [];
      })
      .addCase(fetchAllPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch payment analytics (Admin)
      .addCase(fetchPaymentAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload.analytics;
      })
      // Process refund (Admin)
      .addCase(processRefund.fulfilled, (state, action) => {
        state.success = action.payload.message;
        // Update payment in allPayments array
        const index = state.allPayments.findIndex(
          payment => payment._id === action.payload.paymentId
        );
        if (index !== -1) {
          state.allPayments[index].refundStatus = 'processed';
          state.allPayments[index].refundAmount = action.payload.refund.amount;
          state.allPayments[index].refundedAt = new Date().toISOString();
        }
      });
  },
});

export const { 
  clearError, 
  clearSuccess, 
  clearCurrentOrder, 
  clearPaymentDetails,
  setPaymentStatus,
  resetPaymentState,
  clearPaymentHistory,
  clearAnalytics,
  setRazorpayKey
} = paymentSlice.actions;

export default paymentSlice.reducer;