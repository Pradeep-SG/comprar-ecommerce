import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAllOrders = createAsyncThunk(
  'orderInfo/getAllOrders',
  async (_, { rejectWithValue, getState }) => {
    const token = getState().userInfo.userInfo.userInfo.token;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get('/api/orders', config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const allOrdersSlice = createSlice({
  name: 'allOrders',
  initialState: { allOrders: {} },
  reducers: {
    resetAllOrders(state) {
      state.allOrders = {};
    },
  },
  extraReducers: {
    // Creating New Order => saving order ID
    [getAllOrders.pending]: (state, action) => {
      state.allOrders = {
        loading: true,
      };
    },
    [getAllOrders.fulfilled]: (state, action) => {
      state.allOrders = {
        allOrders: action.payload,
      };
    },
    [getAllOrders.rejected]: (state, action) => {
      state.allOrders = {
        error: action.payload,
      };
    },
  },
});

export const { resetAllOrders } = allOrdersSlice.actions;

export default allOrdersSlice.reducer;
