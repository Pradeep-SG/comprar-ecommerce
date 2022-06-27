import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classes from '../modules/UsersListScreen.module.scss';
import {
  deleteProductById,
  fetchProductList,
} from '../slices/products/productList';
import {
  createProduct,
  resetProductDetailsAdmin,
} from '../slices/products/productDetailsAdmin';
import { Pagination } from '@mui/material';
import Loader from '../components/Loader';
import Meta from '../components/Meta';

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

  const { productDetailsAdmin: newProduct } = useSelector(
    (state) => state.productDetailsAdmin.productDetailsAdmin
  );

  useEffect(() => {
    dispatch(resetProductDetailsAdmin());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    <div className={`${classes['user-details']} ${classes['product-details']}`}>
      <div className={`${classes['create-product-div']}`}>
        <h2>Products</h2>
        <button
          className={`${classes['create-button']}`}
          onClick={createProductHandler}
        >
          Create Product
        </button>
      </div>
      {loading || deleteProductLoading || deleteProductSuccess ? (
        <Loader />
      ) : (
        <>
          {products && products.length ? (
            <>
              <Meta title={`Comprar | Admin | Orders`} />
              <div className={classes['table-div']}>
                <div className={`${classes['table-list']}`}>
                  <div
                    className={`${classes['body-row']} ${classes['table-list-head']}`}
                  >
                    <p className={classes['body-id']}>Id</p>
                    <p className={classes['body-title']}>Name</p>
                    <p className={classes.price}>Price</p>
                    <p className={`text-upper ${classes['head-category']}`}>
                      Category
                    </p>
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
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className={`${classes['body-row']} ${classes['body-row-sub']}`}
                    >
                      <p className={classes['body-id']}>{product._id}</p>
                      <p className={classes['body-title']}>{product.title}</p>
                      <p className={classes.price}>
                        $ {product.price.toFixed(2)}
                      </p>

                      <p className={classes.category}>{product.category}</p>
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
                          className={classes.delete}
                        >
                          <i className="fa-solid fa-trash red"></i>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
