// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import enrollmentAPI from "../api/enrollmentApi";

// // ✅ Fetch user enrollments thunk
// export const fetchMyEnrollments = createAsyncThunk(
//   "enrollments/fetchMyEnrollments",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await enrollmentAPI.getMyEnrollments();
//       return response;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to load enrollments"
//       );
//     }
//   }
// );

// // ✅ Enroll in course thunk
// export const enrollInCourse = createAsyncThunk(
//   "enrollments/enrollInCourse",
//   async (courseId, { rejectWithValue }) => {
//     try {
//       const response = await enrollmentAPI.enroll(courseId);
//       return response;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to enroll in course"
//       );
//     }
//   }
// );

// // ✅ Update progress thunk
// export const updateCourseProgress = createAsyncThunk(
//   "enrollments/updateCourseProgress",
//   async ({ courseId, lessonId, timeSpent }, { rejectWithValue }) => {
//     try {
//       const response = await enrollmentAPI.updateProgress({
//         courseId,
//         lessonId,
//         timeSpent,
//       });
//       return response;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to update progress"
//       );
//     }
//   }
// );

// // ✅ Fetch progress for course thunk
// export const fetchCourseProgress = createAsyncThunk(
//   "enrollments/fetchCourseProgress",
//   async (courseId, { rejectWithValue }) => {
//     try {
//       const response = await enrollmentAPI.getProgress(courseId);
//       return { courseId, ...response };
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch progress"
//       );
//     }
//   }
// );

// // ✅ Fetch user certificates thunk
// export const fetchMyCertificates = createAsyncThunk(
//   "enrollments/fetchMyCertificates",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await enrollmentAPI.getMyCertificates();
//       return response;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to load certificates"
//       );
//     }
//   }
// );

// const enrollmentSlice = createSlice({
//   name: "enrollments",
//   initialState: {
//     enrollments: [],
//     certificates: [],
//     currentProgress: null,
//     loading: false,
//     error: null,
//     enrollmentLoading: false,
//     progressLoading: false,
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     clearProgress: (state) => {
//       state.currentProgress = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch enrollments
//       .addCase(fetchMyEnrollments.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchMyEnrollments.fulfilled, (state, action) => {
//         state.loading = false;
//         state.enrollments = action.payload;
//       })
//       .addCase(fetchMyEnrollments.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Enroll in course
//       .addCase(enrollInCourse.pending, (state) => {
//         state.enrollmentLoading = true;
//         state.error = null;
//       })
//       .addCase(enrollInCourse.fulfilled, (state, action) => {
//         state.enrollmentLoading = false;
//         // Optionally refetch enrollments to get updated list
//         // or add the new enrollment to the list
//       })
//       .addCase(enrollInCourse.rejected, (state, action) => {
//         state.enrollmentLoading = false;
//         state.error = action.payload;
//       })
//       // Update progress
//       .addCase(updateCourseProgress.pending, (state) => {
//         state.progressLoading = true;
//         state.error = null;
//       })
//       .addCase(updateCourseProgress.fulfilled, (state, action) => {
//         state.progressLoading = false;
//         state.currentProgress = action.payload.progress;
//         // Update enrollment progress in the list if needed
//         const enrollmentIndex = state.enrollments.findIndex(
//           (enrollment) => enrollment.course._id === action.meta.arg.courseId
//         );
//         if (enrollmentIndex !== -1) {
//           state.enrollments[enrollmentIndex].progress = action.payload.progress;
//           state.enrollments[enrollmentIndex].certificate = action.payload.certificate;
//         }
//       })
//       .addCase(updateCourseProgress.rejected, (state, action) => {
//         state.progressLoading = false;
//         state.error = action.payload;
//       })
//       // Fetch progress
//       .addCase(fetchCourseProgress.pending, (state) => {
//         state.progressLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchCourseProgress.fulfilled, (state, action) => {
//         state.progressLoading = false;
//         state.currentProgress = action.payload;
//       })
//       .addCase(fetchCourseProgress.rejected, (state, action) => {
//         state.progressLoading = false;
//         state.error = action.payload;
//       })
//       // Fetch certificates
//       .addCase(fetchMyCertificates.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchMyCertificates.fulfilled, (state, action) => {
//         state.loading = false;
//         state.certificates = action.payload;
//       })
//       .addCase(fetchMyCertificates.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearError, clearProgress } = enrollmentSlice.actions;

// export default enrollmentSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import enrollmentAPI from '../api/enrollmentAPI';

// Async Thunks
export const enrollInCourse = createAsyncThunk(
  'enrollments/enroll',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await enrollmentAPI.enrollInCourse(courseId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to enroll in course'
      );
    }
  }
);

