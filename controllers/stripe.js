const Cart = require('../models/cart');
const User = require('../models/user');
const Product = require('../models/product');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET);

exports.createStripeIntent = async (req, res) => {
  const { couponApplied } = req.body;
  const user = await User.findOne({ email: req.user.email });
  const { cartTotal, totalAfterDiscount } = await Cart.findOne({
    orderedBy: user._id,
  });

  let amount = 0;
  if (couponApplied && totalAfterDiscount) {
    amount = totalAfterDiscount * 100;
  } else {
    amount = cartTotal * 100;
  }

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
    cartTotal,
    totalAfterDiscount,
    payAble: amount,
  });
};
