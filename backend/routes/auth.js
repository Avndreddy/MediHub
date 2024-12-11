const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/Userold');

// Register route
router.post('/register', async (req, res) => {
  const { name, email, phone_no, password } = req.body;
  try {
    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }


    // Create new user
    const newUser = new User({
      name,
      email,
      phone_no,
      password
    });

    // Save user
    await newUser.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// // Login route
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Check if user exists
//     let user = await User.findOne({ email });
//     console.log(user);
//     if (!user) {
//       return res.status(400).json({ msg: 'Invalid username' });
//     }

//     //Compare entered password with password in database (assuming it's not hashed)
//     if (password !== user.password) {
//       return res.status(400).json({ msg: 'Invalid password' });
//     }

//     // Create session
//     req.session.user = { id: user.id, email: user.email };

//     res.json({ msg: 'Login successful' });
//   } catch (err) {
//     console.error('Error logging in:', err.message);
//     res.status(500).send('Server Error');
//   }
// });

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid username' });
    }

    // Compare entered password with password in database (assuming it's not hashed)
    if (password !== user.password) {
      return res.status(400).json({ msg: 'Invalid password' });
    }

    // Create session
    req.session.user = { id: user.id, email: user.email };

    // Send user data along with success message
    res.json({
      msg: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name, // Include any other relevant user data
        // Add more fields as needed
      }
    });
  } catch (err) {
    console.error('Error logging in:', err.message);
    res.status(500).send('Server Error');
  }
});


// Logout route
router.post('/logout', (req, res) => {
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
