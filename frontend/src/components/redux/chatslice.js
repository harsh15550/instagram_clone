import { createSlice } from "@reduxjs/toolkit";

const chatslice = createSlice({
    name:'chat',
    initialState: {
        onlineUsers:[],
        message:[]
    },
    reducers:{
        setOnlineUsers:(state, action) => {
            state.onlineUsers = action.payload
        },
        setMessage:(state, action) => {
            state.message = action.payload
        }
    }
}) 

export const {setOnlineUsers, setMessage} = chatslice.actions;
export default chatslice.reducer;