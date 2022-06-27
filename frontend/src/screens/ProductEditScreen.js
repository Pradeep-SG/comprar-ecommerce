import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classes from '../modules/SigninScreen.module.scss';
import profileClasses from '../modules/ProfileScreen.module.scss';
import {
  fetchProductDetails,
  resetProductDetails,
} from '../slices/products/productDetails';
import Message from '../components/Message';
import {
  resetProductDetailsAdmin,
  updateProduct,
} from '../slices/products/productDetailsAdmin';
import axios from 'axios';
import Loader from '../components/Loader';
import Meta from '../components/Meta';

const ProductEditScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.userInfo.userInfo);

  const { loading, product } = useSelector(
    (state) => state.productDetails.productDetails
  );

  const {
    loading: productLoading,
    success,
    error,
  } = useSelector((state) => state.productDetailsAdmin.productDetailsAdmin);

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState(0);
  const [isChange, setIsChange] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    dispatch(resetProductDetails());
    dispatch(resetProductDetailsAdmin());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setIsChange(true);
  }, [title, price, category, image, stock, description]);

  useEffect(() => {
    if (success) {
      setUpdateSuccess(success);
      dispatch(resetProductDetailsAdmin());
      setIsChange(false);
    }
  }, [success]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin');
    } else if (!userInfo.isAdmin) {
      navigate('/');
    } else if (product) {
      setTitle(product.title);
      setPrice(product.price);
      setCategory(product.category);
      setImage(product.image);
      setStock(product.stock);
      setDescription(product.description);
      setIsChange(false);
    } else {
      dispatch(fetchProductDetails(id));
    }
  }, [userInfo, id, navigate, dispatch, product]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const { data } = await axios.post('/api/uploads', formData, config);
      setImage(data);
      setUploaded(true);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (isChange) {
      dispatch(
        updateProduct({
          id,
          updatedProduct: { title, price, category, image, stock, description },
        })
      );
    }
  };

  return (
    <div
      className={`${classes['outer-div']} ${profileClasses['profile-outer-div']} ${profileClasses['products-outer-div']}`}
    >
      <form
        onSubmit={submitHandler}
        className={`${classes['form-div']} ${profileClasses['form-div']}`}
      >
        <h3 className={classes['signin-title']}>Edit Product</h3>
        {updateSuccess && <Message variant="success">Product updated</Message>}
        {error && <Message variant="danger">{error.message}</Message>}
        {product && <Meta title={`Comprar | Admin | Product-${product._id}`} />}
        {productLoading || loading ? (
          <Loader />
        ) : (
          <>
            <div>
              <label htmlFor="title">Title / Name</label>
              <input
                type="text"
                id="title"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="price">Price ($)</label>
              <input
                type="number"
                step="0.01"
                id="price"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="image">Image (URL / Upload file)</label>
              <input
                type="text"
                id="image"
                placeholder="Image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              (or)
              <input
                type="file"
                id="image"
                placeholder="Choose file"
                onChange={uploadFileHandler}
              />
              {uploading && <h3>Uploading...</h3>}
              {uploaded && <Message variant="success">Uploaded</Message>}
            </div>
            <div>
              <label htmlFor="stock">Stock</label>
              <input
                type="number"
                id="stock"
                placeholder="Count in stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
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
export default ProductEditScreen;
