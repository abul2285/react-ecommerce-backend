const express = require('express');
// middlewares
const { authCheck, isAdmin } = require('../middlewares/auth');

// controllers
const {
  userCart,
  getUserCart,
  emptyUserCart,
  userAddress,
  userCartDiscount,
  orderCreate,
  orders,
  addToWishList,
  wishlist,
  removeFromWishList,
  cashOrderCreate,
} = require('../controllers/user');

const userRouter = express.Router();

userRouter
  .route('/user/cart')
  .post(authCheck, userCart)
  .get(authCheck, getUserCart)
  .delete(authCheck, emptyUserCart);
userRouter.route('/user/address').post(authCheck, userAddress);
userRouter.route('/user/cart/coupon').post(authCheck, userCartDiscount);
userRouter.route('/user/order').post(authCheck, orderCreate);
userRouter.route('/user/cash-order').post(authCheck, cashOrderCreate);
userRouter.route('/user/orders').get(authCheck, orders);
userRouter
  .route('/user/wishlist')
  .post(authCheck, addToWishList)
  .get(authCheck, wishlist);
userRouter
  .route('/user/wishlist/:productId')
  .put(authCheck, removeFromWishList);

module.exports = userRouter;
