import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Modal from '../components/Modal';
import classes from '../modules/CartScreen.module.scss';
import { fetchCartProduct, deleteItem } from '../slices/carts/cartDetails';

const CartScreen = () => {
  const [show, setShow] = useState(false);
  const [modalText, setModalText] = useState('');

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [show]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.cartDetails.cartDetails);

  const decrementHandler = (id, quantity) => {
    quantity--;
    if (quantity > 0) {
      dispatch(fetchCartProduct({ id, quantity }));
    } else if (quantity === 0) {
      dispatch(deleteItem(id));
    }
  };

  const incrementHandler = (id, quantity, stock) => {
    quantity++;
    if (quantity === 6) {
      setModalText(
        'You cannot add more than five products of same. Try placing multiple orders. Sorry for the inconvenience'
      );
      setShow(true);
      return;
    }
    if (quantity <= stock) {
      dispatch(fetchCartProduct({ id, quantity }));
    } else if (quantity === stock + 1) {
      setModalText(
        'There are only limited stock(s) for this product and the product might be out of stock right now. Please try again after some time'
      );
      setShow(true);
    }
  };

  const deleteHandler = (id) => {
    dispatch(deleteItem(id));
  };

  return (
    <>
      {show && (
        <Modal show={show} showHandler={(val) => setShow(val)}>
          {modalText}
        </Modal>
      )}
      {!products || !products.length ? (
        <h3>Cart is empty</h3>
      ) : (
        <div className={classes['outer-div']}>
          <div className={classes['cart-details']}>
            <h3 className="text-upper">Cart</h3>
            {products.map((product) => (
              <div key={product.product} className={classes['cart-row']}>
                <img
                  className={classes['cart-image']}
                  src={product.image}
                  alt={product.title}
                  onClick={() => navigate(`/product/${product.product}`)}
                />
                <p
                  className={classes.title}
                  onClick={() => navigate(`/product/${product.product}`)}
                >
                  {product.title}
                </p>
                <p className={classes.price}>$ {product.price.toFixed(2)}</p>
                <div className={classes.buttons}>
                  <button
                    onClick={() =>
                      decrementHandler(product.product, product.quantity)
                    }
                  >
                    -
                  </button>
                  <p className={classes.quantity}>{product.quantity}</p>
                  <button
                    onClick={() =>
                      incrementHandler(
                        product.product,
                        product.quantity,
                        product.stock
                      )
                    }
                  >
                    +
                  </button>
                  <div
                    className={classes.delete}
                    onClick={() => deleteHandler(product.product)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </div>
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
                <h3>
                  {'$ ' +
                    products
                      .reduce(
                        (prev, curr) => prev + curr.price * curr.quantity,
                        0
                      )
                      .toFixed(2)}
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

export default CartScreen;
