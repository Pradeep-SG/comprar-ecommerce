import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classes from '../modules/SigninScreen.module.scss';
import { userLogin, userLogout } from '../slices/users/userInfo';
import Message from '../components/Message';

const SigninScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, userInfo, error } = useSelector(
    (state) => state.userInfo.userInfo
  );

  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect')
    ? searchParams.get('redirect')
    : '';

  useEffect(() => {
    if (userInfo) {
      navigate(`/${redirect}`);
    } else {
      dispatch(userLogout());
    }
  }, [redirect, userInfo, navigate, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(userLogin({ email, password }));
  };

  return (
    <div className={classes['outer-div']}>
      <form onSubmit={submitHandler} className={classes['form-div']}>
        <h3 className={classes['signin-title']}>Sign In</h3>
        {error && <Message variant="danger">{error.message}</Message>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onInvalid={(e) =>
            e.target.setCustomValidity('Enter a valid email address')
          }
          onInput={(e) => e.target.setCustomValidity('')}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className={classes.signin}>
          Sign in
        </button>
        <div className={classes['new-user']}>
          <p>
            New user?
            <span
              onClick={() =>
                navigate(
                  redirect !== ''
                    ? `/register?redirect=${redirect}`
                    : '/register'
                )
              }
            >
              Register
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};
export default SigninScreen;
