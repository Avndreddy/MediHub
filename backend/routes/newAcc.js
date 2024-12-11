const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const AccountHolder = require("../models/User");

// Register route
router.post('/userregister', async (req, res) => {
  const { customerName, accountHolderEmail, contactInfo, password, address, pinCode } = req.body;
  try {
    // Check if user already exists
    let existingUser = await AccountHolder.findOne({ accountHolderEmail });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new AccountHolder({
      customerName,
      accountHolderEmail,
      contactInfo,
      password: hashedPassword,
      address,
      pinCode
    });

    // Save user
    await newUser.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Login route
router.post('/userlogin', async (req, res) => {
  const { accountHolderEmail, password } = req.body;

  try {
    // Check if user exists
    let user = await AccountHolder.findOne({ accountHolderEmail });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid email' });
    }

    // Compare entered password with hashed password in database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid password' });
    }

    // Create session
    req.session.user = { id: user.id, accountHolderEmail: user.accountHolderEmail };

    // Send user data along with success message
    res.json({
      msg: 'Login successful',
      user: {
        id: user.id,
        accountHolderEmail: user.accountHolderEmail,
        customerName: user.customerName,
        // Add more fields as needed
      }
    });
  } catch (err) {
    console.error('Error logging in:', err.message);
    res.status(500).send('Server Error');
  }
});

// Logout route
router.post('/userlogout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Server Error');
    }
    res.clearCookie('connect.sid');
    res.json({ msg: 'Logout successful' });
  });
});

// Get user route
router.get('/user', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ msg: 'No user logged in' });
  }
});

module.exports = router;
