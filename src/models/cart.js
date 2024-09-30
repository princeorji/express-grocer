const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('cart', schema);
