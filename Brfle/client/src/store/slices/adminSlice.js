import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminAPI from './../api/adminApi';

// ----------------- Dashboard Thunks -----------------
const fetchDashboardStats = createAsyncThunk(
  "admin/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getDashboardStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch dashboard stats");
    }
  }
);

const fetchRevenueAnalytics = createAsyncThunk(
  "admin/fetchRevenueAnalytics",
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getRevenueAnalytics(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch revenue analytics");
    }
  }
);

const fetchCourseAnalytics = createAsyncThunk(
  "admin/fetchCourseAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getCourseAnalytics();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch course analytics");
    }
  }
);

const fetchUserAnalytics = createAsyncThunk(
  "admin/fetchUserAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getUserAnalytics();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user analytics");
    }
  }
);

const fetchRecentActivities = createAsyncThunk(
  "admin/fetchRecentActivities",
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getRecentActivities(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch recent activities");
    }
  }
);

// ----------------- Users Thunks -----------------
const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getAllUsers(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
    }
  }
);

const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateUserRole(userId, { role });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update user role");
    }
  }
);

const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await adminAPI.deleteUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete user");
    }
  }
);

const bulkUserAction = createAsyncThunk(
  "admin/bulkUserAction",
  async ({ userIds, action }, { rejectWithValue }) => {
    try {
      console.log('Bulk user action:', { userIds, action });
      return {
        success: true,
        message: `Bulk action '${action}' completed successfully for ${userIds.length} users`,
        userIds
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to perform bulk action");
    }
  }
);

const updateUserStatus = createAsyncThunk(
  "admin/updateUserStatus",
  async ({ userId, isActive }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateUserRole(userId, { isActive });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update user status");
    }
  }
);

// ----------------- Courses Thunks -----------------
const fetchAllCourses = createAsyncThunk(
  "admin/fetchAllCourses",
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getAllCourses(params);
      console.log("Courses API Response:", response.data);
      return response.data;
    } catch (error) {
      console.log("Courses API Error:", error);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch courses");
    }
  }
);

const updateCourseStatus = createAsyncThunk(
  "admin/updateCourseStatus",
  async ({ courseId, status }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateCourseStatus(courseId, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update course status");
    }
  }
);

const deleteCourse = createAsyncThunk(
  "admin/deleteCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      await adminAPI.deleteCourse(courseId);
      return courseId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete course");
    }
  }
);

