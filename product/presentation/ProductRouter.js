// product/presentation/productRouter.js
const express = require('express');
const router = express.Router();
const ProductController = require('./ProductController');

router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductDetail);
router.post('/', ProductController.createProduct);

module.exports = router;


