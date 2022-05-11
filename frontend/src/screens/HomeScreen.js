import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Product from '../components/Product';
import classes from '../modules/HomeScreen.module.css';
import { fetchProductList } from '../slices/products/productList';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { loading, products, error } = useSelector(
    (state) => state.productList.productList
  );

  useEffect(() => {
    dispatch(fetchProductList());
  }, [dispatch]);

  return (
    <>
      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2>Error occurred</h2>
      ) : (
        products && (
          <>
            <h1 className={classes.latest}>Latest Products</h1>
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
          </>
        )
      )}
    </>
  );
};

export default HomeScreen;
