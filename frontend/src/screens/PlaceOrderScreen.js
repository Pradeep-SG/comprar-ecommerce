import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import classes from '../modules/CartScreen.module.scss';
import CheckoutSteps from '../components/CheckoutSteps';
import { createNewOrder } from '../slices/orders/orderInfo';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    shippingAddress: addr,
    products,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = useSelector((state) => state.cartDetails.cartDetails);

  const { userInfo } = useSelector((state) => state.userInfo.userInfo);

  const { orderId, error } = useSelector((state) => state.orderInfo.orderInfo);

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin');
    } else if (!addr) {
      navigate('/shipping');
    } else if (!paymentMethod) {
      navigate('/payment');
    } else if (!products || !products.length) {
      navigate('/cart');
    } else if (orderId) {
      navigate(`/order/${orderId._id}`);
    }
  }, [userInfo, navigate, addr, products, orderId]);

  const placeOrder = () => {
    dispatch(
      createNewOrder({
        products,
        shippingAddress: addr,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
      })
    );
  };

  return (
    <>
      <CheckoutSteps step2 step3 />
      {!products || !addr ? (
        <h3>Loading...</h3>
      ) : (
        <div className={classes.outerdiv}>
          <div className={classes.cartDetails}>
            <div className="bb pb-4">
              <h3 className="text-upper my-2">Shipping Details</h3>
              <p className="fw-regular">
                {addr &&
                  `${addr.name}, ${addr.houseNum}, ${addr.area}, ${addr.city} - ${addr.postalCode} `}
              </p>
              <p className="fw-regular">{`${addr.state}, ${addr.country}`}</p>
            </div>
            <div className="bb pb-4">
              <h3 className="text-upper my-2">Payment Details</h3>
              <p className="fw-regular text-capital">
                Payment Method: <span className="mx-2">{paymentMethod}</span>
              </p>
            </div>
            {products.map((product) => (
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
              <div>
                <h3 className={classes.priceHead}>Total </h3>
                <h3>
                  {products.reduce((prev, curr) => prev + curr.quantity, 0)}{' '}
                  Items
                </h3>
              </div>
              <div>
                <h3 className={classes.priceHead}>Item(s) Price </h3>
                <h3>{'$ ' + itemsPrice}</h3>
              </div>
              <div>
                <h3 className={classes.priceHead}>Shipping Price </h3>
                <h3>{'$ ' + shippingPrice}</h3>
              </div>
              <div>
                <h3 className={classes.priceHead}>Total Price </h3>
                <h3>{'$ ' + totalPrice}</h3>
              </div>
            </div>
            <div className={classes.place} onClick={placeOrder}>
              <button>Place an order</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaceOrderScreen;
