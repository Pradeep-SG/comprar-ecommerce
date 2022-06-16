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
      setModalText("Can't add more than 5 items");
      setShow(true);
      return;
    }
    if (quantity <= stock) {
      dispatch(fetchCartProduct({ id, quantity }));
    } else if (quantity === stock + 1) {
      setModalText('Out of stock');
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
        <div className={classes.outerdiv}>
          <div className={classes.cartDetails}>
            {products.map((product) => (
              <div key={product.product} className={classes.cartRow}>
                <img
                  className={classes.cartImage}
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
          <div className={classes.priceDetails}>
            <div className={classes.details}>
              <div className={classes.priceHead}>
                <h3>Total </h3>
                <h3>Price </h3>
              </div>
              <div>
                <h3>
                  {products.reduce((prev, curr) => prev + curr.quantity, 0)}{' '}
                  Items
                </h3>
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
