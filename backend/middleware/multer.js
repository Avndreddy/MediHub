// middleware/multer.js
const multer = require('multer');
const path = require('path');

// Define storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder to save files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to file name
  },
});

// Create multer instance
const upload = multer({ storage: storage });

module.exports = upload;
