import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getMyOrders = createAsyncThunk(
  'getMyOrders/getMyOrders',
  async (_, { rejectWithValue, getState }) => {
    const token = getState().userInfo.userInfo.userInfo.token;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get('/api/orders/myorders', config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const getMyOrdersSlice = createSlice({
  name: 'getMyOrders',
  initialState: { myOrders: {} },
  reducers: {
    resetMyOrders(state) {
      state.myOrders = {};
    },
  },
  extraReducers: {
    [getMyOrders.pending]: (state, action) => {
      state.myOrders = {
        loading: true,
      };
    },
    [getMyOrders.fulfilled]: (state, action) => {
      state.myOrders = {
        myOrders: action.payload,
      };
    },
    [getMyOrders.rejected]: (state, action) => {
      state.myOrders = {
        error: action.payload,
      };
    },
  },
});

export const { resetMyOrders } = getMyOrdersSlice.actions;

export default getMyOrdersSlice.reducer;
