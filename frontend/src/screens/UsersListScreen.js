import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classes from '../modules/UsersListScreen.module.scss';
import { deleteUserById, getUsersList } from '../slices/users/usersList';
import Loader from '../components/Loader';
import Meta from '../components/Meta';

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
    <div className={`${classes['user-details']} ${classes['product-details']}`}>
      <div className={`${classes['create-product-div']}`}>
        <h2>Users</h2>
      </div>
      {usersLoading || deleteUserLoading || deleteUserSuccess ? (
        <Loader />
      ) : (
        <>
          <Meta title={`Comprar | Admin | Users`} />
          {usersList && usersList.length ? (
            <div className={classes['table-div']}>
              <div className={`${classes['table-list']}`}>
                <div
                  className={`${classes['body-row']} ${classes['table-list-head']}`}
                >
                  <p className={classes['body-id']}>Id</p>
                  <p className={classes['body-title']}>Name</p>
                  <p className={classes.email}>Email</p>
                  <p className={`text-upper ${classes['head-admin']}`}>Admin</p>
                  <div
                    className={`${classes['modify-buttons']} ${classes['hide-buttons']}`}
                  >
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
                  <div
                    key={user._id}
                    className={`${classes['body-row']} ${classes['body-row-sub']}`}
                  >
                    <p className={classes['body-id']}>{user._id}</p>
                    <p className={classes['body-title']}>{user.name}</p>
                    <p className={classes.email}>{user.email}</p>

                    <p className={classes.admin}>
                      {user.isAdmin ? (
                        <i
                          style={{ color: 'hsl(120, 100%, 35%)' }}
                          className={`fa-solid fa-check`}
                        ></i>
                      ) : (
                        <i
                          style={{ color: 'red' }}
                          className="fa-solid fa-xmark"
                        ></i>
                      )}
                    </p>
                    <div className={classes['modify-buttons']}>
                      <div
                        onClick={() =>
                          navigate(`/admin/users/${user._id}/edit`)
                        }
                      >
                        <i
                          className={`fa-solid fa-pen-to-square ${classes.black}`}
                        ></i>
                      </div>
                      <div
                        className={classes.delete}
                        onClick={() => deleteUserHandler(user._id)}
                      >
                        <i className="fa-solid fa-trash red"></i>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            'No Users Found'
          )}
        </>
      )}
    </div>
  );
};
export default UsersListScreen;
