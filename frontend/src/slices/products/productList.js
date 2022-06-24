import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProductList = createAsyncThunk(
  'productList/fetchProductList',
  async (arg, { rejectWithValue }) => {
    const { searchQuery, page } = arg;
    const search = searchQuery ? searchQuery : '';
    const pageNum = page ? page : '1';
    try {
      const { data } = await axios.get(
        `/api/products?search=${search}&page=${pageNum}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteProductById = createAsyncThunk(
  'productList/deleteProductById',
  async (id, { rejectWithValue, getState }) => {
    const token = getState().userInfo.userInfo.userInfo.token;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.delete(`/api/products/${id}`, config);
      return data;
    } catch (error) {
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
        products: [...action.payload.products],
        totalPageCount: action.payload.totalPages,
      };
    },
    [fetchProductList.rejected]: (state, action) => {
      state.productList = {
        error: action.payload,
      };
    },

    // Delete prodyct By Id
    [deleteProductById.pending]: (state, action) => {
      state.productList = {
        deleteProductLoading: true,
      };
    },
    [deleteProductById.fulfilled]: (state, action) => {
      state.productList = {
        deleteProductSuccess: true,
      };
    },
    [deleteProductById.rejected]: (state, action) => {
      state.productList = {
        deleteProductError: action.payload,
      };
    },
  },
});

export default productListSlice.reducer;
