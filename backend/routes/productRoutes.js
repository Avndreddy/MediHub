const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// POST method to add a new product
router.post('/', async (req, res) => {
  try {
    const {
      pharmacy_id,
      seller_id,
      productName,
      category,
      quantity,
      moreInfo,
      images,
      price,
      discount,
      keywords,
      uses, // Default empty array
      howItWorks, // Default empty string
      sideEffects, // Default empty array
      storage , // Default empty string
      alternateBrands // Default empty array
    } = req.body;

    // Create a new product with default values
    const newProduct = new Product({
      pharmacy_id,
      seller_id,
      productName,
      category,
      quantity,
      moreInfo,
      images,
      customerreview: null, // Default value is null
      price,
      discount,
      keywords,
      uses,
      howItWorks,
      sideEffects,
      storage,
      alternateBrands,
    });
console.log(newProduct);
    // Save the product to the database
    const savedProduct = await newProduct.save();

    // Send response
    res.status(201).json({
      message: 'Product added successfully!',
      product: savedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error adding product',
      error: error.message,
    });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a product by ID
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, {
      ...req.body,
      uses: req.body.uses || [], // Default empty array
      howItWorks: req.body.howItWorks || '', // Default empty string
      sideEffects: req.body.sideEffects || [], // Default empty array
      storage: req.body.storage || '', // Default empty string
      alternateBrands: req.body.alternateBrands || [] // Default empty array
    }, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Partially update a product by ID
router.patch("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update product fields with defaults if not provided
    Object.assign(product, {
      ...req.body,
      uses: req.body.uses || product.uses, // Use existing value if not provided
      howItWorks: req.body.howItWorks || product.howItWorks,
      sideEffects: req.body.sideEffects || product.sideEffects,
      storage: req.body.storage || product.storage,
      alternateBrands: req.body.alternateBrands || product.alternateBrands,
    });

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a product by ID
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
