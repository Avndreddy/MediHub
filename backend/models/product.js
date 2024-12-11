const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

  pharmacy_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Pharmacy",
  },
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Pharmacy",
  },
  productName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  moreInfo: {
    type: String,
    required: true,
  },
  images: {
    type: [String], // Array of image URLs
  },
  customerReview: { // Updated to 'customerReview' for consistency
    type: [Object],
    default: [], // Set default value to an empty array
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  keywords: {
    type: [String],
    required: true,
  },

  // Newly added fields
  uses: { // Uses of the product
    type: [String],
  },
  howItWorks: { // How the product works
    type: String,
  },
  sideEffects: { // Possible side effects of the product
    type: [String],
  },
  storage: { // Storage instructions for the product
    type: String,
  },
  alternateBrands: { // Alternate brands or substitutes for the product
    type: [String],
  },
});

module.exports = mongoose.model("Product", productSchema);
