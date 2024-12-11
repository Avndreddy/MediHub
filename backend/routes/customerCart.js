const express = require('express');
const router = express.Router();
const CustomerCart = require("../models/CustomerCart"); // Adjust the path as necessary

// Create or Replace Cart
router.post('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cartData = req.body;

    // Find if the cart exists
    let cart = await CustomerCart.findById(id);

    if (cart) {
      // Cart exists, replace the existing cart with the new data
      cart.products = cartData.products || [];
      cart.totalCost = cartData.totalCost || 0;
    } else {
      // Cart does not exist, create a new one
      cart = new CustomerCart({
        _id: id,
        products: cartData.products || [],
        totalCost: cartData.totalCost || 0
      });
    }

    // Save the cart
    const savedCart = await cart.save();
    res.status(200).json(savedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the cart by ID
    let cart = await CustomerCart.findById(id);

    if (!cart) {
      // Cart does not exist, create a new one
      cart = new CustomerCart({
        _id: id, // Assuming you want to set the customerID to the provided ID
        products: [],
        totalCost: 0
      });

      // Save the new cart to the database
      await cart.save();
    }

    // Send the products in the cart
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Update Cart Item
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cartData = req.body;

    // Find the cart by ID
    const cart = await CustomerCart.findById(id);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.productID.toString() === cartData.productID
    );

    if (productIndex >= 0) {
      // Update existing product
      cart.products[productIndex].quantity = cartData.quantity;
      if (cart.products[productIndex].quantity <= 0) {
        cart.products.splice(productIndex, 1); // Remove the product if quantity <= 0
      }
    } else {
      // Add new product
      cart.products.push({
        productID: cartData.productID,
        quantity: cartData.quantity
      });
    }

    // Recalculate total cost (assuming you have a method to calculate it)
    cart.totalCost = await calculateTotalCost(cart.products);

    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Cart
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await CustomerCart.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json({ message: 'Cart deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function calculateTotalCost(products) {
  // Implement your logic to calculate total cost based on products
  let totalCost = 0;
  // Example logic: Iterate over products and sum their costs
  // This requires you to fetch the price of each product from your Product model.
  for (const product of products) {
    // Assuming Product model is available and has a `price` field
    const Product = require('./models/Product'); // Adjust the path as necessary
    const productDetails = await Product.findById(product.productID);
    totalCost += productDetails.price * product.quantity;
  }
  return totalCost;
}

module.exports = router;
