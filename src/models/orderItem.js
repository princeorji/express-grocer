const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'order',
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
  },
  quantity: { type: Number, required: true },
  itemPrice: { type: Number, required: true },
});

module.exports = mongoose.model('orderItem', schema);
