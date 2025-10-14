import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import lessonAPI from '../api/lessonAPI';

// Async Thunks
export const fetchCourseLessons = createAsyncThunk(
  'lessons/fetchCourseLessons',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await lessonAPI.getCourseLessons(courseId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch lessons'
      );
    }
  }
);

export const createLesson = createAsyncThunk(
  'lessons/create',
  async (lessonData, { rejectWithValue }) => {
    try {
      const response = await lessonAPI.createLesson(lessonData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create lesson'
      );
    }
  }
);

export const updateLesson = createAsyncThunk(
  'lessons/update',
  async ({ lessonId, lessonData }, { rejectWithValue }) => {
    try {
      const response = await lessonAPI.updateLesson(lessonId, lessonData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update lesson'
      );
    }
  }
);

export const deleteLesson = createAsyncThunk(
  'lessons/delete',
  async (lessonId, { rejectWithValue }) => {
    try {
      await lessonAPI.deleteLesson(lessonId);
      return lessonId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete lesson'
      );
    }
  }
);

export const markLessonCompleted = createAsyncThunk(
  'lessons/markCompleted',
  async (lessonId, { rejectWithValue }) => {
    try {
      const response = await lessonAPI.markLessonCompleted(lessonId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to mark lesson as completed'
      );
    }
  }
);

export const addLessonResource = createAsyncThunk(
  'lessons/addResource',
  async ({ lessonId, resourceData }, { rejectWithValue }) => {
    try {
      const response = await lessonAPI.addLessonResource(lessonId, resourceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add resource'
      );
    }
  }
);

export const deleteLessonResource = createAsyncThunk(
  'lessons/deleteResource',
  async ({ lessonId, resourceId }, { rejectWithValue }) => {
    try {
      await lessonAPI.deleteLessonResource(lessonId, resourceId);
      return { lessonId, resourceId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete resource'
      );
    }
  }
);

const initialState = {
  lessons: [],
  loading: false,
  error: null,
  success: null,
  currentLesson: null
};

const lessonSlice = createSlice({
  name: 'lessons',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    clearLessons: (state) => {
      state.lessons = [];
    },
    setCurrentLesson: (state, action) => {
      state.currentLesson = action.payload;
    },
    updateLessonOrder: (state, action) => {
      const { lessonId, newOrder } = action.payload;
      const lesson = state.lessons.find(l => l._id === lessonId);
      if (lesson) {
        lesson.order = newOrder;
      }
      // Re-sort lessons after order change
      state.lessons.sort((a, b) => a.order - b.order);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch course lessons
      .addCase(fetchCourseLessons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseLessons.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = action.payload.lessons || [];
      })
      .addCase(fetchCourseLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create lesson
      .addCase(createLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons.push(action.payload.lesson);
        state.success = action.payload.message;
      })
      .addCase(createLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update lesson
      .addCase(updateLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLesson.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.lessons.findIndex(
          lesson => lesson._id === action.payload.lesson._id
        );
        if (index !== -1) {
          state.lessons[index] = action.payload.lesson;
        }
        state.success = action.payload.message;
      })
      .addCase(updateLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete lesson
      .addCase(deleteLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = state.lessons.filter(
          lesson => lesson._id !== action.payload
        );
        state.success = 'Lesson deleted successfully';
      })
      .addCase(deleteLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Mark lesson completed
      .addCase(markLessonCompleted.fulfilled, (state, action) => {
        state.success = action.payload.message;
      })
      // Add lesson resource
      .addCase(addLessonResource.fulfilled, (state, action) => {
        const { lessonId, resource } = action.payload;
        const lesson = state.lessons.find(l => l._id === lessonId);
        if (lesson) {
          if (!lesson.resources) lesson.resources = [];
          lesson.resources.push(resource);
        }
        state.success = action.payload.message;
      })
      // Delete lesson resource
      .addCase(deleteLessonResource.fulfilled, (state, action) => {
        const { lessonId, resourceId } = action.payload;
        const lesson = state.lessons.find(l => l._id === lessonId);
        if (lesson && lesson.resources) {
          lesson.resources = lesson.resources.filter(r => r._id !== resourceId);
        }
        state.success = 'Resource deleted successfully';
      });
  },
});

export const { 
  clearError, 
  clearSuccess, 
  clearLessons, 
  setCurrentLesson,
  updateLessonOrder
} = lessonSlice.actions;

export default lessonSlice.reducer;