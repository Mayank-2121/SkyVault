import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        username: '',
        userId: '',
        userType: ''
    },
    reducers: {
        setUser(state, action) {
            state.username = action.payload.username;
            state.userId = action.payload.userId;
            state.userType = action.payload.userType;
        },
        clearUser(state) {
            state.username = '';
            state.userId = '';
            state.userType = '';
        }
    }
});

export const { setUser, clearUser } = userSlice.actions; // Export both actions
export default userSlice.reducer;
