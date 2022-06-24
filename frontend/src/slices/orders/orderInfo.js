import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createNewOrder = createAsyncThunk(
  'orderInfo/createNewOrder',
  async (order, { rejectWithValue, getState }) => {
    const token = getState().userInfo.userInfo.userInfo.token;
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post('/api/orders', order, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  'orderInfo/getOrderDetails',
  async (id, { rejectWithValue, getState }) => {
    const token = getState().userInfo.userInfo.userInfo.token;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(`/api/orders/${id}`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const orderInfoSlice = createSlice({
  name: 'orderInfo',
  initialState: { orderInfo: {} },
  extraReducers: {
    // Creating New Order => saving order ID
    [createNewOrder.pending]: (state, action) => {
      state.orderInfo = {
        loading: true,
      };
    },
    [createNewOrder.fulfilled]: (state, action) => {
      state.orderInfo = {
        orderId: action.payload,
      };
    },
    [createNewOrder.rejected]: (state, action) => {
      state.orderInfo = {
        error: action.payload,
      };
    },

    // Get Order Details
    [getOrderDetails.pending]: (state, action) => {
      state.orderInfo = {
        loading: true,
      };
    },
    [getOrderDetails.fulfilled]: (state, action) => {
      state.orderInfo = {
        orderInfo: action.payload,
      };
    },
    [getOrderDetails.rejected]: (state, action) => {
      state.orderInfo = {
        error: action.payload,
      };
    },
  },
});

export default orderInfoSlice.reducer;
