

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import enrollmentAPI from '../api/enrollmentAPI';

// // Async Thunks
// export const enrollInCourse = createAsyncThunk(
//   'enrollments/enroll',
//   async (courseId, { rejectWithValue }) => {
//     try {
//       const response = await enrollmentAPI.enrollInCourse(courseId);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Enrollment failed'
//       );
//     }
//   }
// );

// export const fetchMyEnrollments = createAsyncThunk(
//   'enrollments/fetchMyEnrollments',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await enrollmentAPI.getMyEnrollments();
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to fetch enrollments'
//       );
//     }
//   }
// );

// export const fetchEnrollmentStatus = createAsyncThunk(
//   'enrollments/fetchStatus',
//   async (courseId, { rejectWithValue }) => {
//     try {
//       const response = await enrollmentAPI.getEnrollmentStatus(courseId);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to fetch enrollment status'
//       );
//     }
//   }
// );

// export const cancelEnrollment = createAsyncThunk(
//   'enrollments/cancel',
//   async (courseId, { rejectWithValue }) => {
//     try {
//       await enrollmentAPI.cancelEnrollment(courseId);
//       return courseId;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to cancel enrollment'
//       );
//     }
//   }
// );

// export const fetchCourseProgress = createAsyncThunk(
//   'enrollments/fetchProgress',
//   async (courseId, { rejectWithValue }) => {
//     try {
//       const response = await enrollmentAPI.getCourseProgress(courseId);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to fetch course progress'
//       );
//     }
//   }
// );

// export const completeLesson = createAsyncThunk(
//   'enrollments/completeLesson',
//   async ({ courseId, lessonId }, { rejectWithValue }) => {
//     try {
//       const response = await enrollmentAPI.markLessonCompleted(courseId, lessonId);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to mark lesson as completed'
//       );
//     }
//   }
// );

// export const uncompleteLesson = createAsyncThunk(
//   'enrollments/uncompleteLesson',
//   async ({ courseId, lessonId }, { rejectWithValue }) => {
//     try {
//       const response = await enrollmentAPI.markLessonUncompleted(courseId, lessonId);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to mark lesson as uncompleted'
//       );
//     }
//   }
// );

// export const fetchCertificate = createAsyncThunk(
//   'enrollments/fetchCertificate',
//   async (courseId, { rejectWithValue }) => {
//     try {
//       const response = await enrollmentAPI.getCertificate(courseId);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to fetch certificate'
//       );
//     }
//   }
// );

// // Admin thunks
// export const fetchEnrollmentAnalytics = createAsyncThunk(
//   'enrollments/fetchAnalytics',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await enrollmentAPI.getEnrollmentAnalytics();
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to fetch enrollment analytics'
//       );
//     }
//   }
// );

// export const fetchCourseEnrollments = createAsyncThunk(
//   'enrollments/fetchCourseEnrollments',
//   async (courseId, { rejectWithValue }) => {
//     try {
//       const response = await enrollmentAPI.getCourseEnrollments(courseId);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to fetch course enrollments'
//       );
//     }
//   }
// );

// const initialState = {
//   enrollments: [],
//   currentEnrollment: null,
//   courseProgress: null,
//   certificate: null,
//   enrollmentStatus: null,
//   analytics: null,
//   courseEnrollments: [],
//   loading: false,
//   error: null,
//   success: null,
// };

