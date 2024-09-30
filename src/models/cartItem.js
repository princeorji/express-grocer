const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cart',
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
  },
  quantity: { type: Number, required: true, min: 1 },
});

module.exports = mongoose.model('cartItem', schema);
