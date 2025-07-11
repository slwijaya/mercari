const CartRepository = require('../infrastructure/CartRepositorySequelize');

// Memanggil product-service untuk validasi/ambil detail produk
async function fetchProduct(productId) {
  const resp = await fetch(`http://localhost:3000/products/${productId}`);
  if (!resp.ok) throw new Error('Produk tidak ditemukan di product-service!');
  return resp.json();
}

async function getCartByUserId(userId) {
  return await CartRepository.getByUserId(userId);
}

async function addItem(userId, productId, quantity, fetchProductDep = fetchProduct) {
  // Pastikan produk valid
  // await fetchProduct(productId); // Akan error jika tidak ditemukan
  await fetchProductDep(productId); // DI gunakan dependency injection supaya mudah mock saat test
  // Lanjutkan simpan item ke cart
  return await CartRepository.addItem(userId, productId, quantity);
}

async function removeItem(userId, productId) {
  return await CartRepository.removeItem(userId, productId);
}

async function clearCart(userId) {
  return await CartRepository.clearCart(userId);
}

module.exports = { getCartByUserId, addItem, removeItem, clearCart };