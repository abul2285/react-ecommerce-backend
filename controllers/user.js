const User = require('../models/user');
const Product = require('../models/product');
const Cart = require('../models/cart');
const Coupon = require('../models/coupon');
const Order = require('../models/order');
const { v4: uuidv4 } = require('uuid');

exports.userCart = async (req, res) => {
  const { cart } = req.body;
  const products = [];
  const user = await User.findOne({ email: req.user.email });
  const existCart = await Cart.findOne({ orderedBy: user._id });
  if (existCart) {
    existCart.remove();
  }

  for (let i = 0; i < cart.length; i++) {
    let cartObj = {};
    cartObj.product = cart[i]._id;
    cartObj.count = cart[i].count;
    cartObj.color = cart[i].color;
    const { price } = await Product.findById(cart[i]._id)
      .select('price')
      .exec();
    cartObj.price = price;
    products.push(cartObj);
  }

  const cartTotal = products.reduce((a, c) => a + c.price * c.count, 0);
  const newCart = await new Cart({
    products,
    cartTotal,
    orderedBy: user._id,
  }).save();
  res.json({ ok: true });
};

exports.getUserCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  const cart = await Cart.findOne({ orderedBy: user._id })
    .populate({
      path: 'products',
      populate: {
        path: 'product',
        model: 'Product',
        select: 'title price _id',
      },
    })
    .exec();

  const { products, cartTotal, totalAfterDiscount } = cart;
  res.json({ products, cartTotal, totalAfterDiscount });
};

exports.emptyUserCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  await Cart.findOneAndDelete({ orderedBy: user._id }).exec();

  res.json({ ok: true });
};

exports.userAddress = async (req, res) => {
  const { address } = req.body;
  await User.findOneAndUpdate({ email: req.user.email }, { address }).exec();

  res.json({ ok: true });
};

exports.userCartDiscount = async (req, res) => {
  const { coupon } = req.body;
  const isValidCoupon = await Coupon.findOne({ name: coupon });
  if (!isValidCoupon) {
    res.json({
      err: 'Token is not Valid',
    });
    return;
  }

  const user = await User.findOne({ email: req.user.email });
  const { products, cartTotal } = await Cart.findOne({ orderedBy: user._id })
    .populate({
      path: 'products',
      populate: {
        path: 'product',
        model: 'Product',
        select: 'title price _id',
      },
    })
    .exec();

  const totalAfterDiscount = (
    cartTotal -
    (cartTotal * isValidCoupon.discount) / 100
  ).toFixed(2);
  await Cart.findOneAndUpdate(
    { orderedBy: user._id },
    { totalAfterDiscount },
    { new: true }
  );
  res.json({ totalAfterDiscount });
};

exports.orderCreate = async (req, res) => {
  const { paymentIntent } = req.body.stripeResponse;
  const user = await User.findOne({ email: req.user.email });

  const { products } = await Cart.findOne({ orderedBy: user._id });

  const newOrder = await new Order({
    products,
    paymentIntent,
    orderedBy: user._id,
  }).save();

  // decrement quantity , increment sold
  const bulkOption = products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  await Product.bulkWrite(bulkOption, {});

  res.json({ ok: true });
};

exports.orders = async (req, res) => {
  const user = await User.findOne({ email: req.user.email });

  const orders = await Order.find({ orderedBy: user._id })
    .populate({
      path: 'products',
      populate: {
        path: 'product',
        model: 'Product',
      },
    })
    .exec();

  res.json(orders);
};

exports.addToWishList = async (req, res) => {
  const { productId } = req.body;
  await User.findOneAndUpdate(
    { email: req.user.email },
    {
      $addToSet: { wishList: productId },
    }
  ).exec();

  res.json({ ok: true });
};

exports.wishlist = async (req, res) => {
  const list = await User.findOne({ email: req.user.email })
    .select('wishList')
    .populate('wishList')
    .exec();
  res.json(list);
};

exports.removeFromWishList = async (req, res) => {
  const { productId } = req.params;
  await User.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { wishList: productId } }
  ).exec();
  res.json({ ok: true });
};

exports.cashOrderCreate = async (req, res) => {
  const { couponApplied, COD } = req.body;
  if (!COD) res.status(400).send('COD is not Apply');
  const user = await User.findOne({ email: req.user.email });

  const userCart = await Cart.findOne({ orderedBy: user._id });
  console.log({ couponApplied, userCart });
  let amount = 0;
  if (couponApplied && userCart.totalAfterDiscount) {
    amount = userCart.totalAfterDiscount * 100;
  } else {
    amount = userCart.cartTotal * 100;
  }

  const newOrder = await new Order({
    products: userCart.products,
    paymentIntent: {
      id: uuidv4(),
      amount,
      created: Date.now(),
      currency: 'usd',
      payment_method_types: ['cash'],
      status: 'Cash On Delivery',
    },
    orderedBy: user._id,
    orderStatus: 'Cash On Delivery',
  }).save();

  // decrement quantity , increment sold
  const bulkOption = userCart.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  await Product.bulkWrite(bulkOption, {});

  res.json({ ok: true });
};
