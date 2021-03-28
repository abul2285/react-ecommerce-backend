const express = require('express');
// middlewares
const { authCheck, isAdmin } = require('../middlewares/auth');

// controllers
const { createOrUpdateUser, currentUser } = require('../controllers/auth');

const authRouter = express.Router();

authRouter.route('/create-or-update-user').post(authCheck, createOrUpdateUser);
authRouter.route('/current-user').post(authCheck, currentUser);
authRouter.route('/current-admin').post(authCheck, isAdmin, currentUser);

module.exports = authRouter;
