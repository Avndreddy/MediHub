const mongoose = require('mongoose');

const customerCartSchema = new mongoose.Schema({
  products: [
    {
      productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        default: 0,
        min: [0, 'Quantity must be positive']
      },
    },
  ],
  totalCost: {
    type: Number,
    default: 0,
  },
});

const CustomerCart = mongoose.model('CustomerCart', customerCartSchema);

module.exports = CustomerCart;
