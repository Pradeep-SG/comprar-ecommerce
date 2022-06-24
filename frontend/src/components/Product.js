import React from 'react';
import Rating from './Rating';
import classes from '../modules/Product.module.css';

const Product = (props) => {
  return (
    <div className={classes.product}>
      <img className={classes.image} src={props.image} alt={props.title} />
      <div className={classes.details}>
        <div className={classes.grow}>
          <p>{props.title}</p>
        </div>
        <div>
          {props.count > 0 && (
            <div className={classes.rating}>
              <Rating value={props.rating} />
              <span className={classes.count}>
                {Number(props.count) === 1
                  ? '1 review'
                  : props.count + ' reviews'}
              </span>
            </div>
          )}
          <h3 className={classes.price}>{`$ ` + props.price}</h3>
        </div>
      </div>
    </div>
  );
};

export default Product;
