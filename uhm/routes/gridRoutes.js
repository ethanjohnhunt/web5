const express = require('express');
const { uploadGridItem, getGridItems } = require('../controllers/gridController');
const upload = require('../utils/cloudinary'); // Your Cloudinary setup

const router = express.Router();

router.post('/upload', upload.single('image'), uploadGridItem);
router.get('/items', getGridItems);

module.exports = router;
