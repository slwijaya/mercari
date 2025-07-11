// product/presentation/ProductController.js
const ProductService = require('../application/ProductService');

async function getAllProducts(req, res) {
  try {
    const products = await ProductService.listProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', detail: error.message });
  }
}

async function getProductDetail(req, res) {
  try {
    const product = await ProductService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', detail: error.message });
  }
}

async function createProduct(req, res) {
  try {
    const data = req.body;
    const product = await ProductService.createProduct(data);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', detail: error.message });
  }
}

module.exports = { getAllProducts, getProductDetail, createProduct };

