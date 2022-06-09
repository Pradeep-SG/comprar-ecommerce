import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classes from '../modules/Header.module.css';
import { userLogout } from '../slices/users/userInfo';

const Header = () => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.userInfo.userInfo);

  const logoutHandler = () => {
    dispatch(userLogout());
  };

  return (
    <nav className={classes.nav}>
      <div className="nav-brand">
        <h1>
          <Link to="/">ShopXo</Link>
        </h1>
      </div>
      <ul>
        <li>
          <Link to="/cart">
            <i className="fa-solid fa-cart-shopping"></i>
            Cart
          </Link>
        </li>
        <li>
          {userInfo ? (
            <div className={classes.profile} onClick={() => setShow(!show)}>
              <i className="fa-solid fa-user"></i>
              {userInfo.name.split(' ')[0]}
              <i className="fa-solid fa-caret-down"></i>
              <div
                className={`${classes.dropdown} ${
                  show && classes.showDropdown
                }`}
              >
                <p onClick={() => navigate('/profile')}>
                  <i className="fa-solid fa-user"></i>Profile
                </p>
                <p onClick={logoutHandler}>
                  <i className="fa-solid fa-right-from-bracket"></i>
                  Logout
                </p>
              </div>
            </div>
          ) : (
            <Link to="/signin">
              <i className="fa-solid fa-user"></i>
              Sign In
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Header;
