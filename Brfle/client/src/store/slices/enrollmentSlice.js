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
        error.response?.data?.message || 'Enrollment failed'
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

// Admin thunks
export const fetchEnrollmentAnalytics = createAsyncThunk(
  'enrollments/fetchAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await enrollmentAPI.getEnrollmentAnalytics();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch enrollment analytics'
      );
    }
  }
);

export const fetchCourseEnrollments = createAsyncThunk(
  'enrollments/fetchCourseEnrollments',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await enrollmentAPI.getCourseEnrollments(courseId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch course enrollments'
      );
    }
  }
);

const initialState = {
  enrollments: [],
  currentEnrollment: null,
  courseProgress: null,
  certificate: null,
  enrollmentStatus: null,
  analytics: null,
  courseEnrollments: [],
  loading: false,
  error: null,
  success: null,
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
    clearCurrentEnrollment: (state) => {
      state.currentEnrollment = null;
    },
    clearCourseProgress: (state) => {
      state.courseProgress = null;
    },
    clearCertificate: (state) => {
      state.certificate = null;
    },
    clearAnalytics: (state) => {
      state.analytics = null;
    },
    updateEnrollmentProgress: (state, action) => {
      const { courseId, progress, completedLessons } = action.payload;
      const enrollment = state.enrollments.find(e => e.course._id === courseId);
      if (enrollment) {
        enrollment.progress = progress;
        enrollment.completedLessons = completedLessons;
      }
    },
    resetEnrollmentState: (state) => {
      state.currentEnrollment = null;
      state.courseProgress = null;
      state.certificate = null;
      state.enrollmentStatus = null;
      state.error = null;
      state.success = null;
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
        state.enrollments = action.payload.enrollments || [];
      })
      .addCase(fetchMyEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch enrollment status
      .addCase(fetchEnrollmentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrollmentStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEnrollment = action.payload.enrollment;
        state.enrollmentStatus = action.payload.enrollment ? 'enrolled' : 'not_enrolled';
      })
      .addCase(fetchEnrollmentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.enrollmentStatus = 'error';
      })
      // Cancel enrollment
      .addCase(cancelEnrollment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelEnrollment.fulfilled, (state, action) => {
        state.loading = false;
        state.enrollments = state.enrollments.filter(
          enrollment => enrollment.course._id !== action.payload
        );
        state.currentEnrollment = null;
        state.enrollmentStatus = 'not_enrolled';
        state.success = 'Enrollment cancelled successfully';
      })
      .addCase(cancelEnrollment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch course progress
      .addCase(fetchCourseProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.courseProgress = action.payload.progress;
      })
      .addCase(fetchCourseProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Complete lesson
      .addCase(completeLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeLesson.fulfilled, (state, action) => {
        state.loading = false;
        if (state.courseProgress) {
          state.courseProgress.percentage = action.payload.progress;
          state.courseProgress.completed = action.payload.completedLessons;
          state.courseProgress.isCourseCompleted = action.payload.isCourseCompleted;
        }
        state.success = action.payload.message;
      })
      .addCase(completeLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Uncomplete lesson
      .addCase(uncompleteLesson.fulfilled, (state, action) => {
        if (state.courseProgress) {
          state.courseProgress.percentage = action.payload.progress;
          state.courseProgress.completed = action.payload.completedLessons;
        }
        state.success = action.payload.message;
      })
      // Fetch certificate
      .addCase(fetchCertificate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCertificate.fulfilled, (state, action) => {
        state.loading = false;
        state.certificate = action.payload.certificate;
      })
      .addCase(fetchCertificate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch enrollment analytics (Admin)
      .addCase(fetchEnrollmentAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload.analytics;
      })
      // Fetch course enrollments (Admin)
      .addCase(fetchCourseEnrollments.fulfilled, (state, action) => {
        state.courseEnrollments = action.payload.enrollments;
      });
  },
});

export const { 
  clearError, 
  clearSuccess, 
  clearCurrentEnrollment, 
  clearCourseProgress,
  clearCertificate,
  clearAnalytics,
  updateEnrollmentProgress,
  resetEnrollmentState
} = enrollmentSlice.actions;

export default enrollmentSlice.reducer;