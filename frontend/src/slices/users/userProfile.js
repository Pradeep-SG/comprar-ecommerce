import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const userProfile = createAsyncThunk(
  'user/userProfile',
  async (_, { rejectWithValue, getState }) => {
    const token = getState().userInfo.userInfo.userInfo.token;
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get('/api/users/profile', config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : { user: {} };

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  extraReducers: {
    [userProfile.pending]: (state, action) => {
      state.userInfo = {
        ...state.userInfo,
        loading: true,
      };
    },
    [userProfile.fulfilled]: (state, action) => {
      state.userInfo = {
        ...state.userInfo,
        loading: false,
        user: action.payload,
      };
      localStorage.setItem('user', JSON.stringify(state));
    },
    [userProfile.rejected]: (state, action) => {
      state.userInfo = {
        ...state.userInfo,
        loading: false,
        error: action.payload,
      };
    },
  },
});

export default userProfileSlice.reducer;
