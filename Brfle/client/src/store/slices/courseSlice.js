
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import courseAPI from '../api/courseAPI';

// // Async Thunks
// export const fetchAllCourses = createAsyncThunk(
//   'courses/fetchAll',
//   async (params = {}, { rejectWithValue }) => {
//     try {
//       const response = await courseAPI.getAllCourses(params);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to fetch courses'
//       );
//     }
//   }
// );

// export const fetchCourse = createAsyncThunk(
//   'courses/fetchOne',
//   async (courseId, { rejectWithValue }) => {
//     try {
//       const response = await courseAPI.getCourse(courseId);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to fetch course'
//       );
//     }
//   }
// );

// export const createCourse = createAsyncThunk(
//   'courses/create',
//   async (courseData, { rejectWithValue }) => {
//     try {
//       const response = await courseAPI.createCourse(courseData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to create course'
//       );
//     }
//   }
// );

// export const updateCourse = createAsyncThunk(
//   'courses/update',
//   async ({ courseId, courseData }, { rejectWithValue }) => {
//     try {
//       const response = await courseAPI.updateCourse(courseId, courseData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to update course'
//       );
//     }
//   }
// );

// export const deleteCourse = createAsyncThunk(
//   'courses/delete',
//   async (courseId, { rejectWithValue }) => {
//     try {
//       await courseAPI.deleteCourse(courseId);
//       return courseId;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to delete course'
//       );
//     }
//   }
// );

// export const addCourseExperience = createAsyncThunk(
//   'courses/addExperience',
//   async ({ courseId, experienceData }, { rejectWithValue }) => {
//     try {
//       const response = await courseAPI.addExperience(courseId, experienceData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to add experience'
//       );
//     }
//   }
// );

// export const attemptCourseTest = createAsyncThunk(
//   'courses/attemptTest',
//   async ({ courseId, attemptData }, { rejectWithValue }) => {
//     try {
//       const response = await courseAPI.attemptMCQTest(courseId, attemptData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to submit test'
//       );
//     }
//   }
// );

// const initialState = {
//   courses: [],
//   currentCourse: null,
//   editingCourse: null,
//   isCreatingCourse: false,
//   loading: false,
//   error: null,
//   success: null,
//   filters: {
//     category: '',
//     difficulty: '',
//     search: '',
//     sortBy: 'createdAt',
//     sortOrder: 'desc'
//   },
//   pagination: {
//     page: 1,
//     pages: 1,
//     total: 0
//   }
// };

