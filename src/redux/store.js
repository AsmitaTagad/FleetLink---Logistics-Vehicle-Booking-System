// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slicer/authSlicer.js';
import globalReducer from './slicer/globalModelSlicer.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    globalState:globalReducer
  },
});
