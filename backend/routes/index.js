const express = require('express');
const router = express.Router();
const multer = require('multer');

const uploadDestination = 'uploads';

// Showing where to store files
const storage = multer.diskStorage({
  destination: uploadDestination,
  filename: (req, file, next) => {
    next(null, file.originalname);
  },
});

const uploads = multer({ storage });

router.get('/register', (req, res) => {
  res.send('register');
});

module.exports = router;
