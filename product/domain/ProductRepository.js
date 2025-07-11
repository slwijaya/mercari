// Interface/abstraksi repository (bisa pakai JS class atau JSDoc untuk kontrak)
class ProductRepository {
  getAll() { throw new Error('Not implemented!'); }
  getById(id) { throw new Error('Not implemented!'); }
  create(productData) { throw new Error('Not implemented!'); }
}

module.exports = ProductRepository;

