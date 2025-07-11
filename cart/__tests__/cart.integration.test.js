// __tests__/cart.integration.test.js

require('dotenv').config();
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app'); // harus export 'app' dari app.js (bukan .listen langsung!)
const db = require('../infrastructure/db'); // instance sequelize

// --- Helper untuk generate JWT token user test
function generateToken(userId, email) {
  return jwt.sign(
    { id: userId, email: email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

describe('Integration Test - CartService <-> ProductService', () => {
  const userId = 10; // userId test (pastikan tidak bentrok data user lain)
  const email = 'integrationtest@example.com';
  const token = generateToken(userId, email);

  beforeEach(async () => {
    // Hapus isi cart & cart_items dari userId test (langsung SQL biar pasti)
    // Sesuaikan nama tabel sesuai project-mu (cart_items, carts, dsb)
    await db.query('DELETE FROM "CartItems" WHERE "cartId" IN (SELECT "id" FROM "Carts" WHERE "userId" = ?)', { replacements: [userId] });
    await db.query('DELETE FROM "Carts" WHERE "userId" = ?', { replacements: [userId] });
  });

  it('should add item to cart with valid product from product-service', async () => {
    const payload = { userId, productId: 1, quantity: 2 };

    const response = await request(app)
      .post('/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(response.status).toBe(201); // atau 200 tergantung implementasi
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('userId', payload.userId);
    // Pastikan minimal satu item sesuai
    const found = response.body.items.find(
      i => i.productId === payload.productId && i.quantity === payload.quantity
    );
    expect(found).toBeDefined();
    expect(found).toHaveProperty('productId', payload.productId);
    expect(found).toHaveProperty('quantity', payload.quantity);
  });

  it('should return error if product not found in product-service', async () => {
    const payload = { userId, productId: 9999, quantity: 2 };

    const response = await request(app)
      .post('/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(response.status).toBe(400); // atau error code sesuai implementasi
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toMatch(/produk.*tidak ditemukan/i);
  });
});
