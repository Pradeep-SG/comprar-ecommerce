import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import profileClasses from '../modules/ProfileScreen.module.scss';
import {
  createProduct,
  resetProductDetailsAdmin,
} from '../slices/products/productDetailsAdmin';
import { getAllOrders } from '../slices/orders/allOrders';

const OrderListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.userInfo.userInfo);

  const { loading: myOrdersLoading, allOrders: myOrders } = useSelector(
    (state) => state.allOrders.allOrders
  );

  useEffect(() => {
    dispatch(resetProductDetailsAdmin());
  }, []);

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin');
    } else if (!userInfo.isAdmin) {
      navigate('/');
    } else {
      dispatch(getAllOrders());
    }
  }, [userInfo, navigate, dispatch]);

  return (
    <div
      className={`${profileClasses['order-details']} ${profileClasses['all-orders']}`}
    >
      <h2>My orders</h2>
      {myOrdersLoading ? (
        <h3>Loading...</h3>
      ) : (
        <>
          {myOrders && myOrders.length ? (
            <>
              <div className={profileClasses['order-row']}>
                <p className={profileClasses['order-id']}>Id</p>
                <p>Ordered By</p>
                <p>Date</p>
                <p>Price</p>
                <p>Paid</p>
                <p>Delivered</p>
                <button>Details</button>
              </div>
              {myOrders.map((order) => (
                <div key={order._id} className={profileClasses['order-row']}>
                  <p className={profileClasses['order-id']}>{order._id}</p>
                  <p>{order.user && order.user.name}</p>
                  <p>{order.createdAt.slice(0, 10)}</p>
                  <p>{'$ ' + order.totalPrice.toFixed(2)}</p>
                  <p className={profileClasses.paid}>
                    {order.isPaid && order.paidAt ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <i className="fa-solid fa-xmark"></i>
                    )}
                  </p>
                  <p className={profileClasses.delivered}>
                    {order.isDelivered && order.deliveredAt ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <i className="fa-solid fa-xmark"></i>
                    )}
                  </p>
                  <button
                    className={`${profileClasses.button}`}
                    onClick={() => navigate(`/order/${order._id}`)}
                  >
                    Details
                  </button>
                </div>
              ))}
            </>
          ) : (
            'No orders Placed'
          )}
        </>
      )}
    </div>
  );
};
export default OrderListScreen;