// const courseSlice = createSlice({
//   name: 'courses',
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     clearSuccess: (state) => {
//       state.success = null;
//     },
//     clearCurrentCourse: (state) => {
//       state.currentCourse = null;
//     },
//     setEditingCourse: (state, action) => {
//       state.editingCourse = action.payload;
//     },
//     setIsCreatingCourse: (state, action) => {
//       state.isCreatingCourse = action.payload;
//     },
//     setFilters: (state, action) => {
//       state.filters = { ...state.filters, ...action.payload };
//     },
//     clearFilters: (state) => {
//       state.filters = {
//         category: '',
//         difficulty: '',
//         search: '',
//         sortBy: 'createdAt',
//         sortOrder: 'desc'
//       };
//     },
//     resetCourseState: (state) => {
//       state.editingCourse = null;
//       state.isCreatingCourse = false;
//       state.currentCourse = null;
//       state.error = null;
//       state.success = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch all courses
//       .addCase(fetchAllCourses.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAllCourses.fulfilled, (state, action) => {
//         state.loading = false;
//         state.courses = action.payload.courses;
//         state.pagination = {
//           page: action.payload.page,
//           pages: action.payload.pages,
//           total: action.payload.total
//         };
//       })
//       .addCase(fetchAllCourses.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Fetch single course
//       .addCase(fetchCourse.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchCourse.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentCourse = action.payload.course;
//       })
//       .addCase(fetchCourse.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Create course
//       .addCase(createCourse.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createCourse.fulfilled, (state, action) => {
//         state.loading = false;
//         state.courses.unshift(action.payload.course);
//         state.success = action.payload.message;
//         state.isCreatingCourse = false;
//         state.editingCourse = null;
//       })
//       .addCase(createCourse.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Update course
//       .addCase(updateCourse.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateCourse.fulfilled, (state, action) => {
//         state.loading = false;
//         const index = state.courses.findIndex(
//           course => course._id === action.payload.course._id
//         );
//         if (index !== -1) {
//           state.courses[index] = action.payload.course;
//         }
//         if (state.currentCourse && state.currentCourse._id === action.payload.course._id) {
//           state.currentCourse = action.payload.course;
//         }
//         state.success = action.payload.message;
//         state.isCreatingCourse = false;
//         state.editingCourse = null;
//       })
//       .addCase(updateCourse.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Delete course
//       .addCase(deleteCourse.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deleteCourse.fulfilled, (state, action) => {
//         state.loading = false;
//         state.courses = state.courses.filter(
//           course => course._id !== action.payload
//         );
//         if (state.currentCourse && state.currentCourse._id === action.payload) {
//           state.currentCourse = null;
//         }
//         state.success = 'Course deleted successfully';
//       })
//       .addCase(deleteCourse.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Add experience
//       .addCase(addCourseExperience.fulfilled, (state, action) => {
//         if (state.currentCourse) {
//           state.currentCourse.experiences.push(action.payload.experience);
//           state.success = action.payload.message;
//         }
//       })
//       // Attempt test
//       .addCase(attemptCourseTest.fulfilled, (state, action) => {
//         if (state.currentCourse) {
//           state.currentCourse.testAttempts = state.currentCourse.testAttempts || [];
//           state.currentCourse.testAttempts.push(action.payload.result);
//           state.success = action.payload.message;
//         }
//       });
//   },
// });

// export const { 
//   clearError, 
//   clearSuccess, 
//   clearCurrentCourse, 
//   setEditingCourse,
//   setIsCreatingCourse,
//   setFilters, 
//   clearFilters,
//   resetCourseState
// } = courseSlice.actions;

// export default courseSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import courseAPI from '../api/courseAPI';

// Async Thunks
export const fetchAllCourses = createAsyncThunk(
  'courses/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await courseAPI.getAllCourses(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch courses'
      );
    }
  }
);

export const fetchCourse = createAsyncThunk(
  'courses/fetchOne',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await courseAPI.getCourse(courseId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch course'
      );
    }
  }
);

export const createCourse = createAsyncThunk(
  'courses/create',
  async (courseData, { rejectWithValue }) => {
    try {
      const response = await courseAPI.createCourse(courseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create course'
      );
    }
  }
);

export const updateCourse = createAsyncThunk(
  'courses/update',
  async ({ courseId, courseData }, { rejectWithValue }) => {
    try {
      const response = await courseAPI.updateCourse(courseId, courseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update course'
      );
    }
  }
);

export const deleteCourse = createAsyncThunk(
  'courses/delete',
  async (courseId, { rejectWithValue }) => {
    try {
      await courseAPI.deleteCourse(courseId);
      return courseId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete course'
      );
    }
  }
);

// ✅ ADD THESE MISSING MCQ TEST ACTIONS
export const createMCQTest = createAsyncThunk(
  'courses/createMCQTest',
  async ({ courseId, testData }, { rejectWithValue }) => {
    try {
      const response = await courseAPI.createMCQTest(courseId, testData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create MCQ test'
      );
    }
  }
);

export const updateMCQTest = createAsyncThunk(
  'courses/updateMCQTest',
  async ({ courseId, testData }, { rejectWithValue }) => {
    try {
      const response = await courseAPI.updateMCQTest(courseId, testData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update MCQ test'
      );
    }
  }
);

export const deleteMCQTest = createAsyncThunk(
  'courses/deleteMCQTest',
  async (courseId, { rejectWithValue }) => {
    try {
      await courseAPI.deleteMCQTest(courseId);
      return courseId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete MCQ test'
      );
    }
  }
);

export const addCourseExperience = createAsyncThunk(
  'courses/addExperience',
  async ({ courseId, experienceData }, { rejectWithValue }) => {
    try {
      const response = await courseAPI.addExperience(courseId, experienceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add experience'
      );
    }
  }
);

