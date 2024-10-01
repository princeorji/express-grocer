const Cart = require('../models/cart');
const CartItem = require('../models/cartItem');
const mongoose = require('mongoose');
const Product = require('../models/product');

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

module.exports = {
  addToCart,
  cart,
  removeCartItem,
};
