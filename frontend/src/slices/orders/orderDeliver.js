import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const updateOrderDeliver = createAsyncThunk(
  'updateOrderDeliver/updateOrderDeliver',
  async (orderId, { rejectWithValue, getState }) => {
    const token = getState().userInfo.userInfo.userInfo.token;
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `/api/orders/${orderId}/deliver`,
        {},
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const updateOrderDeliverSlice = createSlice({
  name: 'updateOrderDeliver',
  initialState: { updateOrderDeliver: {} },
  reducers: {
    resetOrderDeliver(state, action) {
      state.updateOrderDeliver = {};
    },
  },
  extraReducers: {
    [updateOrderDeliver.pending]: (state, action) => {
      state.updateOrderDeliver = {
        loading: true,
      };
    },
    [updateOrderDeliver.fulfilled]: (state, action) => {
      state.updateOrderDeliver = {
        success: true,
      };
    },
    [updateOrderDeliver.rejected]: (state, action) => {
      state.updateOrderDeliver = {
        error: action.Deliverload,
      };
    },
  },
});

export const { resetOrderDeliver } = updateOrderDeliverSlice.actions;

export default updateOrderDeliverSlice.reducer;
