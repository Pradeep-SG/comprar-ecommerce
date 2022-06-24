import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from '../modules/CheckoutSteps.module.scss';

const CheckoutSteps = ({ step2, step3 }) => {
  const navigate = useNavigate();

  const width = step2 && step3 ? '100%' : step2 ? '50%' : '0';
  const activeStyle = { width };
  return (
    <>
      <div className={classes['checkout-title']}>
        <div>Address</div>
        <div>Payment method</div>
        <div>Order</div>
      </div>
      <div className={classes['checkout-outer']}>
        <div className={classes.progress}></div>
        <div className={classes['active-progress']} style={activeStyle}></div>
        <div
          className={`${classes.steps} ${classes.active}`}
          onClick={() => navigate('/shipping')}
        >
          1
        </div>
        <div
          className={`${classes.steps} ${step2 && classes.active}`}
          onClick={() => navigate('/payment')}
        >
          2
        </div>
        <div
          className={`${classes.steps} ${step3 && classes.active}`}
          onClick={() => navigate('/placeorder')}
        >
          3
        </div>
      </div>
    </>
  );
};

export default CheckoutSteps;
