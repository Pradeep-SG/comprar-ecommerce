import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classes from '../modules/UsersListScreen.module.scss';
import profileClasses from '../modules/ProfileScreen.module.scss';
import { deleteUserById, getUsersList } from '../slices/users/usersList';
import {
  deleteProductById,
  fetchProductList,
} from '../slices/products/productList';
import {
  createProduct,
  resetProductDetailsAdmin,
} from '../slices/products/productDetailsAdmin';
import { Pagination } from '@mui/material';

const ProductListScreen = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  //const searchQuery = searchParams.get('search');
  const page = searchParams.get('page');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.userInfo.userInfo);

  const {
    loading,
    products,
    totalPageCount,
    deleteProductLoading,
    deleteProductSuccess,
  } = useSelector((state) => state.productList.productList);

  const { loading: createProductLoading, productDetailsAdmin: newProduct } =
    useSelector((state) => state.productDetailsAdmin.productDetailsAdmin);

  useEffect(() => {
    dispatch(resetProductDetailsAdmin());
  }, []);

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin');
    } else if (!userInfo.isAdmin) {
      navigate('/');
    } else if (newProduct) {
      const id = newProduct._id;
      dispatch(resetProductDetailsAdmin());
      navigate(`/admin/products/${id}/edit`);
    } else {
      dispatch(fetchProductList({ page }));
    }
  }, [userInfo, navigate, dispatch, newProduct, page]);

  const createProductHandler = async () => {
    await dispatch(createProduct());
  };

  const deleteProductHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      await dispatch(deleteProductById(id));
      dispatch(fetchProductList());
    }
  };

  const paginationHandler = (e, value) => {
    if (Number(page) !== Number(value)) {
      navigate(`/admin/products?page=${value}`);
    }
  };

  return (
    <div
      className={`${profileClasses['order-details']} ${classes['user-details']} ${classes['product-details']}`}
    >
      <div className={`${classes['create-product-div']}`}>
        <h2>Products</h2>
        <button
          className={`${profileClasses.button}`}
          onClick={createProductHandler}
        >
          Create Product
        </button>
      </div>
      {loading || deleteProductLoading || deleteProductSuccess ? (
        <h3>Loading...</h3>
      ) : (
        <>
          {products && products.length ? (
            <>
              <div
                className={`${profileClasses['order-row']} ${classes['order-row']}`}
              >
                <p className={classes['product-id']}>Id</p>
                <p>Name</p>
                <p className={classes.price}>Price</p>
                <p className={classes.admin}>Category</p>
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
              {products.map((product) => (
                <div key={product._id} className={profileClasses['order-row']}>
                  <p className={classes['product-id']}>{product._id}</p>
                  <p>{product.title}</p>
                  <p className={classes.price}>$ {product.price.toFixed(2)}</p>

                  <p className={classes.admin}>{product.category}</p>
                  <div className={classes['modify-buttons']}>
                    <div
                      onClick={() =>
                        navigate(`/admin/products/${product._id}/edit`)
                      }
                    >
                      <i
                        className={`fa-solid fa-pen-to-square ${classes.black}`}
                      ></i>
                    </div>
                    <div
                      onClick={() => {
                        deleteProductHandler(product._id);
                      }}
                    >
                      <i className="fa-solid fa-trash red"></i>
                    </div>
                  </div>
                </div>
              ))}
              {totalPageCount > 1 && (
                <div className={`${classes['pagination-div']}`}>
                  <Pagination
                    count={totalPageCount}
                    page={page ? Number(page) : 1}
                    onChange={(e, value) => paginationHandler(e, value)}
                    size="large"
                  />
                </div>
              )}
            </>
          ) : (
            'No Products found'
          )}
        </>
      )}
    </div>
  );
};
export default ProductListScreen;