export const attemptCourseTest = createAsyncThunk(
  'courses/attemptTest',
  async ({ courseId, attemptData }, { rejectWithValue }) => {
    try {
      const response = await courseAPI.attemptMCQTest(courseId, attemptData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to submit test'
      );
    }
  }
);

const initialState = {
  courses: [],
  currentCourse: null,
  editingCourse: null,
  isCreatingCourse: false,
  loading: false,
  error: null,
  success: null,
  filters: {
    category: '',
    difficulty: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  },
  pagination: {
    page: 1,
    pages: 1,
    total: 0
  }
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
    setEditingCourse: (state, action) => {
      state.editingCourse = action.payload;
    },
    setIsCreatingCourse: (state, action) => {
      state.isCreatingCourse = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        difficulty: '',
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };
    },
    resetCourseState: (state) => {
      state.editingCourse = null;
      state.isCreatingCourse = false;
      state.currentCourse = null;
      state.error = null;
      state.success = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all courses
      .addCase(fetchAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total
        };
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single course
      .addCase(fetchCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload.course;
      })
      .addCase(fetchCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create course
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.unshift(action.payload.course);
        state.success = action.payload.message;
        state.isCreatingCourse = false;
        state.editingCourse = null;
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update course
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.courses.findIndex(
          course => course._id === action.payload.course._id
        );
        if (index !== -1) {
          state.courses[index] = action.payload.course;
        }
        if (state.currentCourse && state.currentCourse._id === action.payload.course._id) {
          state.currentCourse = action.payload.course;
        }
        state.success = action.payload.message;
        state.isCreatingCourse = false;
        state.editingCourse = null;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete course
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = state.courses.filter(
          course => course._id !== action.payload
        );
        if (state.currentCourse && state.currentCourse._id === action.payload) {
          state.currentCourse = null;
        }
        state.success = 'Course deleted successfully';
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ✅ ADD THESE MISSING MCQ TEST REDUCERS
      // Create MCQ Test
      .addCase(createMCQTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMCQTest.fulfilled, (state, action) => {
        state.loading = false;
        // Update the course with the new MCQ test
        const index = state.courses.findIndex(
          course => course._id === action.payload.course._id
        );
        if (index !== -1) {
          state.courses[index] = action.payload.course;
        }
        state.success = action.payload.message;
      })
      .addCase(createMCQTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update MCQ Test
      .addCase(updateMCQTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // In courseSlice.js, fix the updateMCQTest.fulfilled reducer:

      // Update MCQ Test
      .addCase(updateMCQTest.fulfilled, (state, action) => {
        state.loading = false;

        // ✅ FIXED: Check if action.payload.course exists and has _id
        if (action.payload.course && action.payload.course._id) {
          const index = state.courses.findIndex(
            course => course._id === action.payload.course._id
          );
          if (index !== -1) {
            state.courses[index] = action.payload.course;
          }
          if (state.currentCourse && state.currentCourse._id === action.payload.course._id) {
            state.currentCourse = action.payload.course;
          }
        }

        state.success = action.payload.message;
      })
      .addCase(updateMCQTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete MCQ Test
      .addCase(deleteMCQTest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMCQTest.fulfilled, (state, action) => {
        state.loading = false;
        // Remove MCQ test from the course
        const index = state.courses.findIndex(
          course => course._id === action.payload
        );
        if (index !== -1) {
          state.courses[index].mcqTest = null;
        }
        state.success = 'MCQ Test deleted successfully';
      })
      .addCase(deleteMCQTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add experience
      .addCase(addCourseExperience.fulfilled, (state, action) => {
        if (state.currentCourse) {
          state.currentCourse.experiences.push(action.payload.experience);
          state.success = action.payload.message;
        }
      })
      // Attempt test
      .addCase(attemptCourseTest.fulfilled, (state, action) => {
        if (state.currentCourse) {
          state.currentCourse.testAttempts = state.currentCourse.testAttempts || [];
          state.currentCourse.testAttempts.push(action.payload.result);
          state.success = action.payload.message;
        }
      });
  },
});

export const {
  clearError,
  clearSuccess,
  clearCurrentCourse,
  setEditingCourse,
  setIsCreatingCourse,
  setFilters,
  clearFilters,
  resetCourseState
} = courseSlice.actions;

export default courseSlice.reducer;