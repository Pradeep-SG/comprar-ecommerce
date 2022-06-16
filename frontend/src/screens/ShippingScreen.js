import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classes from '../modules/SigninScreen.module.css';
import userInfo, { userLogin, userRegister } from '../slices/users/userInfo';
import { saveShippingAddress } from '../slices/carts/cartDetails';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingScreen = () => {
  const { shippingAddress: addr, products } = useSelector(
    (state) => state.cartDetails.cartDetails
  );

  const { userInfo } = useSelector((state) => state.userInfo.userInfo);

  const [name, setName] = useState(addr ? addr.name : '');
  const [houseNum, setHouseNum] = useState(addr ? addr.houseNum : '');
  const [area, setArea] = useState(addr ? addr.area : '');
  const [postalCode, setPostalCode] = useState(addr ? addr.postalCode : '');
  const [city, setCity] = useState(addr ? addr.city : '');
  const [state, setState] = useState(addr ? addr.state : '');
  const [country, setCountry] = useState(addr ? addr.country : '');
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin');
    } else if (!products || !products.length) {
      navigate('/cart');
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (name && houseNum && area && postalCode && city && state && country) {
      dispatch(
        saveShippingAddress({
          name,
          houseNum,
          area,
          postalCode,
          city,
          state,
          country,
        })
      );
      navigate('/payment');
    } else {
      setErrMsg('Fill all details properly');
    }
  };

  return (
    <>
      <CheckoutSteps />
      <div className={classes['outer-div']} style={{ height: 'auto' }}>
        <form onSubmit={submitHandler} className={classes['form-div']}>
          <h3 className={classes['signin-title']}>Shipping Address</h3>
          {errMsg && <p style={{ color: 'red' }}>* {errMsg}</p>}
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="House no. / Building Name"
            value={houseNum}
            onChange={(e) => setHouseNum(e.target.value)}
          />
          <input
            type="text"
            placeholder="Road Name / Area / Colony"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
          <input
            type="text"
            placeholder="Postal code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <button type="submit" className={classes.signin}>
            Proceed
          </button>
        </form>
      </div>
    </>
  );
};

export default ShippingScreen;
