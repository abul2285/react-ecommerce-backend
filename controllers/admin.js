const Order = require('../models/order');

exports.orders = async (req, res) => {
  const allOrders = await Order.find({})
    .sort({ createdAt: -1 })
    .populate({
      path: 'products',
      populate: {
        path: 'product',
        model: 'Product',
      },
    })
    .exec();
  res.json(allOrders);
};

exports.updateStatus = async (req, res) => {
  const { orderId, orderStatus } = req.body;

  const update = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus },
    { new: true }
  );
  res.json(update);
};
