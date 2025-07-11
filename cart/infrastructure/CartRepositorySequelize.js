const sequelize = require('./db');
const initModels = require('./CartModel');
const { Cart, CartItem } = initModels(sequelize);

async function getByUserId(userId) {
  return await Cart.findOne({
    where: { userId },
    include: [{ model: CartItem, as: 'items' }]
  });
}

async function addItem(userId, productId, quantity) {
  // Cari cart, kalau belum ada, buat baru
  let cart = await Cart.findOne({ where: { userId } });
  if (!cart) {
    cart = await Cart.create({ userId });
  }

  // Cek apakah item produk sudah ada di cart
  let item = await CartItem.findOne({ where: { cartId: cart.id, productId } });
  if (item) {
    item.quantity += quantity;
    await item.save();
  } else {
    await CartItem.create({ cartId: cart.id, productId, quantity });
  }
  return getByUserId(userId);
}

async function removeItem(userId, productId) {
  let cart = await Cart.findOne({ where: { userId } });
  if (!cart) return null;
  await CartItem.destroy({ where: { cartId: cart.id, productId } });
  return getByUserId(userId);
}

async function clearCart(userId) {
  let cart = await Cart.findOne({ where: { userId } });
  if (!cart) return null;
  await CartItem.destroy({ where: { cartId: cart.id } });
  return getByUserId(userId);
}

module.exports = { getByUserId, addItem, removeItem, clearCart };

