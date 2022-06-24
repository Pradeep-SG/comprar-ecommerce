import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCartProduct = createAsyncThunk(
  'cartDetailSlice/fetchCartProduct',
  async (arg, { rejectWithValue }) => {
    const { id, quantity } = arg;
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
        ...state.cartDetails,
        products: [...tempArr],
      };
      localStorage.setItem('cartDetails', JSON.stringify(state));
    },
    saveShippingAddress(state, action) {
      state.cartDetails = {
        ...state.cartDetails,
        shippingAddress: action.payload,
      };
      localStorage.setItem('cartDetails', JSON.stringify(state));
    },
    savePriceDetails(state, action) {
      state.cartDetails = {
        ...state.cartDetails,
        itemsPrice: action.payload.itemsPrice,
        shippingPrice: action.payload.shippingPrice,
        totalPrice: action.payload.totalPrice,
      };
      localStorage.setItem('cartDetails', JSON.stringify(state));
    },
    savePaymentMethod(state, action) {
      state.cartDetails = {
        ...state.cartDetails,
        paymentMethod: action.payload,
      };
      localStorage.setItem('cartDetails', JSON.stringify(state));
    },
    deleteShippingAndPayment(state, action) {
      if (state.cartDetails.products) {
        state.cartDetails = {
          products: [...state.cartDetails.products],
        };
      }
      localStorage.setItem('cartDetails', JSON.stringify(state));
    },
    resetCart(state, action) {
      localStorage.removeItem('cartDetails');
      state.cartDetails = {};
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
          ...state.cartDetails,
          loading: false,
          products: [...updatedState],
        };
      } else {
        state.cartDetails = {
          ...state.cartDetails,
          loading: false,
          products: [...currentState, action.payload],
        };
      }

      localStorage.setItem('cartDetails', JSON.stringify(state));
    },
    [fetchCartProduct.rejected]: (state, action) => {
      console.log(action.payload);
      state.cartDetails = {
        ...state.cartDetails,
        error: action.payload,
      };
    },
  },
});

export const {
  deleteItem,
  saveShippingAddress,
  savePriceDetails,
  savePaymentMethod,
  deleteShippingAndPayment,
  resetCart,
} = cartDetailSlice.actions;

export default cartDetailSlice.reducer;
