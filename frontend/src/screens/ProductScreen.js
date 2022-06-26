import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Rating from '../components/Rating';
import classes from '../modules/ProductScreen.module.scss';
import formClasses from '../modules/SigninScreen.module.scss';
import { fetchProductDetails } from '../slices/products/productDetails';
import { fetchCartProduct } from '../slices/carts/cartDetails';
import InputRating from '@mui/material/Rating';
import Message from '../components/Message';
import { createReview, resetReviewInfo } from '../slices/products/reviewInfo';
import Loader from '../components/Loader';

const ProductScreen = ({ history }) => {
  const [quantity, setQuantity] = useState(1);
  const [show, setShow] = useState(false);
  const [newRate, setNewRate] = useState(null);
  const [comment, setComment] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.userInfo.userInfo);

  const { loading, product, error } = useSelector(
    (state) => state.productDetails.productDetails
  );

  const { success, error: reviewError } = useSelector(
    (state) => state.reviewInfo.reviewInfo
  );

  const { id } = useParams();

  useEffect(() => {
    dispatch(resetReviewInfo());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id, success]);

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

  const reviewSubmitHandler = (e) => {
    e.preventDefault();
    if (newRate && comment) {
      dispatch(
        createReview({
          productId: product._id,
          review: { rate: newRate, comment },
        })
      );
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <h2>{error.message}</h2>
      ) : (
        product && (
          <div className={`${classes['product-outer-div']}`}>
            <div>
              <h5 className={classes.goback} onClick={gobackHandler}>
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
              <div className={classes['middle-stock']}>
                <div className={classes.middle}>
                  <h1 className={classes.title}>{product.title}</h1>
                  <p className={classes.category}>{product.category}</p>
                  <h2 className={classes.price}>$ {product.price}</h2>
                  {product.rating && product.rating.count > 0 && (
                    <div className={classes.rating}>
                      <Rating
                        value={product.rating ? product.rating.rate : 0}
                      />
                      <span className={classes.count}>
                        {product.rating && Number(product.rating.count) === 1
                          ? '1 review'
                          : product.rating.count + ' reviews'}
                      </span>
                    </div>
                  )}
                  <p className={classes.description}>{product.description}</p>
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
            <div>
              <div>
                <h2 className={`text-upper ${classes['review-title']}`}>
                  Reviews
                </h2>
              </div>
              {product.reviews && product.reviews.length ? (
                <div className={`${classes['review-outer-div']}`}>
                  {product.reviews.map((review) => (
                    <div
                      key={review._id}
                      className={`${classes['review-div']}`}
                    >
                      <div>
                        <span className={`${classes['review-name']}`}>
                          {review.name} -{' '}
                        </span>
                        <Rating value={review.rate} />
                      </div>
                      <p className={`${classes['review-comment']}`}>
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={classes['no-review']}>
                  <Message variant="info">Be the first one to review</Message>
                </div>
              )}
            </div>
            <div>
              {userInfo ? (
                <form
                  onSubmit={reviewSubmitHandler}
                  className={`${formClasses['form-div']} ${classes['form-div']}`}
                >
                  <h3 className={`${formClasses['signin-title']}`}>
                    Write a review
                  </h3>
                  {reviewError && (
                    <Message variant="danger">{reviewError.message}</Message>
                  )}
                  {success && (
                    <Message variant="success">{success.message}</Message>
                  )}
                  <div className={`${classes['input-rating']}`}>
                    <span className={`${classes['star-meaning']}`}>Poor</span>
                    <InputRating
                      name="simple-controlled"
                      value={newRate}
                      onChange={(event, newRate) => {
                        setNewRate(newRate);
                      }}
                    />
                    <span className={`${classes['star-meaning']}`}>
                      Excellent
                    </span>
                  </div>

                  <textarea
                    rows="1"
                    placeholder="Comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button type="submit" className={formClasses.signin}>
                    Post
                  </button>
                </form>
              ) : (
                <div className={classes['no-review']}>
                  <Message variant="info">
                    Please{' '}
                    <Link to="/signin" className="fw-bold">
                      sign in
                    </Link>{' '}
                    to post a review
                  </Message>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </>
  );
};

export default ProductScreen;
