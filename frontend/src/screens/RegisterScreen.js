import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classes from '../modules/SigninScreen.module.scss';
import { userLogout, userRegister } from '../slices/users/userInfo';
import Message from '../components/Message';
import Meta from '../components/Meta';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { userInfo, error } = useSelector((state) => state.userInfo.userInfo);

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
    if (password === confirmPassword) {
      setErrMsg('');
      dispatch(userRegister({ name, email, password }));
    } else setErrMsg("Passwords don't match");
  };

  return (
    <div className={classes['outer-div']}>
      <Meta title={`Shippr | Register`} />
      <form onSubmit={submitHandler} className={classes['form-div']}>
        <h3 className={classes['signin-title']}>Sign Up</h3>
        {errMsg && <Message variant="danger">{errMsg}</Message>}
        {error && <Message variant="danger">{error.message}</Message>}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
        <button type="submit" className={classes.signin}>
          Sign up
        </button>
        <div className={classes['new-user']}>
          <p>
            Already a user?
            <span
              onClick={() =>
                navigate(
                  redirect !== '' ? `/signin?redirect=${redirect}` : '/signin'
                )
              }
            >
              Sign In
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};
export default RegisterScreen;
