const express = require("express");
const router = express.Router();
const Pharmacy = require("../models/pharmacy");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// JWT secret key from environment variables
const JWT_SECRET = 'avnd'; // Set default for development

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const pharmacy = await Pharmacy.findOne({ email });
    if (!pharmacy) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, pharmacy.password);
    if (!isMatch) {
      return res.status(400).json({ message: '1Invalid email or password' });
    }

    const id = pharmacy._id;
    const token = jwt.sign({ id: pharmacy._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, id });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get("/", async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find();
    res.json(pharmacies);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.post("/register", async (req, res) => {
  try {
    console.log('Request body:', req.body); // Log request body
    const pharmacy_id = new mongoose.Types.ObjectId();
    
    const newPharmacy = new Pharmacy({
      _id: pharmacy_id,
      pharmacy_id: pharmacy_id,
      seller_id: pharmacy_id,
      outletName: req.body.outletName,
      pharmacyLicence: req.body.pharmacyLicence,
      sellerName: req.body.sellerName,
      email: req.body.email,
      contactInfo: req.body.contactInfo,
      storeSpecialty:req.body.storeSpecialty,
      location: req.body.location,
      pinCode: req.body.pinCode,
      outletPictures: req.body.outletPictures,
      password: req.body.password,
      longitude: req.body.longitude, // Added longitude
      latitude: req.body.latitude // Added latitude
    });

    await newPharmacy.save();
    res.status(201).json({ message: 'Pharmacy registered successfully' });
  } catch (err) {
    console.error('Registration error:', err); // Log registration error
    res.status(400).json({ error: err.message });
  }
});



router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid pharmacy ID" });
  }

  try {
    const pharmacy = await Pharmacy.findById(id);
    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }
    res.json(pharmacy);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid pharmacy ID" });
  }

  try {
    const pharmacy = await Pharmacy.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }

    res.json(pharmacy);
  } catch (err) {
    res.status(400).json({ message: 'Bad request' });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid pharmacy ID" });
  }

  try {
    const pharmacy = await Pharmacy.findById(id);
    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }

    Object.assign(pharmacy, req.body);
    await pharmacy.save();
    res.json(pharmacy);
  } catch (err) {
    res.status(400).json({ message: 'Bad request' });
  }
});



// Route to update store timings
router.patch("/:id/store-timings", async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid pharmacy ID" });
  }

  const { storeTimings } = req.body;

  if (!storeTimings) {
    return res.status(400).json({ message: "Store timings are required" });
  }

  try {
    const pharmacy = await Pharmacy.findById(id);
    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }

    pharmacy.storeTimings = storeTimings;
    await pharmacy.save();
    res.json(pharmacy);
  } catch (err) {
    res.status(400).json({ message: 'Bad request' });
  }
});

// Route to update delivery availability
router.patch("/:id/delivery-available", async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid pharmacy ID" });
  }

  const { availableDelivery } = req.body;

  if (availableDelivery === undefined) {
    return res.status(400).json({ message: "Delivery availability status is required" });
  }

  try {
    const pharmacy = await Pharmacy.findById(id);
    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }

    pharmacy.availableDelivery = availableDelivery;
    await pharmacy.save();
    res.json(pharmacy);
  } catch (err) {
    res.status(400).json({ message: 'Bad request' });
  }
});


router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid pharmacy ID" });
  }

  try {
    const pharmacy = await Pharmacy.findByIdAndRemove(id);
    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }
    res.json({ message: "Pharmacy deleted" });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
