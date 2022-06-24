import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import classes from '../modules/CartScreen.module.scss';
import CheckoutSteps from '../components/CheckoutSteps';
import { createNewOrder, getOrderDetails } from '../slices/orders/orderInfo';
import { PayPalButton } from 'react-paypal-button-v2';
import Message from '../components/Message';
import axios from 'axios';
import { orderPayReset, updateOrderPay } from '../slices/orders/orderPay';
import {
  resetOrderDeliver,
  updateOrderDeliver,
} from '../slices/orders/orderDeliver';
import { resetCart } from '../slices/carts/cartDetails';

const OrderScreen = () => {
  const { id } = useParams();

  const [sdkReady, setSdkReady] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { orderInfo, error } = useSelector(
    (state) => state.orderInfo.orderInfo
  );

  const { userInfo } = useSelector((state) => state.userInfo.userInfo);

  const { success: successPay } = useSelector(
    (state) => state.updateOrderPay.updateOrderPay
  );

  const { success: successDeliver } = useSelector(
    (state) => state.updateOrderDeliver.updateOrderDeliver
  );

  useEffect(() => {
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };
    if (!userInfo) {
      navigate('/signin');
    } else if (!orderInfo || successPay || successDeliver) {
      dispatch(orderPayReset());
      dispatch(resetOrderDeliver());
      dispatch(getOrderDetails(id));
      dispatch(resetCart());
    } else if (!orderInfo.isPaid) {
      if (!window.paypal) addPayPalScript();
      else setSdkReady(true);
    }
  }, [userInfo, navigate, id, dispatch, orderInfo, successPay, successDeliver]);

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin');
    } else {
      dispatch(orderPayReset());
      dispatch(getOrderDetails(id));
    }
  }, []);

  const successPaymentHandler = (paymentResult) => {
    dispatch(updateOrderPay({ orderId: orderInfo._id, paymentResult }));
  };

  const deliverHandler = (orderId) => {
    dispatch(updateOrderDeliver(orderId));
  };

  return (
    <>
      {error ? (
        <h3>{error.message ? error.message : 'Error 404'}</h3>
      ) : !orderInfo || !userInfo ? (
        <h3>Loading...</h3>
      ) : (
        <div className={classes.outerdiv}>
          <div className={classes.cartDetails}>
            <div className="bb pb-4">
              <h3 className="text-upper my-2">Order Details</h3>
              <p className="fw-regular text-captal">
                Ordered By :{' '}
                <span className="mx-2 fw-bold">
                  {orderInfo.user.name} -{' '}
                  <a
                    className="mx-2 text-lower"
                    href={`mailto:${orderInfo.user.email}`}
                  >
                    {orderInfo.user.email}
                  </a>
                </span>
              </p>
              <p className="fw-regular">
                Reference Number :
                <span className="text-upper mx-2 fw-bold">{id}</span>
              </p>
            </div>
            <div className="bb pb-4">
              <h3 className="text-upper my-2">Shipping Details</h3>
              <p className="fw-regular">
                {orderInfo.shippingAddress &&
                  `${orderInfo.shippingAddress.name}, ${orderInfo.shippingAddress.houseNum}, ${orderInfo.shippingAddress.area}, ${orderInfo.shippingAddress.city} - ${orderInfo.shippingAddress.postalCode} `}
              </p>
              <p className="fw-regular">{`${orderInfo.shippingAddress.state}, ${orderInfo.shippingAddress.country}`}</p>
              {orderInfo.isDelivered ? (
                <Message variant="success">
                  Delivered at {orderInfo.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </div>
            <div className="bb pb-4">
              <h3 className="text-upper my-2">Payment Details</h3>
              <p className="fw-regular text-capital">
                Payment Method:{' '}
                <span className="mx-2">{orderInfo.paymentMethod}</span>
              </p>
              {orderInfo.isPaid ? (
                <Message variant="success">Paid at {orderInfo.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </div>
            {orderInfo.products.map((product) => (
              <div key={product.product} className={classes.cartRow}>
                <img
                  className={`${classes.cartImage} ${classes['not-link']}`}
                  src={product.image}
                  alt=""
                />
                <p className={`${classes.title} ${classes['not-link']}`}>
                  {product.title}
                </p>
                <p className="mx-2 w-20p">
                  {product.quantity} <span className="mx-2">x</span> ${' '}
                  {product.price.toFixed(2)}
                </p>
                <span className="mx-2">=</span>
                <p className="mx-2">
                  $ {(product.quantity * product.price).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className={classes.priceDetails}>
            <div className={classes.details}>
              <div className={classes['order-summary']}>Order Summary</div>
              <div>
                <h3 className={classes.priceHead}>Total </h3>
                <h3>
                  {orderInfo.products.reduce(
                    (prev, curr) => prev + curr.quantity,
                    0
                  )}{' '}
                  Items
                </h3>
              </div>
              <div>
                <h3 className={classes.priceHead}>Item(s) Price </h3>
                <h3>{'$ ' + orderInfo.itemsPrice.toFixed(2)}</h3>
              </div>
              <div>
                <h3 className={classes.priceHead}>Shipping Price </h3>
                <h3>{'$ ' + orderInfo.shippingPrice.toFixed(2)}</h3>
              </div>
              <div
                className={
                  (!orderInfo.isPaid && orderInfo.user._id === userInfo._id) ||
                  (orderInfo.isPaid &&
                    userInfo.isAdmin &&
                    !orderInfo.isDelivered)
                    ? ''
                    : classes['last-child']
                }
              >
                <h3 className={classes.priceHead}>Total Price </h3>
                <h3>{'$ ' + orderInfo.totalPrice.toFixed(2)}</h3>
              </div>
              {!orderInfo.isPaid && orderInfo.user._id === userInfo._id && (
                <div className={classes.paypal}>
                  {!sdkReady ? (
                    <h3> Loading... </h3>
                  ) : (
                    <PayPalButton
                      amount={orderInfo.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </div>
              )}
              {orderInfo.isPaid &&
                userInfo.isAdmin &&
                !orderInfo.isDelivered && (
                  <button onClick={() => deliverHandler(orderInfo._id)}>
                    Mark as delivered
                  </button>
                )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderScreen;
