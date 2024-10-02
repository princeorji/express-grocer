const Product = require('../models/product');
const mongoose = require('mongoose');

const create = async (req, res, next) => {
  const { name, description, imageUrl, price } = req.body;

  try {
    if (!name || !description || !imageUrl || !price) {
      return res.status(400).json({ error: 'Parameters missing' });
    }

    const products = await Product.create(req.body);
    res.status(201).json(products);
  } catch (error) {
    next(error);
  }
};

const products = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid product id' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  const { id } = req.params;
  const { name, description, imageUrl, price } = req.body;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid product id' });
    }

    if (!name || !description || !imageUrl || !price) {
      return res.status(400).json({ error: 'Parameters missing' });
    }

    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid product id' });
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  products,
  getById,
  update,
  remove,
};
