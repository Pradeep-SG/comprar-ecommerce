import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Product from '../components/Product';
import Message from '../components/Message';
import classes from '../modules/HomeScreen.module.scss';
import { fetchProductList } from '../slices/products/productList';
import Pagination from '@mui/material/Pagination';
import Loader from '../components/Loader';
import { fetchTopProductList } from '../slices/products/topProducts';
import Carousel from 'react-material-ui-carousel';
import Rating from '../components/Rating';
import Meta from '../components/Meta';

const HomeScreen = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search')
    ? searchParams.get('search').trim()
    : null;
  const page = searchParams.get('page');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading: topLoading, topProducts } = useSelector(
    (state) => state.topProductList.topProductList
  );

  const { loading, products, totalPageCount, error } = useSelector(
    (state) => state.productList.productList
  );

  useEffect(() => {
    dispatch(fetchTopProductList());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(fetchProductList({ searchQuery, page }));
  }, [dispatch, searchQuery, page]);

  const gobackHandler = () => {
    navigate(-1) ? navigate(-1) : navigate('/');
  };

  const paginationHandler = (e, value) => {
    if (Number(page) !== Number(value)) {
      if (searchQuery) {
        navigate(`/?search=${searchQuery}&page=${value}`);
      } else {
        navigate(`/?page=${value}`);
      }
    }
  };

  return (
    <>
      {topLoading ? (
        <Loader />
      ) : (
        topProducts &&
        !searchQuery && (
          <>
            <h1 className={classes.latest}>Top rated Products</h1>
            <div className={classes['carousel']}>
              <Carousel navButtonsAlwaysVisible fullHeightHover={false}>
                {topProducts.map((item) => (
                  <div
                    style={{ cursor: 'pointer' }}
                    key={item._id}
                    onClick={() => navigate(`/product/${item._id}`)}
                  >
                    <CarouselItem
                      image={item.image}
                      title={item.title}
                      description={item.description}
                      price={item.price}
                      rating={item.rating ? item.rating.rate : 0}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          </>
        )
      )}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">Error occured</Message>
      ) : products && products.length ? (
        <>
          <Meta title="Welcome to Comprar | Home" />
          {searchQuery ? (
            <div>
              <h5 onClick={gobackHandler} className={classes['go-back-home']}>
                <i className="fa-solid fa-angles-left"></i> Go Back
              </h5>
              <h1 className={classes.latest}>Search results</h1>
            </div>
          ) : (
            <h1 className={classes.latest}>Latest Products</h1>
          )}
          <div className={classes.grid}>
            {products &&
              products.map((product) => (
                <Link key={product._id} to={`/product/${product._id}`}>
                  <Product
                    image={product.image}
                    title={product.title}
                    price={product.price}
                    rating={product.rating ? product.rating.rate : 0}
                    count={product.rating ? product.rating.count : 0}
                  />
                </Link>
              ))}
          </div>
          {totalPageCount > 1 && (
            <div className={`${classes['pagination-div']}`}>
              <Pagination
                count={totalPageCount}
                page={page ? Number(page) : 1}
                onChange={(e, value) => paginationHandler(e, value)}
                size="large"
              />
            </div>
          )}
        </>
      ) : (
        <Message variant="info">No products found</Message>
      )}
    </>
  );
};

const CarouselItem = (props) => {
  return (
    <div className={classes.product}>
      <div className={classes['image-div']}>
        <img className={classes.image} src={props.image} alt={props.title} />
      </div>
      <div className={classes.details}>
        <h3 className={`${classes.title}`}>{props.title}</h3>
        <p className={`${classes.title} ${classes.desc}`}>
          {props.description}
        </p>
        <div className={classes.rating}>
          <Rating value={props.rating} />
        </div>
        <h3 className={classes.price}>{`$ ` + props.price}</h3>
      </div>
    </div>
  );
};

export default HomeScreen;
