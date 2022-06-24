import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classes from '../modules/SigninScreen.module.css';
import paymentClasses from '../modules/PaymentScreen.module.scss';
import userInfo, { userLogin, userRegister } from '../slices/users/userInfo';
import {
  savePaymentMethod,
  saveShippingAddress,
} from '../slices/carts/cartDetails';
import CheckoutSteps from '../components/CheckoutSteps';

const PaymentScreen = () => {
  const { shippingAddress: addr, products } = useSelector(
    (state) => state.cartDetails.cartDetails
  );

  const { userInfo } = useSelector((state) => state.userInfo.userInfo);

  const [payment, setPayment] = useState('paypal');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin');
    } else if (!addr) {
      navigate('/shipping');
    } else if (!products || !products.length) {
      navigate('/cart');
    }
  }, [userInfo, navigate, addr, products]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(payment));
    navigate('/placeorder');
  };

  return (
    <>
      <CheckoutSteps step2 />
      <div className={classes['outer-div']} style={{ height: 'auto' }}>
        <form onSubmit={submitHandler} className={classes['form-div']}>
          <h3 className={classes['signin-title']}>Select Payment Method</h3>
          <div className={paymentClasses['select-parent']}>
            <input
              type="radio"
              id="paypal"
              name="payment"
              value="paypal"
              checked
              onChange={(e) => setPayment(e.target.value)}
            />
            <label htmlFor="paypal" className={paymentClasses['select-label']}>
              <span className={paymentClasses['custom-radio']}></span>
              <span>PayPal or Credit card</span>
            </label>
          </div>
          {/* <div className={paymentClasses['select-parent']}>
            <input
              type="radio"
              id="gpay"
              name="payment"
              value="gpay"
              onChange={(e) => setPayment(e.target.value)}
            />
            <label htmlFor="gpay" className={paymentClasses['select-label']}>
              <span className={paymentClasses['custom-radio']}></span>
              <span>GPay</span>
            </label>
          </div> */}
          <button type="submit" className={classes.signin}>
            Proceed
          </button>
        </form>
      </div>
    </>
  );
};

export default PaymentScreen;
