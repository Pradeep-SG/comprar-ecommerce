import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Modal from '../components/Modal';
import classes from '../modules/CartScreen.module.scss';
import { fetchCartProduct, deleteItem } from '../slices/carts/cartDetails';
import CheckoutSteps from '../components/CheckoutSteps';

const OrderScreen = () => {
  const [show, setShow] = useState(false);
  const [modalText, setModalText] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    shippingAddress: addr,
    products,
    paymentMethod,
  } = useSelector((state) => state.cartDetails.cartDetails);

  const { userInfo } = useSelector((state) => state.userInfo.userInfo);

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin');
    } else if (!addr) {
      navigate('/shipping');
    } else if (!paymentMethod) {
      navigate('/payment');
    } else if (!products || !products.length) {
      navigate('/cart');
    }
  }, [userInfo, navigate, addr, products]);

  const itemCost = () => {
    return products
      .reduce((prev, curr) => prev + curr.price * curr.quantity, 0)
      .toFixed(2);
  };

  const shippingCost = () => {
    const cost = Number(itemCost());
    if (cost < 100) return 50;
    else return 0;
  };

  return (
    <>
      <CheckoutSteps step2 step3 />
      {!products ? (
        <h3>Cart is empty</h3>
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
              <div className={classes.priceHead}>
                <h3>Total </h3>
                <h3>Item(s) Price </h3>
                <h3>Shipping Price</h3>
                <h3>Total Price</h3>
              </div>
              <div>
                <h3>
                  {products.reduce((prev, curr) => prev + curr.quantity, 0)}{' '}
                  Items
                </h3>
                <h3>{'$ ' + itemCost()}</h3>
                <h3>{'$ ' + shippingCost().toFixed(2)}</h3>
                <h3>
                  {'$ ' +
                    (Number(shippingCost()) + Number(itemCost())).toFixed(2)}
                </h3>
              </div>
            </div>
            <div
              className={classes.place}
              onClick={() => navigate('/signin?redirect=shipping')}
            >
              <button>Place an order</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderScreen;
