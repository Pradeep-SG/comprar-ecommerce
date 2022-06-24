import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classes from '../modules/UsersListScreen.module.scss';
import profileClasses from '../modules/ProfileScreen.module.scss';
import { deleteUserById, getUsersList } from '../slices/users/usersList';

const UsersListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.userInfo.userInfo);

  const {
    loading: usersLoading,
    usersList,
    deleteUserLoading,
    deleteUserSuccess,
  } = useSelector((state) => state.usersList.usersList);

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin');
    } else if (!userInfo.isAdmin) {
      navigate('/');
    } else {
      dispatch(getUsersList());
    }
  }, [userInfo, navigate, dispatch]);

  const deleteUserHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      await dispatch(deleteUserById(id));
      dispatch(getUsersList());
    }
  };

  return (
    <div
      className={`${profileClasses['order-details']} ${classes['user-details']}`}
    >
      <h2>Users</h2>
      {usersLoading || deleteUserLoading || deleteUserSuccess ? (
        <h3>Loading...</h3>
      ) : (
        <>
          {usersList && usersList.length ? (
            <>
              <div
                className={`${profileClasses['order-row']} ${classes['order-row']}`}
              >
                <p className={profileClasses['order-id']}>Id</p>
                <p>Name</p>
                <p>Email</p>
                <p className={classes.admin}>Admin</p>
                <div className={classes['modify-buttons']}>
                  <div>
                    <i
                      className={`fa-solid fa-pen-to-square ${classes.black}`}
                    ></i>
                  </div>
                  <div>
                    <i className="fa-solid fa-trash red"></i>
                  </div>
                </div>
              </div>
              {usersList.map((user) => (
                <div key={user._id} className={profileClasses['order-row']}>
                  <p className={profileClasses['order-id']}>{user._id}</p>
                  <p>{user.name}</p>
                  <p className={classes.email}>{user.email}</p>

                  <p className={classes.admin}>
                    {user.isAdmin ? (
                      <i className={`fa-solid fa-check ${classes.green}`}></i>
                    ) : (
                      <i className="fa-solid fa-xmark"></i>
                    )}
                  </p>
                  <div className={classes['modify-buttons']}>
                    <div
                      onClick={() => navigate(`/admin/users/${user._id}/edit`)}
                    >
                      <i
                        className={`fa-solid fa-pen-to-square ${classes.black}`}
                      ></i>
                    </div>
                    <div onClick={() => deleteUserHandler(user._id)}>
                      <i className="fa-solid fa-trash red"></i>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            'No Users Found'
          )}
        </>
      )}
    </div>
  );
};
export default UsersListScreen;
