import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createProduct = createAsyncThunk(
  'productDetailsAdmin/createProduct',
  async (_, { rejectWithValue, getState }) => {
    const token = getState().userInfo.userInfo.userInfo.token;
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(`/api/products`, {}, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'productDetailsAdmin/updateProduct',
  async (arg, { rejectWithValue, getState }) => {
    const { id, updatedProduct } = arg;
    const token = getState().userInfo.userInfo.userInfo.token;
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `/api/products/${id}`,
        updatedProduct,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const productDetailsAdminSlice = createSlice({
  name: 'productDetailsAdmin',
  initialState: { productDetailsAdmin: {} },
  reducers: {
    resetProductDetailsAdmin(state) {
      state.productDetailsAdmin = {};
    },
  },
  extraReducers: {
    // Create Product
    [createProduct.pending]: (state, action) => {
      state.productDetailsAdmin = {
        loading: true,
      };
    },
    [createProduct.fulfilled]: (state, action) => {
      if (state.productDetailsAdmin.success) {
        state.productDetailsAdmin = {
          success: true,
          productDetailsAdmin: action.payload,
        };
      } else {
        state.productDetailsAdmin = {
          productDetailsAdmin: action.payload,
        };
      }
    },
    [createProduct.rejected]: (state, action) => {
      state.productDetailsAdmin = {
        error: action.payload,
      };
    },

    // Update Product
    [updateProduct.pending]: (state, action) => {
      state.productDetailsAdmin = {
        loading: true,
      };
    },
    [updateProduct.fulfilled]: (state, action) => {
      state.productDetailsAdmin = {
        success: true,
        productDetailsAdmin: action.payload,
      };
    },
    [updateProduct.rejected]: (state, action) => {
      state.productDetailsAdmin = {
        error: action.payload,
      };
    },
  },
});

export const { resetProductDetailsAdmin } = productDetailsAdminSlice.actions;

export default productDetailsAdminSlice.reducer;
