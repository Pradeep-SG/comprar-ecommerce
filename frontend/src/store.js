import { configureStore } from '@reduxjs/toolkit';
import productListReducer from './slices/products/productList';
import productDetailsReducer from './slices/products/productDetails';

const store = configureStore({
  reducer: {
    productList: productListReducer,
    productDetails: productDetailsReducer,
  },
});

export default store;
