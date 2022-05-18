import { configureStore } from '@reduxjs/toolkit';
import productListReducer from './slices/products/productList';
import productDetailsReducer from './slices/products/productDetails';
import cartDetails from './slices/carts/cartDetails';

const store = configureStore({
  reducer: {
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cartDetails: cartDetails,
  },
});

export default store;
