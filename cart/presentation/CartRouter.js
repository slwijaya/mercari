const express = require('express');
const router = express.Router();
const CartController = require('./CartController');

router.get('/', CartController.getCart);
router.post('/items', CartController.addItem);
router.delete('/items', CartController.removeItem);
router.delete('/', CartController.clearCart);

module.exports = router;

