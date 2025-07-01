const express = require('express');
const firmController = require('../controllers/firmController');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

// Route to add a new firm
router.post('/add-firm', verifyToken, firmController.addFirm);

module.exports = router;