import React, { useRef, useState } from 'react';
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
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { ClickAwayListener } from '@mui/base';

const Header = () => {
  const [toggle, setToggle] = useState(false);
  const [query, setQuery] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.userInfo.userInfo);

  const inputActive = useRef(null);

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
    inputActive.current.focus();
    setToggle(true);
    if (query.trim()) {
      const searchQuery = query.trim();
      setQuery('');
      navigate(`/?search=${searchQuery}`);
    }
  };

  return (
    <nav className={`${classes.nav} ${toggle ? classes['show-navbar'] : ''}`}>
      <div className={classes['nav-brand']}>
        <h1>
          <Link to="/">ShopXo</Link>
        </h1>
        <ClickAwayListener
          onClickAway={() => {
            setQuery('');
            setToggle(false);
          }}
        >
          <form onSubmit={querySubmitHandler}>
            <input
              ref={inputActive}
              className={toggle ? classes['show-input'] : ''}
              type="search"
              placeholder="Search for products"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className={classes.search} type="submit">
              <SearchIcon />
            </button>
          </form>
        </ClickAwayListener>
      </div>
      <ul>
        {userInfo && userInfo.isAdmin && (
          <li>
            <DropDown
              title={
                <>
                  <AdminPanelSettingsIcon />
                  admin
                </>
              }
            >
              <p onClick={() => navigate('/admin/users')}>Users</p>
              <p onClick={() => navigate('/admin/products')}>Products</p>
              <p onClick={() => navigate('/admin/orders')}>Orders</p>
            </DropDown>
          </li>
        )}
        <li>
          {userInfo ? (
            <DropDown
              title={
                <>
                  <AccountCircleIcon />
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
        <li>
          <Link to="/cart">
            <div className={classes['cart-div']}>
              <ShoppingCartIcon />
              Cart
            </div>
          </Link>
        </li>
      </ul>
      <ul className={classes['mobile-ul']}>
        {userInfo && userInfo.isAdmin && (
          <li>
            <DropDown title={<AdminPanelSettingsIcon />}>
              <p onClick={() => navigate('/admin/users')}>Users</p>
              <p onClick={() => navigate('/admin/products')}>Products</p>
              <p onClick={() => navigate('/admin/orders')}>Orders</p>
            </DropDown>
          </li>
        )}
        <li>
          {userInfo ? (
            <DropDown title={<AccountCircleIcon />}>
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
              <span className={classes['icon-link']}>
                <AccountCircleIcon />
              </span>
            </Link>
          )}
        </li>
        <li>
          <Link to="/cart">
            <span className={classes['icon-link']}>
              <ShoppingCartIcon />
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
