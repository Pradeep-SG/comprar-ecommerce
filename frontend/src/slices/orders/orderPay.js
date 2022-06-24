import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const updateOrderPay = createAsyncThunk(
  'updateOrderPay/updateOrderPay',
  async (arg, { rejectWithValue, getState }) => {
    const { orderId, paymentResult } = arg;
    const token = getState().userInfo.userInfo.userInfo.token;
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `/api/orders/${orderId}/pay`,
        paymentResult,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const updateOrderPaySlice = createSlice({
  name: 'updateOrderPay',
  initialState: { updateOrderPay: {} },
  reducers: {
    orderPayReset(state, action) {
      state.updateOrderPay = {};
    },
  },
  extraReducers: {
    [updateOrderPay.pending]: (state, action) => {
      state.updateOrderPay = {
        loading: true,
      };
    },
    [updateOrderPay.fulfilled]: (state, action) => {
      state.updateOrderPay = {
        success: true,
      };
    },
    [updateOrderPay.rejected]: (state, action) => {
      state.updateOrderPay = {
        error: action.payload,
      };
    },
  },
});

export const { orderPayReset } = updateOrderPaySlice.actions;

export default updateOrderPaySlice.reducer;
