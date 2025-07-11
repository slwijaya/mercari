// product/infrastructure/ProductRepositorySequelize.js
const ProductModel = require('./ProductModel');
const sequelize = require('./db');

const Product = ProductModel(sequelize);

async function getAll() {
  return Product.findAll();
}

async function getById(id) {
  return Product.findByPk(id);
}

async function create(data) {
  return Product.create(data);
}

module.exports = { getAll, getById, create };


