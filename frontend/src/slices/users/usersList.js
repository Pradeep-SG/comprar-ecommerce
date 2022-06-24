import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getUsersList = createAsyncThunk(
  'usersList/getUsersList',
  async (_, { rejectWithValue, getState }) => {
    const token = getState().userInfo.userInfo.userInfo.token;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get('/api/users', config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteUserById = createAsyncThunk(
  'usersList/deleteUserById',
  async (id, { rejectWithValue, getState }) => {
    const token = getState().userInfo.userInfo.userInfo.token;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.delete(`/api/users/${id}`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const usersListSlice = createSlice({
  name: 'usersList',
  initialState: { usersList: {} },
  reducers: {
    resetUsersList(state, action) {
      state.usersList = {};
    },
  },
  extraReducers: {
    // Get All users List
    [getUsersList.pending]: (state, action) => {
      state.usersList = {
        loading: true,
      };
    },
    [getUsersList.fulfilled]: (state, action) => {
      state.usersList = {
        usersList: action.payload,
      };
    },
    [getUsersList.rejected]: (state, action) => {
      state.usersList = {
        error: action.payload,
      };
    },

    // Delete user By Id
    [deleteUserById.pending]: (state, action) => {
      state.usersList = {
        deleteUserLoading: true,
      };
    },
    [deleteUserById.fulfilled]: (state, action) => {
      state.usersList = {
        deleteUserSuccess: true,
      };
    },
    [deleteUserById.rejected]: (state, action) => {
      state.usersList = {
        deleteUserError: action.payload,
      };
    },
  },
});

export const { resetUsersList } = usersListSlice.actions;

export default usersListSlice.reducer;
