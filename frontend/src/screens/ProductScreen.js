import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Rating from '../components/Rating';
import classes from '../modules/ProductScreen.module.css';
import { fetchProductDetails } from '../slices/products/productDetails';
import { fetchCartProduct } from '../slices/carts/cartDetails';

const ProductScreen = ({ history }) => {
  const [quantity, setQuantity] = useState(1);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, product, error } = useSelector(
    (state) => state.productDetails.productDetails
  );

  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch]);

  const addToCartHandler = () => {
    dispatch(fetchCartProduct({ id, quantity }));
    navigate(`/cart/${id}?qty=${quantity}`);
  };

  const gobackHandler = () => {
    navigate(-1) ? navigate(-1) : navigate('/');
  };

  const limit = product ? (product.stock >= 5 ? 5 : product.stock) : 0;
  const dropDown = [];
  for (let i = 0; i < limit; i++) {
    dropDown.push(i + 1);
  }

  return (
    <>
      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2>{error.message}</h2>
      ) : (
        product && (
          <div>
            <div onClick={gobackHandler}>
              <h5 className={classes.goback}>
                <i className="fa-solid fa-angles-left"></i> Go Back
              </h5>
            </div>
            <div className={classes.container}>
              <div>
                <img
                  className={classes.image}
                  src={product.image}
                  alt={product.title}
                />
              </div>
              <div className={classes.middle}>
                <h1 className={classes.title}>{product.title}</h1>
                <p className={classes.category}>{product.category}</p>
                <h2 className={classes.price}>$ {product.price}</h2>
                <div className={classes.rating}>
                  <Rating value={product.rating ? product.rating.rate : 0} />
                  <span className={classes.count}>{`${
                    product.rating ? product.rating.count : 0
                  } reviews`}</span>
                </div>
                <p>{product.description}</p>
              </div>
              <div className={classes.stock}>
                <div className={classes.stockdet}>
                  <div className={classes.stocktitle}>
                    <p>Status</p>
                    {product.stock > 0 && <p>Quantity</p>}
                  </div>
                  <div className={classes.stockdesc}>
                    <p>{product.stock > 0 ? 'In Stock' : 'Out of stock'}</p>
                    {product.stock > 0 && (
                      <>
                        <div className={classes.dropdownqtyParent}>
                          <p
                            className={`${classes.dropdownqty}`}
                            onClick={() => setShow(!show)}
                          >
                            {quantity}
                            <i className="fa-solid fa-caret-down"></i>
                          </p>
                        </div>
                        <div
                          className={`${classes.dropdown} ${
                            show && classes.showDropdown
                          }`}
                        >
                          {dropDown.map((x) => (
                            <p
                              key={x}
                              onClick={() => {
                                setQuantity(x);
                                setShow(false);
                              }}
                            >
                              {x}
                            </p>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className={classes.addButton}>
                  <button
                    className={`${classes.addtocart} ${
                      product.stock <= 0 && classes.disabled
                    }`}
                    onClick={() => product.stock > 0 && addToCartHandler()}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default ProductScreen;
