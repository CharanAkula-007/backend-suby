const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();

// Route to add a new product
router.post('/add-product/:firmId', productController.addProduct);
router.get('/:firmId/products', productController.getProductsByFirm);

module.exports = router;