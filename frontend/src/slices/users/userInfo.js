import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const userLogin = createAsyncThunk(
  'userInfo/userLogin',
  async (arg, { rejectWithValue, getState }) => {
    const { email, password } = arg;
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post(
        '/api/users/login',
        { email, password },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const userRegister = createAsyncThunk(
  'userInfo/userRegister',
  async (arg, { rejectWithValue }) => {
    const { name, email, password } = arg;
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post(
        '/api/users',
        { name, email, password },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const userProfile = createAsyncThunk(
  'userInfo/userProfile',
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

export const updateProfile = createAsyncThunk(
  'userInfo/updateProfile',
  async (arg, { rejectWithValue, getState }) => {
    const { name, password } = arg;
    const token = getState().userInfo.userInfo.userInfo.token;
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        '/api/users/profile',
        { name, password },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : { userInfo: {} };

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    userLogout(state, action) {
      localStorage.removeItem('userInfo');
      state.userInfo = {};
    },
  },
  extraReducers: {
    // User Login
    [userLogin.pending]: (state, action) => {
      state.userInfo = {
        loading: true,
      };
    },
    [userLogin.fulfilled]: (state, action) => {
      state.userInfo = {
        userInfo: action.payload,
      };
      localStorage.setItem('userInfo', JSON.stringify(state));
    },
    [userLogin.rejected]: (state, action) => {
      state.userInfo = {
        error: action.payload,
      };
    },

    // User Register
    [userRegister.pending]: (state, action) => {
      state.userInfo = {
        loading: true,
      };
    },
    [userRegister.fulfilled]: (state, action) => {
      state.userInfo = {
        userInfo: action.payload,
      };
      localStorage.setItem('userInfo', JSON.stringify(state));
    },
    [userRegister.rejected]: (state, action) => {
      state.userInfo = {
        error: action.payload,
      };
    },

    // User Profile
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

    // Update User Profile
    [updateProfile.pending]: (state, action) => {
      state.userInfo = {
        ...state.userInfo,
        loading: true,
      };
    },
    [updateProfile.fulfilled]: (state, action) => {
      state.userInfo = {
        userInfo: action.payload,
      };
      localStorage.setItem('userInfo', JSON.stringify(state));
      state.userInfo = {
        ...state.userInfo,
        success: true,
      };
    },
    [updateProfile.rejected]: (state, action) => {
      state.userInfo = {
        error: action.payload,
      };
    },
  },
});

export const { userLogout } = userInfoSlice.actions;

export default userInfoSlice.reducer;