export const fetchMyEnrollments = createAsyncThunk(
  'enrollments/fetchMyEnrollments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await enrollmentAPI.getMyEnrollments();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch enrollments'
      );
    }
  }
);

export const fetchEnrollmentStatus = createAsyncThunk(
  'enrollments/fetchStatus',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await enrollmentAPI.getEnrollmentStatus(courseId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch enrollment status'
      );
    }
  }
);

export const cancelEnrollment = createAsyncThunk(
  'enrollments/cancel',
  async (courseId, { rejectWithValue }) => {
    try {
      await enrollmentAPI.cancelEnrollment(courseId);
      return courseId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to cancel enrollment'
      );
    }
  }
);

export const fetchCourseProgress = createAsyncThunk(
  'enrollments/fetchProgress',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await enrollmentAPI.getCourseProgress(courseId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch course progress'
      );
    }
  }
);

export const completeLesson = createAsyncThunk(
  'enrollments/completeLesson',
  async ({ courseId, lessonId }, { rejectWithValue }) => {
    try {
      const response = await enrollmentAPI.markLessonCompleted(courseId, lessonId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to mark lesson as completed'
      );
    }
  }
);

export const uncompleteLesson = createAsyncThunk(
  'enrollments/uncompleteLesson',
  async ({ courseId, lessonId }, { rejectWithValue }) => {
    try {
      const response = await enrollmentAPI.markLessonUncompleted(courseId, lessonId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to mark lesson as uncompleted'
      );
    }
  }
);

export const fetchCertificate = createAsyncThunk(
  'enrollments/fetchCertificate',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await enrollmentAPI.getCertificate(courseId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch certificate'
      );
    }
  }
);

const initialState = {
  enrollments: [],
  currentEnrollment: null,
  progress: null,
  certificate: null,
  loading: false,
  error: null,
  success: null
};

const enrollmentSlice = createSlice({
  name: 'enrollments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    clearProgress: (state) => {
      state.progress = null;
    },
    clearCertificate: (state) => {
      state.certificate = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Enroll in course
      .addCase(enrollInCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.enrollments.push(action.payload.enrollment);
        state.success = action.payload.message;
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch my enrollments
      .addCase(fetchMyEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.enrollments = action.payload.enrollments;
      })
      .addCase(fetchMyEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch enrollment status
      .addCase(fetchEnrollmentStatus.fulfilled, (state, action) => {
        state.currentEnrollment = action.payload.enrollment;
      })
      // Cancel enrollment
      .addCase(cancelEnrollment.fulfilled, (state, action) => {
        state.enrollments = state.enrollments.filter(
          enrollment => enrollment.course._id !== action.payload
        );
        state.success = 'Enrollment cancelled successfully';
      })
      // Fetch course progress
      .addCase(fetchCourseProgress.fulfilled, (state, action) => {
        state.progress = action.payload.progress;
      })
      // Complete lesson
      .addCase(completeLesson.fulfilled, (state, action) => {
        state.success = action.payload.message;
        if (state.progress) {
          state.progress.percentage = action.payload.progress;
          state.progress.completed = action.payload.completedLessons;
        }
      })
      // Fetch certificate
      .addCase(fetchCertificate.fulfilled, (state, action) => {
        state.certificate = action.payload.certificate;
      });
  },
});

export const { 
  clearError, 
  clearSuccess, 
  clearProgress, 
  clearCertificate 
} = enrollmentSlice.actions;

export default enrollmentSlice.reducer;