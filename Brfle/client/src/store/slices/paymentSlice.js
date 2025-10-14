
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import paymentAPI from '../api/paymentAPI';

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

export const recordFailedPayment = createAsyncThunk(
  'payments/recordFailed',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await paymentAPI.recordFailedPayment(paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to record payment failure'
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

const initialState = {
  order: null,
  payments: [],
  loading: false,
  error: null,
  success: null,
  verificationLoading: false
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
    clearOrder: (state) => {
      state.order = null;
    },
    resetPaymentState: (state) => {
      state.order = null;
      state.loading = false;
      state.error = null;
      state.success = null;
      state.verificationLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createPaymentOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
        state.success = 'Payment order created successfully';
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify payment
      .addCase(verifyPayment.pending, (state) => {
        state.verificationLoading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.verificationLoading = false;
        state.order = null;
        state.success = action.payload.message;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.verificationLoading = false;
        state.error = action.payload;
      })
      // Record failed payment
      .addCase(recordFailedPayment.fulfilled, (state) => {
        state.order = null;
        state.error = 'Payment failed. Please try again.';
      })
      // Fetch my payments
      .addCase(fetchMyPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.payments;
      })
      .addCase(fetchMyPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  clearSuccess, 
  clearOrder, 
  resetPaymentState 
} = paymentSlice.actions;

export default paymentSlice.reducer;