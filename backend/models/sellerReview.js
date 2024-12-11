const mongoose = require('mongoose');

const sellerReviewSchema = new mongoose.Schema({

  customer_id: { type: String, required: true },
  customerName: { type: String, required: true },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
  seller_id: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
});

module.exports = mongoose.model('SellerReview', sellerReviewSchema);
