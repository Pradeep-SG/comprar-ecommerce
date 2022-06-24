import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classes from '../modules/Header.module.scss';
import { userLogout } from '../slices/users/userInfo';
import { deleteShippingAndPayment } from '../slices/carts/cartDetails';
import DropDown from './DropDown';
import { resetUsersList } from '../slices/users/usersList';
import { resetMyOrders } from '../slices/orders/myOrders';
import { resetAllOrders } from '../slices/orders/allOrders';
import { resetOrderDeliver } from '../slices/orders/orderDeliver';
import SearchIcon from '@mui/icons-material/Search';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.userInfo.userInfo);

  const [query, setQuery] = useState('');

  const logoutHandler = () => {
    dispatch(resetUsersList());
    dispatch(userLogout());
    dispatch(resetMyOrders());
    dispatch(deleteShippingAndPayment());
    dispatch(resetAllOrders());
    dispatch(resetOrderDeliver());
  };

  const querySubmitHandler = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/?search=${query.trim()}`);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className={classes.nav}>
      <div className={classes['nav-brand']}>
        <h1>
          <Link to="/">ShopXo</Link>
        </h1>
        <form onSubmit={querySubmitHandler}>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">
            <SearchIcon />
          </button>
        </form>
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
            <DropDown
              title={
                <>
                  <i className="fa-solid fa-user"></i>
                  {userInfo.name.split(' ')[0]}
                </>
              }
            >
              <p onClick={() => navigate('/profile')}>
                <i className="fa-solid fa-user"></i>Profile
              </p>
              <p onClick={logoutHandler}>
                <i className="fa-solid fa-right-from-bracket"></i>
                Logout
              </p>
            </DropDown>
          ) : (
            <Link to="/signin">
              <i className="fa-solid fa-user"></i>
              Sign In
            </Link>
          )}
        </li>
        {userInfo && userInfo.isAdmin && (
          <li>
            <DropDown title="admin">
              <p onClick={() => navigate('/admin/users')}>Users</p>
              <p onClick={() => navigate('/admin/products')}>Products</p>
              <p onClick={() => navigate('/admin/orders')}>Orders</p>
            </DropDown>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Header;
