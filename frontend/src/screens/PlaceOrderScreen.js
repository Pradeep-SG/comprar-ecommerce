import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import classes from '../modules/CartScreen.module.scss';
import CheckoutSteps from '../components/CheckoutSteps';
import { createNewOrder } from '../slices/orders/orderInfo';
import { resetCart } from '../slices/carts/cartDetails';
import Loader from '../components/Loader';
import Meta from '../components/Meta';

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

  const { orderId } = useSelector((state) => state.orderInfo.orderInfo);

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin');
    } else if (orderId) {
      dispatch(resetCart());
      navigate(`/order/${orderId._id}`);
    } else if (!addr) {
      navigate('/shipping');
    } else if (!paymentMethod) {
      navigate('/payment');
    } else if (!products || !products.length) {
      navigate('/cart');
    }
  }, [userInfo, navigate, addr, products, orderId, paymentMethod, dispatch]);

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
      <Meta title={`Shippr | Place order`} />
      <CheckoutSteps step2 step3 />
      {!products || !addr ? (
        <Loader />
      ) : (
        <div className={classes['outer-div']}>
          <div className={classes['cart-details']}>
            <div className="bb pb-4">
              <h3 className="text-upper my-2">Shipping Details</h3>
              <p className={`fw-regular ${classes['address']}`}>
                {addr && (
                  <>
                    <span>{addr.name}, </span>
                    <span>{addr.houseNum}, </span>
                    <span>{addr.area}, </span>
                    <span>{addr.city}, </span>
                    <span>{addr.postalCode}</span>
                  </>
                )}
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
