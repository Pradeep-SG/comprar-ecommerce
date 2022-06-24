import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classes from '../modules/SigninScreen.module.css';
import profileClasses from '../modules/ProfileScreen.module.scss';
import {
  updateProfile,
  userLogin,
  userProfile,
  userRegister,
} from '../slices/users/userInfo';
import Message from '../components/Message';
import { getMyOrders } from '../slices/orders/myOrders';
import orderInfo from '../slices/orders/orderInfo';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading: userLoading,
    user,
    userInfo,
    error,
    success,
  } = useSelector((state) => state.userInfo.userInfo);

  const { loading: myOrdersLoading, myOrders } = useSelector(
    (state) => state.getMyOrders.myOrders
  );

  const [changeName, setChangeName] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChange, setIsChange] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin');
    } else {
      if (user) {
        setName(user.name);
        dispatch(getMyOrders());
      } else {
        dispatch(userProfile());
      }
    }
  }, [userInfo, navigate, dispatch, user]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password === confirmPassword && (changeName || isChange)) {
      setMessage('');
      dispatch(updateProfile({ name, password }));
    } else if (password !== confirmPassword)
      setMessage("Passwords don't match");
  };

  return (
    <div
      className={`${classes['outer-div']} ${profileClasses['profile-outer-div']}`}
    >
      <form onSubmit={submitHandler} className={classes['form-div']}>
        <h3 className={classes['signin-title']}>Profile</h3>
        {success && <Message variant="success">Profile updated</Message>}

        {message && <p style={{ color: 'red' }}>* {message}</p>}
        {userLoading ? (
          <h3>Loading...</h3>
        ) : (
          <>
            <p>{user && user.email}</p>
            {!changeName ? (
              <div className={profileClasses.changeName}>
                <p>{user && user.name}</p>
                <div
                  className={profileClasses['edit-icon']}
                  onClick={() => setChangeName(true)}
                >
                  <i className="fa-solid fa-pen"></i>
                </div>
              </div>
            ) : (
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            {!isChange ? (
              <p
                className={profileClasses.changePassword}
                onClick={() => setIsChange(true)}
              >
                Change password
              </p>
            ) : (
              <>
                {' '}
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </>
            )}
            <button type="submit" className={classes.signin}>
              Update
            </button>
          </>
        )}
      </form>

      <div className={profileClasses['order-details']}>
        <h2>My orders</h2>
        {myOrdersLoading ? (
          <h3>Loading...</h3>
        ) : (
          <>
            {myOrders && myOrders.length ? (
              <>
                <div className={profileClasses['order-row']}>
                  <p className={profileClasses['order-id']}>Id</p>
                  <p>Date</p>
                  <p>Price</p>
                  <p>Paid</p>
                  <p>Delivered</p>
                  <button>Details</button>
                </div>
                {myOrders.map((order) => (
                  <div key={order._id} className={profileClasses['order-row']}>
                    <p className={profileClasses['order-id']}>{order._id}</p>
                    <p>{order.createdAt.slice(0, 10)}</p>
                    <p>{'$ ' + order.totalPrice.toFixed(2)}</p>
                    <p className={profileClasses.paid}>
                      {order.isPaid && order.paidAt ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                    <p className={profileClasses.delivered}>
                      {order.isDelivered && order.deliveredAt ? (
                        order.deliveredAt.substring(0, 10)
                      ) : (
                        <i className="fa-solid fa-xmark"></i>
                      )}
                    </p>
                    <button onClick={() => navigate(`/order/${order._id}`)}>
                      Details
                    </button>
                  </div>
                ))}
              </>
            ) : (
              'No orders Placed'
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default ProfileScreen;
