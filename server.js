const express = require('express');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth');
const categoryRouter = require('./routes/category');
const subCategoryRouter = require('./routes/sub');
const productRouter = require('./routes/product');
const cloudinaryRouter = require('./routes/cloudinary');
const userRouter = require('./routes/user');
const couponRouter = require('./routes/coupon');
const stripeRouter = require('./routes/stripe');
const adminRouter = require('./routes/admin');
require('dotenv').config();

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// db
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then((res) => console.log('Database connected'))
  .catch((err) => console.log('Database connection error', err));

// middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// route
app.use('/api', authRouter);
app.use('/api', categoryRouter);
app.use('/api', subCategoryRouter);
app.use('/api', productRouter);
app.use('/api', cloudinaryRouter);
app.use('/api', userRouter);
app.use('/api', couponRouter);
app.use('/api', stripeRouter);
app.use('/api', adminRouter);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Database connected on port ${port}`);
});
