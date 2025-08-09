import { createSlice } from '@reduxjs/toolkit';

const postSlice = createSlice({
  name: 'post',
  initialState: {
    post: [], 
    selectPost: null, 
  },
  reducers: {
    setPost: (state, action) => {
      state.post = action.payload; // Sets the posts array
    },
    setSelectPost: (state, action) => {
      state.selectPost = action.payload; // Sets the selected post
    },
    
  },
});

export const { setPost, setSelectPost } = postSlice.actions;
export default postSlice.reducer;
