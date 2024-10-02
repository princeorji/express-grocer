const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const mongoose = require('mongoose');

const orders = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const orders = await Order.find({ userId });

    if (orders.length === 0) {
      return res
        .status(200)
        .json({ message: 'You have no orders at this time' });
    }

    const payload = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.find({ orderId: order._id }).select(
          '-orderId',
        );
        return {
          orderId: order._id,
          total: order.total,
          status: order.status,
          items,
        };
      }),
    );

    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  const userId = req.user._id;
  const { id } = req.params;

  try {
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ error: 'Invalid order id' });
    }

    const order = await Order.findOne({ _id: id, userId });
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
    }

    const items = await OrderItem.find({ orderId: order._id }).select(
      '-orderId',
    );

    res.status(200).json({
      orderId: order._id,
      items,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  orders,
  getById,
};
