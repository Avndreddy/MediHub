const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User"); // Ensure this path matches your project structure
const jwt = require("jsonwebtoken");

const router = express.Router();

// JWT secret key
const JWT_SECRET = 'avnd';

// Create a new user (registration)
router.post("/register", async (req, res) => {
  try {
    const userid = new mongoose.Types.ObjectId();

    // Create a new user object using the `create` method
    const newUser = await User.create({
      user_id: userid,
      userName: req.body.userName,
      address: req.body.address,
      pinCode: req.body.pinCode,
      useremail: req.body.useremail,  // Correct field name
      contactInfo: req.body.contactInfo,
      password: req.body.password,
      setRole: req.body.setRole,
      _id:userid,
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Duplicate email address' });
    }
    res.status(400).json({ error: err.message });
  }
});

// Login and get JWT token
router.post("/login", async (req, res) => {
  try {
    const { useremail, password } = req.body;
    const user = await User.findOne({ useremail }); // Correct field name

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
const id=user._id;
    const token = jwt.sign({ id: user._id, role: user.setRole }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token,id});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Protect routes with JWT middleware
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Get all users
router.get("/users", authenticateJWT, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get a single user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a user by ID
router.put("/users/:id", authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

  
// Delete a user by ID
router.delete("/users/:id", authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Example of protected route
router.get("/protected", authenticateJWT, (req, res) => {
  res.json({ message: 'You have access to this protected route', user: req.user });
});

module.exports = router;
