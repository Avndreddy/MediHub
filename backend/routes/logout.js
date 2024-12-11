const express = require('express');
const router = express.Router();

// Logout route
router.post('/', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Server Error');
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    res.json({ msg: 'Logout successful' });
  });
});

module.exports = router;
