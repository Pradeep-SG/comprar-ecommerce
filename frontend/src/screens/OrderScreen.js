import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import classes from '../modules/CartScreen.module.scss';
import { getOrderDetails } from '../slices/orders/orderInfo';
import { PayPalButton } from 'react-paypal-button-v2';
import Message from '../components/Message';
import axios from 'axios';
import { orderPayReset, updateOrderPay } from '../slices/orders/orderPay';
import {
  resetOrderDeliver,
  updateOrderDeliver,
} from '../slices/orders/orderDeliver';
import Loader from '../components/Loader';
import Meta from '../components/Meta';

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const successPaymentHandler = (paymentResult) => {
    dispatch(updateOrderPay({ orderId: orderInfo._id, paymentResult }));
  };

  const deliverHandler = (orderId) => {
    dispatch(updateOrderDeliver(orderId));
  };

  return (
    <>
      {error ? (
        <Message variant="danger">
          {error.message ? error.message : 'Unknown error occurred'}
        </Message>
      ) : !orderInfo || !userInfo ? (
        <Loader />
      ) : (
        <div className={classes['outer-div']}>
          <Meta title={`Comprar | Order-${orderInfo._id}`} />
          <div className={classes['cart-details']}>
            <div className="bb pb-4">
              <h3 className="text-upper my-2">Order Details</h3>
              <div className={classes['order-by']}>
                <p className="fw-regular text-captal">
                  <span>Ordered By : </span>
                  <span className={`fw-bold ${classes['order-indent']}`}>
                    {orderInfo.user.name} -{' '}
                  </span>
                  <a
                    className={`fw-bold text-lower ${classes['order-indent']}`}
                    href={`mailto:${orderInfo.user.email}`}
                  >
                    {orderInfo.user.email}
                  </a>
                </p>
              </div>
              <p className={`fw-regular ${classes['ref-num']}`}>
                <span>Reference Number :</span>
                <span className="text-upper fw-bold">{id}</span>
              </p>
            </div>
            <div className="bb pb-4">
              <h3 className="text-upper my-2">Shipping Details</h3>
              <p className={`fw-regular ${classes['address']}`}>
                {orderInfo.shippingAddress && (
                  <>
                    <span>{orderInfo.shippingAddress.name}, </span>
                    <span>{orderInfo.shippingAddress.houseNum}, </span>
                    <span>{orderInfo.shippingAddress.area}, </span>
                    <span>{orderInfo.shippingAddress.city}, </span>
                    <span>{orderInfo.shippingAddress.postalCode}</span>
                  </>
                )}
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
              <div key={product.product} className={classes['cart-row']}>
                <img
                  className={`${classes['cart-image']} ${classes['not-link']}`}
                  src={product.image}
                  alt=""
                />
                <p className={`${classes.title} ${classes['not-link']}`}>
                  {product.title}
                </p>
                <div className={classes['price-calc']}>
                  <p className="">
                    {product.quantity} <span className="">x</span> ${' '}
                    {product.price.toFixed(2)}
                  </p>
                  <span className="">=</span>
                  <p className="">
                    $ {(product.quantity * product.price).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className={classes['price-details']}>
            <div className={classes.details}>
              <div className={classes['order-summary']}>
                <h2>Order Summary</h2>
              </div>
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
                    <Loader />
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
