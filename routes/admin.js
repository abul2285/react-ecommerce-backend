const express = require('express');
// middlewares
const { authCheck, isAdmin } = require('../middlewares/auth');

// controllers
const { orders, updateStatus } = require('../controllers/admin');

const adminRouter = express.Router();

adminRouter.route('/admin/orders').get(authCheck, isAdmin, orders);
adminRouter.route('/admin/update-status').put(authCheck, isAdmin, updateStatus);

module.exports = adminRouter;
