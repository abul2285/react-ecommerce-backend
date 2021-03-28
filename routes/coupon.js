const express = require('express');
// middlewares
const { authCheck, isAdmin } = require('../middlewares/auth');

// controllers
const { create, list, remove } = require('../controllers/coupon');

const couponRouter = express.Router();

couponRouter.route('/coupon').post(authCheck, isAdmin, create);
couponRouter.route('/coupons').get(list);
couponRouter.route('/coupon/:couponId').delete(authCheck, isAdmin, remove);

module.exports = couponRouter;
