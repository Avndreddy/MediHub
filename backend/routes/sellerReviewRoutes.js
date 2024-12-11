// const express = require("express");
// const router = express.Router();
// const SellerReview = require("../models/sellerReview");

// // Create a new seller review
// router.post("/", async (req, res) => {
//   try {
//     const sellerReview = await SellerReview.create(req.body);
//     res.status(201).json(sellerReview);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // Get all seller reviews
// router.get("/", async (req, res) => {
//   try {
//     const sellerReviews = await SellerReview.find();
//     res.json(sellerReviews);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Get a specific seller review by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const sellerReview = await SellerReview.findById(req.params.id);
//     if (!sellerReview) {
//       return res.status(404).json({ message: "Seller Review not found" });
//     }
//     res.json(sellerReview);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Update a seller review by ID
// router.put("/:id", async (req, res) => {
//   try {
//     const sellerReview = await SellerReview.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.json(sellerReview);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // Partially update a seller review by ID
// router.patch("/:id", async (req, res) => {
//   try {
//     const sellerReview = await SellerReview.findById(req.params.id);
//     if (!sellerReview) {
//       return res.status(404).json({ message: "Seller Review not found" });
//     }
//     Object.assign(sellerReview, req.body);
//     await sellerReview.save();
//     res.json(sellerReview);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // Delete a seller review by ID
// router.delete("/:id", async (req, res) => {
//   try {
//     const sellerReview = await SellerReview.findByIdAndRemove(req.params.id);
//     res.json({ message: "Seller Review deleted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const SellerReview = require("../models/sellerReview");
const mongoose = require("mongoose");




// Create a new seller review
router.post("/", async (req, res) => {
  try {
    const review_id = new mongoose.Types.ObjectId(); // Generate a new ObjectId for review_id
    const newReview = new SellerReview({
      review_id: review_id,
      customer_id: req.body.customer_id,
      customerName: req.body.customerName,
      comment: req.body.comment,
      date: new Date(),
      seller_id: req.body.seller_id,
      rating: req.body.rating
    });

    await newReview.save();
    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all seller reviews
router.get("/", async (req, res) => {
  try {
    const sellerReviews = await SellerReview.find();
    res.json(sellerReviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific seller review by ID
router.get("/:id", async (req, res) => {
  try {
    const sellerReview = await SellerReview.findById(req.params.id);
    
    if (!sellerReview) {
      return res.status(404).json({ message: "Seller Review not found" });
    }
    res.json(sellerReview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a seller review by ID
router.put("/:id", async (req, res) => {
  try {
    const { rating } = req.body;
    
    // Validate that rating is within the acceptable range
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }

    const sellerReview = await SellerReview.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!sellerReview) {
      return res.status(404).json({ message: "Seller Review not found" });
    }
    res.json(sellerReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Partially update a seller review by ID
router.patch("/:id", async (req, res) => {
  try {
    const sellerReview = await SellerReview.findById(req.params.id);
    
    if (!sellerReview) {
      return res.status(404).json({ message: "Seller Review not found" });
    }

    // Validate that rating is within the acceptable range if it exists in the update
    if (req.body.rating && (req.body.rating < 1 || req.body.rating > 5)) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }

    Object.assign(sellerReview, req.body);
    await sellerReview.save();
    res.json(sellerReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a seller review by ID
router.delete("/:id", async (req, res) => {
  try {
    const sellerReview = await SellerReview.findByIdAndRemove(req.params.id);
    
    if (!sellerReview) {
      return res.status(404).json({ message: "Seller Review not found" });
    }
    res.json({ message: "Seller Review deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
