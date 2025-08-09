import { createSlice } from '@reduxjs/toolkit'

const authslice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        userProfile: null,
        selectUser: null,
        suggestedUser: []
    },
    reducers: {
        setAuthuser: (state, action) => {
            state.user = action.payload; // Update state with payload
        },
        setUserProfile: (state, action) => {
            state.userProfile = action.payload
        },
        setSelectedUser: (state, action) => {
            state.selectUser = action.payload
        },
        setSuggestedUser: (state, action) => {
            state.suggestedUser = action.payload
        }
    }
})

export const { setAuthuser, setUserProfile, setSelectedUser, setSuggestedUser } = authslice.actions;
export default authslice.reducer