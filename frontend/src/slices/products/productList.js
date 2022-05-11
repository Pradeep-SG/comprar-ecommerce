import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProductList = createAsyncThunk(
  'productList/fetchProductList',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/products');
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

const productListSlice = createSlice({
  name: 'productList',
  initialState: { productList: {} },
  extraReducers: {
    [fetchProductList.pending]: (state) => {
      state.productList = {
        loading: true,
      };
    },
    [fetchProductList.fulfilled]: (state, action) => {
      state.productList = {
        products: [...action.payload],
      };
    },
    [fetchProductList.rejected]: (state, action) => {
      state.productList = {
        error: action.payload,
      };
    },
  },
});

export default productListSlice.reducer;
