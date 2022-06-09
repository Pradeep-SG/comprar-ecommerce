import { configureStore } from '@reduxjs/toolkit';
import productListReducer from './slices/products/productList';
import productDetailsReducer from './slices/products/productDetails';
import cartDetailsReducer from './slices/carts/cartDetails';
import userInfoReducer from './slices/users/userInfo';

const store = configureStore({
  reducer: {
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cartDetails: cartDetailsReducer,
    userInfo: userInfoReducer,
  },
});

export default store;
