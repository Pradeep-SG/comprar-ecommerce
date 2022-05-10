import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Rating from '../components/Rating';
import classes from '../modules/ProductScreen.module.css';

const ProductScreen = () => {
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
      setIsLoading(false);
    };
    fetchProduct();
  }, []);

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <Link to="/">
            <h5 className={classes.goback}>
              <i className="fa-solid fa-angles-left"></i> Go Back
            </h5>
          </Link>
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
                  <p>Price</p>
                  <p>Status</p>
                </div>
                <div className={classes.stockdesc}>
                  <p>$ 1.20</p>
                  <p>{product.stock > 0 ? 'In Stock' : 'Out of stock'}</p>
                </div>
              </div>
              <div className={classes.addButton}>
                <button className={classes.addtocart}>Add to cart</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductScreen;
