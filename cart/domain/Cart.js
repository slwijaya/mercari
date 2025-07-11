class Cart {
  constructor({ id, userId, items }) {
    this.id = id;
    this.userId = userId;
    this.items = items; // Array of { productId, quantity }
  }
}
module.exports = Cart;


