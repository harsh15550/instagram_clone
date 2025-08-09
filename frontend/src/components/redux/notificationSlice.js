import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notification: [], // Initial state as an array
  },
  reducers: {
    addNotification: (state, action) => {
      state.notification.push(action.payload); 
    },
    removeNotification: (state, action) => {
      state.notification = state.notification.filter(
        (item) => !(item.postId === action.payload.postId && item.userId === action.payload.userId)
      );
    },    
  },
});

export const { addNotification, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
