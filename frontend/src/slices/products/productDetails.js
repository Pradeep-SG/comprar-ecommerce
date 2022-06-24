import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProductDetails = createAsyncThunk(
  'productDetails/fetchProductDetails',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const productDetailsSlice = createSlice({
  name: 'productDetails',
  initialState: { productDetails: {} },
  reducers: {
    resetProductDetails(state) {
      state.productDetails = {};
    },
  },
  extraReducers: {
    [fetchProductDetails.pending]: (state) => {
      state.productDetails = { loading: true };
    },
    [fetchProductDetails.fulfilled]: (state, action) => {
      state.productDetails = {
        product: { ...action.payload },
      };
    },
    [fetchProductDetails.rejected]: (state, action) => {
      state.productDetails = {
        error: { ...action.payload },
      };
    },
  },
});

export const { resetProductDetails } = productDetailsSlice.actions;

export default productDetailsSlice.reducer;