// const enrollmentSlice = createSlice({
//   name: 'enrollments',
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     clearSuccess: (state) => {
//       state.success = null;
//     },
//     clearCurrentEnrollment: (state) => {
//       state.currentEnrollment = null;
//     },
//     clearCourseProgress: (state) => {
//       state.courseProgress = null;
//     },
//     clearCertificate: (state) => {
//       state.certificate = null;
//     },
//     clearAnalytics: (state) => {
//       state.analytics = null;
//     },
//     updateEnrollmentProgress: (state, action) => {
//       const { courseId, progress, completedLessons } = action.payload;
//       const enrollment = state.enrollments.find(e => e.course._id === courseId);
//       if (enrollment) {
//         enrollment.progress = progress;
//         enrollment.completedLessons = completedLessons;
//       }
//     },
//     resetEnrollmentState: (state) => {
//       state.currentEnrollment = null;
//       state.courseProgress = null;
//       state.certificate = null;
//       state.enrollmentStatus = null;
//       state.error = null;
//       state.success = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Enroll in course
//       .addCase(enrollInCourse.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(enrollInCourse.fulfilled, (state, action) => {
//         state.loading = false;
//         state.enrollments.push(action.payload.enrollment);
//         state.success = action.payload.message;
//       })
//       .addCase(enrollInCourse.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Fetch my enrollments
//       .addCase(fetchMyEnrollments.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchMyEnrollments.fulfilled, (state, action) => {
//         state.loading = false;
//         state.enrollments = action.payload.enrollments || [];
//       })
//       .addCase(fetchMyEnrollments.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Fetch enrollment status
//       .addCase(fetchEnrollmentStatus.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchEnrollmentStatus.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentEnrollment = action.payload.enrollment;
//         state.enrollmentStatus = action.payload.enrollment ? 'enrolled' : 'not_enrolled';
//       })
//       .addCase(fetchEnrollmentStatus.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.enrollmentStatus = 'error';
//       })
//       // Cancel enrollment
//       .addCase(cancelEnrollment.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(cancelEnrollment.fulfilled, (state, action) => {
//         state.loading = false;
//         state.enrollments = state.enrollments.filter(
//           enrollment => enrollment.course._id !== action.payload
//         );
//         state.currentEnrollment = null;
//         state.enrollmentStatus = 'not_enrolled';
//         state.success = 'Enrollment cancelled successfully';
//       })
//       .addCase(cancelEnrollment.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Fetch course progress
//       .addCase(fetchCourseProgress.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchCourseProgress.fulfilled, (state, action) => {
//         state.loading = false;
//         state.courseProgress = action.payload.progress;
//       })
//       .addCase(fetchCourseProgress.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Complete lesson
//       .addCase(completeLesson.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(completeLesson.fulfilled, (state, action) => {
//         state.loading = false;
//         if (state.courseProgress) {
//           state.courseProgress.percentage = action.payload.progress;
//           state.courseProgress.completed = action.payload.completedLessons;
//           state.courseProgress.isCourseCompleted = action.payload.isCourseCompleted;
//         }
//         state.success = action.payload.message;
//       })
//       .addCase(completeLesson.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Uncomplete lesson
//       .addCase(uncompleteLesson.fulfilled, (state, action) => {
//         if (state.courseProgress) {
//           state.courseProgress.percentage = action.payload.progress;
//           state.courseProgress.completed = action.payload.completedLessons;
//         }
//         state.success = action.payload.message;
//       })
//       // Fetch certificate
//       .addCase(fetchCertificate.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchCertificate.fulfilled, (state, action) => {
//         state.loading = false;
//         state.certificate = action.payload.certificate;
//       })
//       .addCase(fetchCertificate.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Fetch enrollment analytics (Admin)
//       .addCase(fetchEnrollmentAnalytics.fulfilled, (state, action) => {
//         state.analytics = action.payload.analytics;
//       })
//       // Fetch course enrollments (Admin)
//       .addCase(fetchCourseEnrollments.fulfilled, (state, action) => {
//         state.courseEnrollments = action.payload.enrollments;
//       });
//   },
// });

// export const { 
//   clearError, 
//   clearSuccess, 
//   clearCurrentEnrollment, 
//   clearCourseProgress,
//   clearCertificate,
//   clearAnalytics,
//   updateEnrollmentProgress,
//   resetEnrollmentState
// } = enrollmentSlice.actions;

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

// ✅ NEW: Mark material as accessed
export const markMaterialAccessed = createAsyncThunk(
  'enrollments/markMaterialAccessed',
  async ({ courseId, materialType }, { rejectWithValue }) => {
    try {
      const response = await enrollmentAPI.markMaterialAccessed(courseId, materialType);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to mark material as accessed'
      );
    }
  }
);

// ✅ NEW: Add test attempt
export const addTestAttempt = createAsyncThunk(
  'enrollments/addTestAttempt',
  async ({ courseId, attemptData }, { rejectWithValue }) => {
    try {
      const response = await enrollmentAPI.addTestAttempt(courseId, attemptData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add test attempt'
      );
    }
  }
);

// enrollmentSlice.js - Fix the addExperience thunk
export const addExperience = createAsyncThunk(
  'enrollments/addExperience',
  async (courseId, { rejectWithValue }) => {
    try {
      console.log('🔄 Redux Thunk: Adding experience for course:', courseId)
      
      if (!courseId || courseId === 'undefined') {
        throw new Error('Invalid course ID')
      }

      const response = await enrollmentAPI.addExperience(courseId)
      return response.data
    } catch (error) {
      console.error('❌ Redux Thunk Error:', error)
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to add experience'
      )
    }
  }
)

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
          state.courseProgress.percentage = action.payload.progress.overall;
          state.courseProgress.completed = action.payload.progress.completedLessons;
          state.courseProgress.isCourseCompleted = action.payload.progress.isCourseCompleted;
          // ✅ UPDATE SECTION PROGRESS
          state.courseProgress.sectionProgress = action.payload.sectionProgress;
        }
        state.success = action.payload.message;
      })
      .addCase(completeLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Mark material accessed
      .addCase(markMaterialAccessed.fulfilled, (state, action) => {
        if (state.courseProgress) {
          state.courseProgress.sectionProgress = action.payload.sectionProgress;
          state.courseProgress.percentage = action.payload.progress.overall;
        }
        state.success = action.payload.message;
      })
      // Add test attempt
      .addCase(addTestAttempt.fulfilled, (state, action) => {
        if (state.courseProgress) {
          state.courseProgress.sectionProgress = action.payload.sectionProgress;
          state.courseProgress.percentage = action.payload.progress.overall;
        }
        state.success = action.payload.message;
      })
      // Add experience
      .addCase(addExperience.fulfilled, (state, action) => {
        if (state.courseProgress) {
          state.courseProgress.sectionProgress = action.payload.sectionProgress;
          state.courseProgress.percentage = action.payload.progress.overall;
        }
        state.success = action.payload.message;
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