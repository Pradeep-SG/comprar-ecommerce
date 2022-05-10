import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Product from '../components/Product';
import classes from '../modules/HomeScreen.module.css';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <>
      <h1 className={classes.latest}>Latest Products</h1>
      <div className={classes.grid}>
        {products.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`}>
            <Product
              image={product.image}
              title={product.title}
              price={product.price}
              rating={product.rating.rate}
              count={product.rating.count}
            />
          </Link>
        ))}
      </div>
    </>
  );
};

export default HomeScreen;
