// Entity class Product
class Product {
  constructor({ id, name, price, category, stock, description }) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
    this.stock = stock;
    this.description = description;
  }
}

module.exports = Product;

