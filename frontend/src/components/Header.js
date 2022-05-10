import React from 'react';
import { Link } from 'react-router-dom';
import classes from '../modules/Header.module.css';

const Header = () => {
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
          <Link to="/signin">
            <i className="fa-solid fa-user"></i>
            Sign In
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
