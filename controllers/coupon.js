const Coupon = require('../models/coupon');

exports.create = async (req, res) => {
  try {
    const newCoupon = await new Coupon(req.body).save();
    res.json(newCoupon);
  } catch (error) {
    console.log({ error });
  }
};

exports.remove = async (req, res) => {
  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(req.params.couponId);
    res.json(deletedCoupon);
  } catch (error) {
    console.log({ error });
  }
};

exports.list = async (req, res) => {
  try {
    const couponList = await Coupon.find({}).exec();
    console.log({ couponList });
    res.json(couponList);
  } catch (error) {
    console.log({ error });
  }
};
