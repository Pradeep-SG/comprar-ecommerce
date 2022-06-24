import { configureStore } from '@reduxjs/toolkit';
import productListReducer from './slices/products/productList';
import productDetailsReducer from './slices/products/productDetails';
import cartDetailsReducer from './slices/carts/cartDetails';
import userInfoReducer from './slices/users/userInfo';
import orderInfoReducer from './slices/orders/orderInfo';
import updateOrderPayReducer from './slices/orders/orderPay';
import updateOrderDeliverReducer from './slices/orders/orderDeliver';
import getMyOrdersReducer from './slices/orders/myOrders';
import usersListReducer from './slices/users/usersList';
import userInfoAdminReducer from './slices/users/userInfoAdmin';
import productDetailsAdminReducer from './slices/products/productDetailsAdmin';
import allOrdersReducer from './slices/orders/allOrders';
import reviewInfoReducer from './slices/products/reviewInfo';
import topProductListReducer from './slices/products/topProducts';

const store = configureStore({
  reducer: {
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cartDetails: cartDetailsReducer,
    userInfo: userInfoReducer,
    orderInfo: orderInfoReducer,
    updateOrderPay: updateOrderPayReducer,
    updateOrderDeliver: updateOrderDeliverReducer,
    getMyOrders: getMyOrdersReducer,
    usersList: usersListReducer,
    userInfoAdmin: userInfoAdminReducer,
    productDetailsAdmin: productDetailsAdminReducer,
    allOrders: allOrdersReducer,
    reviewInfo: reviewInfoReducer,
    topProductList: topProductListReducer,
  },
});

export default store;
