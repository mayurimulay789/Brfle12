// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './slices/authSlice';
// // import adminReducer from './slices/adminSlice';
// // import certificateReducer from "./slices/certificateSlice";
// import courseReducer from "./slices/courseSlice";
// import paymentReducer from "./slices/paymentSlice";
// import enrollmentReducer from "./slices/enrollmentSlice"; // Add this line

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     // admin: adminReducer,
//     courses: courseReducer,
//     payment: paymentReducer,
//     // certificates: certificateReducer,
//     enrollments: enrollmentReducer, // Add this line
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: ['persist/PERSIST'],
//       },
//     }),
// });

// export default store;

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