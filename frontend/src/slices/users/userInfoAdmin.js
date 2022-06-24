import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getUserById = createAsyncThunk(
  'userInfoAdmin/getUserById',
  async (id, { rejectWithValue, getState }) => {
    const token = getState().userInfo.userInfo.userInfo.token;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(`/api/users/${id}`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateProfileAdmin = createAsyncThunk(
  'userInfoAdmin/updateProfileAdmin',
  async (arg, { rejectWithValue, getState }) => {
    const { id, name, email, isAdmin } = arg;
    const token = getState().userInfo.userInfo.userInfo.token;
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(`/api/users/${id}`, arg, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userInfoAdminSlice = createSlice({
  name: 'userInfoAdmin',
  initialState: { userInfoAdmin: {} },
  reducers: {
    resetUserInfoAdmin(state) {
      state.userInfoAdmin = {};
    },
  },
  extraReducers: {
    // Get user by Id for admin
    [getUserById.pending]: (state, action) => {
      state.userInfoAdmin = {
        loading: true,
      };
    },
    [getUserById.fulfilled]: (state, action) => {
      if (state.userInfoAdmin.success) {
        state.userInfoAdmin = {
          success: true,
          userInfoAdmin: action.payload,
        };
      } else {
        state.userInfoAdmin = {
          userInfoAdmin: action.payload,
        };
      }
    },
    [getUserById.rejected]: (state, action) => {
      state.userInfoAdmin = {
        error: action.payload,
      };
    },

    // Update user by admin
    [updateProfileAdmin.pending]: (state, action) => {
      state.userInfoAdmin = {
        loading: true,
      };
    },
    [updateProfileAdmin.fulfilled]: (state, action) => {
      state.userInfoAdmin = {
        success: true,
        userInfoAdmin: action.payload,
      };
    },
    [updateProfileAdmin.rejected]: (state, action) => {
      state.userInfoAdmin = {
        error: action.payload,
      };
    },
  },
});

export const { resetUserInfoAdmin } = userInfoAdminSlice.actions;

export default userInfoAdminSlice.reducer;
