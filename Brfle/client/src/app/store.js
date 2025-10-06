import { configureStore } from '@reduxjs/toolkit';
import projectReducer from '../feature/projects/projectSlice';
import authReducer from '../feature/auth/authSlice';
// import clientReducer from '../feature/clients/clientSlice';

export const store = configureStore({
  reducer: {
    projects: projectReducer,
    auth: authReducer,
      // clients: clientReducer,
  },
});
