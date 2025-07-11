const CartService = require('../application/CartService');

async function getCart(req, res) {
  try {
    const userId = req.query.userId; // asumsikan pakai query, sesuaikan kebutuhan
    const cart = await CartService.getCartByUserId(userId);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function addItem(req, res) {
  try {
    const { userId, productId, quantity } = req.body;
    const cart = await CartService.addItem(userId, productId, quantity);
    res.status(201).json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function removeItem(req, res) {
  try {
    const { userId, productId } = req.body;
    const cart = await CartService.removeItem(userId, productId);
    res.json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function clearCart(req, res) {
  try {
    const { userId } = req.body;
    const cart = await CartService.clearCart(userId);
    res.json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = { getCart, addItem, removeItem, clearCart };

