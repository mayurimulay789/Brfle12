

import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './slices/adminSlice';
import authReducer from './slices/authSlice';
import courseReducer from './slices/courseSlice';
import lessonReducer from './slices/lessonSlice';
import paymentReducer from './slices/paymentSlice';
import enrollmentReducer from './slices/enrollmentSlice';

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    auth: authReducer,
    courses: courseReducer,
    lessons: lessonReducer,
    payments: paymentReducer,
    enrollments: enrollmentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;