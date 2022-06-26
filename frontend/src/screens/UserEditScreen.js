import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classes from '../modules/SigninScreen.module.scss';
import profileClasses from '../modules/ProfileScreen.module.scss';
import { userProfile } from '../slices/users/userInfo';
import Message from '../components/Message';
import {
  getUserById,
  resetUserInfoAdmin,
  updateProfileAdmin,
} from '../slices/users/userInfoAdmin';
import Loader from '../components/Loader';

const UserEditScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.userInfo.userInfo);

  const {
    loading: userLoading,
    userInfoAdmin: user,
    success,
    error,
  } = useSelector((state) => state.userInfoAdmin.userInfoAdmin);

  const [changeName, setChangeName] = useState(false);
  const [changeEmail, setChangeEmail] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    dispatch(resetUserInfoAdmin());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin');
    } else if (!userInfo.isAdmin) {
      navigate('/');
    } else if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    } else {
      dispatch(getUserById(id));
    }
  }, [userInfo, id, navigate, dispatch, user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (changeName || changeEmail || isAdmin !== user.isAdmin) {
      await dispatch(updateProfileAdmin({ id, name, email, isAdmin }));
      if (userInfo._id === user._id) {
        await dispatch(userProfile());
      }
    }
  };

  return (
    <div
      className={`${classes['outer-div']} ${profileClasses['profile-outer-div']}`}
    >
      <form onSubmit={submitHandler} className={classes['form-div']}>
        <h3 className={classes['signin-title']}>Edit User</h3>
        {success && <Message variant="success">User updated</Message>}
        {error && <Message variant="danger">{error.message}</Message>}
        {userLoading ? (
          <Loader />
        ) : (
          <>
            {!changeEmail ? (
              <div className={profileClasses.changeName}>
                <p>{user && user.email}</p>
                <div
                  className={profileClasses['edit-icon']}
                  onClick={() => setChangeEmail(true)}
                >
                  <i className="fa-solid fa-pen"></i>
                </div>
              </div>
            ) : (
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}
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
            <div className={profileClasses['admin-check']}>
              <input
                type="checkbox"
                id="isAdmin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              <label htmlFor="isAdmin">Admin</label>
            </div>
            <button type="submit" className={classes.signin}>
              Update
            </button>
          </>
        )}
      </form>
    </div>
  );
};
export default UserEditScreen;