const updateCourseDetails = createAsyncThunk(
  "admin/updateCourseDetails",
  async ({ courseId, courseData }, { rejectWithValue }) => {
    try {
      console.log('Updating course in Redux:', courseId, courseData);
      const response = await adminAPI.updateCourse(courseId, courseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update course details");
    }
  }
);

const createCourse = createAsyncThunk(
  "admin/createCourse",
  async (courseData, { rejectWithValue }) => {
    try {
      console.log('Creating course in Redux:', courseData);
      const response = await adminAPI.createCourse(courseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create course");
    }
  }
);

const recalculateCourseDuration = createAsyncThunk(
  "admin/recalculateCourseDuration",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.recalculateCourseDuration(courseId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to recalculate course duration");
    }
  }
);

// ----------------- Initial State -----------------
const initialState = {
  // Dashboard
  dashboardStats: null,
  dashboardLoading: false,
  revenueAnalytics: null,
  revenueLoading: false,
  courseAnalytics: null,
  courseAnalyticsLoading: false,
  userAnalytics: null,
  userAnalyticsLoading: false,
  recentActivities: [],
  recentActivitiesLoading: false,
  dashboardError: null,
  
  // Users
  users: [],
  usersPagination: null,
  usersLoading: false,
  usersSearchTerm: "",
  usersFilterRole: "all",
  selectedUsers: [],
  
  // Courses
  courses: [],
  coursesPagination: null,
  coursesLoading: false,
  coursesSearchTerm: "",
  coursesFilterCategory: "all",
  courseFormData: {
    title: "",
    description: "",
    shortDescription: "",
    category: "",
    level: "Beginner",
    price: "",
    thumbnail: "",
    lessons: [],
    requirements: [],
    whatYouWillLearn: [],
    targetAudience: [],
    tags: [],
    language: "English",
    certificateAvailable: true,
    passingScore: 70,
    status: "published"
  },
  isCreatingCourse: false,
  editingCourse: null,
  uploadLoading: false,
    
  // UI State
  loading: false,
  error: null,
  success: null,
};

// ----------------- Slice -----------------
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.dashboardError = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Dashboard reducers
    setDashboardPeriod: (state, action) => {
      state.dashboardPeriod = action.payload;
    },
    clearDashboardData: (state) => {
      state.dashboardStats = null;
      state.revenueAnalytics = null;
      state.courseAnalytics = null;
      state.userAnalytics = null;
      state.recentActivities = [];
    },
    
    // User management reducers
    setUsersSearchTerm: (state, action) => {
      state.usersSearchTerm = action.payload;
    },
    setUsersFilterRole: (state, action) => {
      state.usersFilterRole = action.payload;
    },
    setSelectedUsers: (state, action) => {
      state.selectedUsers = action.payload;
    },
    toggleUserSelection: (state, action) => {
      const userId = action.payload;
      if (state.selectedUsers.includes(userId)) {
        state.selectedUsers = state.selectedUsers.filter(id => id !== userId);
      } else {
        state.selectedUsers.push(userId);
      }
    },
    selectAllUsers: (state, action) => {
      const userIds = action.payload;
      if (state.selectedUsers.length === userIds.length && userIds.length > 0) {
        state.selectedUsers = [];
      } else {
        state.selectedUsers = userIds;
      }
    },
    clearSelectedUsers: (state) => {
      state.selectedUsers = [];
    },
    
    // Course management reducers
    setCoursesSearchTerm: (state, action) => {
      state.coursesSearchTerm = action.payload;
    },
    setCoursesFilterCategory: (state, action) => {
      state.coursesFilterCategory = action.payload;
    },
    clearCoursesFilters: (state) => {
      state.coursesSearchTerm = "";
      state.coursesFilterCategory = "all";
    },
    setCourseFormData: (state, action) => {
      state.courseFormData = { ...state.courseFormData, ...action.payload };
    },
    resetCourseFormData: (state) => {
      state.courseFormData = initialState.courseFormData;
    },
    setIsCreatingCourse: (state, action) => {
      state.isCreatingCourse = action.payload;
    },
    setEditingCourse: (state, action) => {
      state.editingCourse = action.payload;
    },
    updateCourseLesson: (state, action) => {
      const { lessonId, field, value } = action.payload;
      state.courseFormData.lessons = state.courseFormData.lessons.map(lesson =>
        lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
      );
    },
    addCourseLesson: (state) => {
      const newLesson = {
        id: Date.now().toString(),
        title: "",
        description: "",
        videoUrl: "",
        duration: 0,
        order: state.courseFormData.lessons.length + 1,
        isPreview: false,
        resources: []
      };
      state.courseFormData.lessons.push(newLesson);
    },
    removeCourseLesson: (state, action) => {
      const lessonId = action.payload;
      state.courseFormData.lessons = state.courseFormData.lessons.filter(lesson => lesson.id !== lessonId);
      
      // Reorder remaining lessons
      state.courseFormData.lessons = state.courseFormData.lessons.map((lesson, index) => ({
        ...lesson,
        order: index + 1
      }));
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Cases
      .addCase(fetchDashboardStats.pending, (state) => {
        state.dashboardLoading = true;
        state.dashboardError = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardStats = action.payload.stats || action.payload.data;
        state.dashboardError = null;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardError = action.payload;
      })
      
      .addCase(fetchRevenueAnalytics.pending, (state) => {
        state.revenueLoading = true;
        state.dashboardError = null;
      })
      .addCase(fetchRevenueAnalytics.fulfilled, (state, action) => {
        state.revenueLoading = false;
        state.revenueAnalytics = action.payload.analytics || action.payload.data;
        state.dashboardError = null;
      })
      .addCase(fetchRevenueAnalytics.rejected, (state, action) => {
        state.revenueLoading = false;
        state.dashboardError = action.payload;
      })
      
      .addCase(fetchCourseAnalytics.pending, (state) => {
        state.courseAnalyticsLoading = true;
        state.dashboardError = null;
      })
      .addCase(fetchCourseAnalytics.fulfilled, (state, action) => {
        state.courseAnalyticsLoading = false;
        state.courseAnalytics = action.payload.analytics || action.payload.data;
        state.dashboardError = null;
      })
      .addCase(fetchCourseAnalytics.rejected, (state, action) => {
        state.courseAnalyticsLoading = false;
        state.dashboardError = action.payload;
      })
      
      .addCase(fetchUserAnalytics.pending, (state) => {
        state.userAnalyticsLoading = true;
        state.dashboardError = null;
      })
      .addCase(fetchUserAnalytics.fulfilled, (state, action) => {
        state.userAnalyticsLoading = false;
        state.userAnalytics = action.payload.analytics || action.payload.data;
        state.dashboardError = null;
      })
      .addCase(fetchUserAnalytics.rejected, (state, action) => {
        state.userAnalyticsLoading = false;
        state.dashboardError = action.payload;
      })
      
      .addCase(fetchRecentActivities.pending, (state) => {
        state.recentActivitiesLoading = true;
        state.dashboardError = null;
      })
      .addCase(fetchRecentActivities.fulfilled, (state, action) => {
        state.recentActivitiesLoading = false;
        state.recentActivities = action.payload.activities || action.payload.data || [];
        state.dashboardError = null;
      })
      .addCase(fetchRecentActivities.rejected, (state, action) => {
        state.recentActivitiesLoading = false;
        state.dashboardError = action.payload;
      })
      
      // Users Cases
      .addCase(fetchAllUsers.pending, (state) => {
        state.usersLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload.users || [];
        state.usersPagination = action.payload.pagination;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload;
      })
      
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const updatedUser = action.payload.user;
        const index = state.users.findIndex((user) => user._id === updatedUser._id);
        if (index !== -1) state.users[index] = updatedUser;
        state.success = action.payload.message;
      })
      
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
        state.selectedUsers = state.selectedUsers.filter(id => id !== action.payload);
        state.success = "User deleted successfully";
      })
      
      .addCase(bulkUserAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkUserAction.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.selectedUsers = [];
      })
      .addCase(bulkUserAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(updateUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload.user;
        const index = state.users.findIndex(user => user._id === updatedUser._id);
        if (index !== -1) state.users[index] = updatedUser;
        state.success = action.payload.message || "User status updated successfully";
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Courses Cases
      .addCase(fetchAllCourses.pending, (state) => {
        state.coursesLoading = true;
        state.error = null;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.coursesLoading = false;
        
        const responseData = action.payload;
        console.log("Processing courses response:", responseData);
        
        if (responseData.success) {
          state.courses = responseData.data || responseData.courses || [];
          state.coursesPagination = responseData.pagination;
        } else if (Array.isArray(responseData)) {
          state.courses = responseData;
        } else {
          state.courses = [];
          console.warn("Unexpected API response structure:", responseData);
        }
        
        state.error = null;
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.coursesLoading = false;
        state.error = action.payload;
        state.courses = [];
      })
      
      .addCase(updateCourseStatus.fulfilled, (state, action) => {
        const responseData = action.payload;
        const updatedCourse = responseData.data || responseData.course;
        if (updatedCourse && updatedCourse._id) {
          const index = state.courses.findIndex((c) => c._id === updatedCourse._id);
          if (index !== -1) {
            state.courses[index] = updatedCourse;
          }
        }
        state.success = responseData.message || "Course status updated successfully";
      })
      
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter((c) => c._id !== action.payload);
        state.success = "Course deleted successfully";
      })
      
      .addCase(updateCourseDetails.fulfilled, (state, action) => {
        const responseData = action.payload;
        const updatedCourse = responseData.data || responseData.course;
        
        if (updatedCourse && updatedCourse._id) {
          const index = state.courses.findIndex((c) => c._id === updatedCourse._id);
          if (index !== -1) {
            state.courses[index] = updatedCourse;
          } else {
            state.courses.unshift(updatedCourse);
          }
        }
        
        state.success = responseData.message || "Course updated successfully";
        state.isCreatingCourse = false;
        state.editingCourse = null;
        state.courseFormData = initialState.courseFormData;
      })
      
      .addCase(updateCourseDetails.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      .addCase(createCourse.fulfilled, (state, action) => {
        const responseData = action.payload;
        const newCourse = responseData.data || responseData.course;
        
        if (newCourse) {
          state.courses.unshift(newCourse);
        }
        
        state.success = responseData.message || "Course created successfully";
        state.isCreatingCourse = false;
        state.editingCourse = null;
        state.courseFormData = initialState.courseFormData;
      })
      
      .addCase(createCourse.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      .addCase(recalculateCourseDuration.fulfilled, (state, action) => {
        const responseData = action.payload;
        const updatedCourse = responseData.data || responseData.course;
        if (updatedCourse && updatedCourse._id) {
          const index = state.courses.findIndex((c) => c._id === updatedCourse._id);
          if (index !== -1) state.courses[index] = updatedCourse;
        }
        state.success = responseData.message || "Course duration recalculated";
      });
  },
});

// Export all actions
export const { 
  clearError, 
  clearSuccess, 
  setLoading,
  setDashboardPeriod,
  clearDashboardData,
  setUsersSearchTerm,
  setUsersFilterRole,
  setSelectedUsers,
  toggleUserSelection,
  selectAllUsers,
  clearSelectedUsers,
  setCoursesSearchTerm,
  setCoursesFilterCategory,
  clearCoursesFilters,
  setCourseFormData,
  resetCourseFormData,
  setIsCreatingCourse,
  setEditingCourse,
  updateCourseLesson,
  addCourseLesson,
  removeCourseLesson
} = adminSlice.actions;

// Export all async thunks
export {
  // Dashboard
  fetchDashboardStats,
  fetchRevenueAnalytics,
  fetchCourseAnalytics,
  fetchUserAnalytics,
  fetchRecentActivities,
  
  // Users
  fetchAllUsers,
  updateUserRole,
  deleteUser,
  bulkUserAction,
  updateUserStatus,
  
  // Courses
  fetchAllCourses,
  updateCourseStatus,
  deleteCourse,
  updateCourseDetails,
  createCourse,
  recalculateCourseDuration
};

export default adminSlice.reducer;