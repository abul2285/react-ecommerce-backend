const express = require('express');
const { createStripeIntent } = require('../controllers/stripe');
const { authCheck } = require('../middlewares/auth');

const stripeRouter = express.Router();

stripeRouter
  .route('/create-payment-intent')
  .post(authCheck, createStripeIntent);

module.exports = stripeRouter;
