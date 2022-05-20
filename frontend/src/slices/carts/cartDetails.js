import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCartProduct = createAsyncThunk(
  'cartDetailSlice/fetchCartProduct',
  async (props, { rejectWithValue }) => {
    const { id, quantity } = props;
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      return {
        product: data._id,
        title: data.title,
        image: data.image,
        price: data.price,
        stock: data.stock,
        quantity,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = localStorage.getItem('cartDetails')
  ? JSON.parse(localStorage.getItem('cartDetails'))
  : { cartDetails: {} };

const cartDetailSlice = createSlice({
  name: 'cartDetail',
  initialState,
  reducers: {
    deleteItem(state, action) {
      const tempArr = state.cartDetails.products.filter(
        (p) => p.product !== action.payload
      );
      state.cartDetails = {
        products: [...tempArr],
      };
      localStorage.setItem('cartDetails', JSON.stringify(state));
    },
  },
  extraReducers: {
    [fetchCartProduct.pending]: (state, action) => {
      state.cartDetails = {
        ...state.cartDetails,
        loading: true,
      };
    },
    [fetchCartProduct.fulfilled]: (state, action) => {
      const currentState = state.cartDetails.products
        ? state.cartDetails.products
        : [];

      const existItem = currentState.find(
        (p) => p.product === action.payload.product
      );

      if (existItem) {
        const updatedState = currentState.map((p) =>
          p.product === action.payload.product ? action.payload : p
        );
        state.cartDetails = {
          products: [...updatedState],
        };
      } else {
        state.cartDetails = {
          products: [...currentState, action.payload],
        };
      }

      localStorage.setItem('cartDetails', JSON.stringify(state));
    },
    [fetchCartProduct.rejected]: (state, action) => {
      state.cartDetails = {
        ...state.cartDetails,
        error: action.payload,
      };
    },
  },
});

export const { deleteItem } = cartDetailSlice.actions;

export default cartDetailSlice.reducer;
