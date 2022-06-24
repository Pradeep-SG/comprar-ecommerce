import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc    Fetch Top rated products
// @route   GET /api/products/top
// @access  Public
export const getTopProducts = asyncHandler(async (req, res) => {
  const productLimit = 5;
  const topProducts = await Product.find({})
    .sort({ 'rating.rate': -1 })
    .limit(productLimit);

  res.json(topProducts);
});

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const productLimit = 12;
  const page = Number(req.query.page) || 1;

  const searchQuery = req.query.search
    ? {
        title: {
          $regex: req.query.search,
          $options: 'i',
        },
      }
    : {};

  const totalProducts = await Product.countDocuments({ ...searchQuery });
  const products = await Product.find({ ...searchQuery })
    .limit(productLimit)
    .skip((page - 1) * productLimit);

  const totalPages = Math.ceil(Number(totalProducts) / productLimit);

  res.json({ products, totalPages });
});

// @desc    Fetch one product by id
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) res.json(product);
  else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete product by id
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    user: req.user._id,
    title: 'Sample Name',
    price: 0,
    description: 'Sample description',
    category: 'Sample category',
    image: '../images/sample.jpg',
    stock: 0,
  });

  if (product) {
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } else {
    res.status(404);
    throw new Error('Error creating product');
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    product.title = req.body.title || product.title;
    product.price = req.body.price || product.price;
    product.description = req.body.description || product.description;
    product.category = req.body.category || product.category;
    product.image = req.body.image || product.image;
    product.stock = req.body.stock || product.stock;

    const createdProduct = await product.save();
    res.json(createdProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a new Review
// @route   POST /api/products/:id.reviews
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find((r) =>
      r.user.equals(req.user._id)
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }
    const review = {
      name: req.user.name,
      rate: Number(req.body.rate),
      comment: req.body.comment,
      user: req.user._id,
    };
    product.reviews.push(review);

    product.rating.count = product.reviews.length;

    product.rating.rate =
      product.reviews.reduce((acc, item) => acc + item.rate, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});
