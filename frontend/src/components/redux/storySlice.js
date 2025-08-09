import { createSlice } from '@reduxjs/toolkit';

const storySlice = createSlice({
  name: 'story',
  initialState: {
    selectStory: {}, 
  },
  reducers: {
    setSelectStory: (state, action) => {
      state.selectStory = action.payload; 
    },
    
  },
});

export const { setSelectStory } = storySlice.actions;
export default storySlice.reducer;
