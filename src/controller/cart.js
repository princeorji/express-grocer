const Cart = require('../models/cart');
const CartItem = require('../models/cartItem');
const mongoose = require('mongoose');
const Product = require('../models/product');
const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const Stripe = require('stripe');
const env = require('../utils/setEnv');

const stripe = new Stripe(env.STRIPE_SECRET, {
  apiVersion: '2024-06-20',
});

const addToCart = async (req, res, next) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  try {
    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Parameters missing' });
    }

    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId });
    }

    let item = await CartItem.findOne({ cartId: cart._id, productId });

    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      item = await CartItem.create({
        cartId: cart._id,
        productId,
        quantity,
      });
    }

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

const cart = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const items = await CartItem.find({ cartId: cart._id }).select('-cartId');
    if (items.length === 0) {
      return res.status(200).json({ message: 'Your cart is empty' });
    }

    res.status(200).json({
      cartId: cart._id,
      items,
    });
  } catch (error) {
    next(error);
  }
};

const removeCartItem = async (req, res, next) => {
  const userId = req.user._id;
  const { id } = req.params;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid item id' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = await CartItem.findByIdAndDelete({
      _id: id,
      cartId: cart._id,
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};

const checkout = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid cart id' });
    }

    const items = await CartItem.find({ cartId: id });

    if (items.length === 0) {
      return res.status(200).json({ message: 'Your cart is empty' });
    }

    // Calculate total price
    let total = 0;

    for (const item of items) {
      const product = await Product.findOne({ _id: item.productId });

      if (product && product.price) {
        total += product.price * item.quantity;
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // amount in kobo
      currency: 'ngn',
      payment_method_types: ['card'],
    });

    res.status(200).json({
      paymentIntentId: paymentIntent.id,
      client_secret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
};

const finalizeOrder = async (req, res, next) => {
  const userId = req.user._id;
  const { paymentIntentId } = req.body;
  const { id } = req.params;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid cart id' });
    }

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Parameters missing' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not successful' });
    }

    const items = await CartItem.find({ cartId: id });

    if (items.length === 0) {
      return res.status(200).json({ message: 'Your cart is empty' });
    }

    let total = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (product && product.price) {
        total += product.price * item.quantity;
      }
    }

    const order = await Order.create({
      userId,
      total,
      status: 'pending',
    });

    for (const item of items) {
      const product = await Product.findById(item.productId);

      await OrderItem.create({
        orderId: order._id,
        productId: item.productId,
        quantity: item.quantity,
        itemPrice: product.price,
      });
    }

    // Clear cart items
    await CartItem.deleteMany({ cartId: id });

    res.status(200).json({ orderId: order._id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addToCart,
  cart,
  removeCartItem,
  checkout,
  finalizeOrder,
};
