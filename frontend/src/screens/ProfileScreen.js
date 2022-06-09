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

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, user, userInfo, error, success } = useSelector(
    (state) => state.userInfo.userInfo
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
      } else {
        dispatch(userProfile());
      }
    }
  }, [userInfo, navigate, dispatch, user]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setMessage('');
      dispatch(updateProfile({ name, password }));
    } else setMessage("Passwords don't match");
  };

  return (
    <div className={classes['outer-div']}>
      <form onSubmit={submitHandler} className={classes['form-div']}>
        <h3 className={classes['signin-title']}>Profile</h3>
        {success && <h4 className={profileClasses.updated}>Profile updated</h4>}
        {message && <p style={{ color: 'red' }}>* {message}</p>}
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
      </form>
    </div>
  );
};
export default ProfileScreen;
