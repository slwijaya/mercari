// product/infrastructure/ProductModel.js
const { Model, DataTypes } = require('sequelize');

class Product extends Model {}

function initProductModel(sequelize) {
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    category: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'Products', // Optional: kalau mau custom nama tabel
    timestamps: true      
  });
  return Product;
}

module.exports = initProductModel;


