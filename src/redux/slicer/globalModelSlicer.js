import { createSlice } from "@reduxjs/toolkit";

const GlobalModelSlicer = createSlice({
  name: "globalState",
  initialState: {
    isAuth: false,
  },
  reducers: {
    setIsAuth: (state, action) => {
      state.isAuth = action.payload;
    },
  },
});

export const { setIsAuth } = GlobalModelSlicer.actions;
export default GlobalModelSlicer.reducer;
