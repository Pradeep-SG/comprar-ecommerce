import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;

connectDB();

app.use('/api/products', productRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () =>
  console.log(
    `Server is running on ${process.env.NODE_ENV} mode in port ${PORT}`
  )
);
