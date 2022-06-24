import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTopProductList = createAsyncThunk(
  'topProductList/fetchTopProductList',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/products/top`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const topProductListSlice = createSlice({
  name: 'topProductList',
  initialState: { topProductList: {} },
  extraReducers: {
    [fetchTopProductList.pending]: (state) => {
      state.topProductList = {
        loading: true,
      };
    },
    [fetchTopProductList.fulfilled]: (state, action) => {
      state.topProductList = {
        topProducts: [...action.payload],
      };
    },
    [fetchTopProductList.rejected]: (state, action) => {
      state.topProductList = {
        error: action.payload,
      };
    },
  },
});

export default topProductListSlice.reducer;
