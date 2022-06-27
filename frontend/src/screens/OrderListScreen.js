import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classes from '../modules/UsersListScreen.module.scss';
import { resetProductDetailsAdmin } from '../slices/products/productDetailsAdmin';
import { getAllOrders } from '../slices/orders/allOrders';
import Loader from '../components/Loader';
import Meta from '../components/Meta';

const OrderListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.userInfo.userInfo);

  const { loading: myOrdersLoading, allOrders: myOrders } = useSelector(
    (state) => state.allOrders.allOrders
  );

  useEffect(() => {
    dispatch(resetProductDetailsAdmin());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    <div className={`${classes['user-details']} ${classes['product-details']}`}>
      <Meta title="Comprar | Admin | Orders" />
      <div className={`${classes['create-product-div']}`}>
        <h2>Orders</h2>
      </div>
      {myOrdersLoading ? (
        <Loader />
      ) : (
        <>
          {myOrders && myOrders.length ? (
            <div className={classes['table-div']}>
              <div className={`${classes['table-list']}`}>
                <div
                  className={`${classes['body-row']} ${classes['table-list-head']}`}
                >
                  <p className={classes['body-id']}>Id</p>
                  <p className={classes['body-title']}>Ordered By</p>
                  <p className={`text-upper ${classes['head-date']}`}>Date</p>
                  <p className={`text-upper ${classes['head-date']}`}>Price</p>
                  <p className={`text-upper ${classes['head-date']}`}>Paid</p>
                  <p className={`text-upper ${classes['head-date']}`}>
                    Delivered
                  </p>
                  <button className={`${classes['hide-buttons']}`}>
                    Details
                  </button>
                </div>
                {myOrders.map((order) => (
                  <div
                    key={order._id}
                    className={`${classes['body-row']} ${classes['body-row-sub']}`}
                  >
                    <p className={classes['body-id']}>{order._id}</p>
                    <p className={classes['body-title']}>
                      {order.user && order.user.name}
                    </p>
                    <p className={classes.date}>
                      {order.createdAt.slice(0, 10)}
                    </p>
                    <p className={classes.date}>
                      {'$ ' + order.totalPrice.toFixed(2)}
                    </p>
                    <p className={classes.date}>
                      {order.isPaid && order.paidAt ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                    <p className={classes.date}>
                      {order.isDelivered && order.deliveredAt ? (
                        order.deliveredAt.substring(0, 10)
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                    <button
                      className={`${classes['order-details-link']}`}
                      onClick={() => navigate(`/order/${order._id}`)}
                    >
                      Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            'No orders Placed'
          )}
        </>
      )}
    </div>
  );
};
export default OrderListScreen;
