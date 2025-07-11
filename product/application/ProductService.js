const Product = require('../domain/Product');
const ProductRepository = require('../infrastructure/ProductRepositorySequelize');

// Dapat diganti pakai dependency injection di versi lebih advanced

async function listProducts() {
  const products = await ProductRepository.getAll();
  return products.map(p => new Product(p));
}

async function getProductById(id) {
  const prod = await ProductRepository.getById(id);
  if (!prod) return null;
  return new Product(prod);
}

async function createProduct(data) {
  // Validasi sederhana (business rule di sini, atau delegasi ke domain)
  if (!data.name || !data.price) throw new Error("Name & price are required");
  const created = await ProductRepository.create(data);
  return new Product(created);
}

module.exports = { listProducts, getProductById, createProduct };


