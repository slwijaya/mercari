// auth/presentation/AuthRouter.js

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = (UserModel) => {
  const router = express.Router();

  // REGISTER
  router.post('/register', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email & password are required' });
      }

      // Cek existing
      const existing = await UserModel.findOne({ where: { email } });
      if (existing) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      // Hash password sebelum simpan sa
      const hashed = await bcrypt.hash(password, 10);
      const user = await UserModel.create({ email, password: hashed });

      res.json({ message: 'Register success', user: { id: user.id, email: user.email } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Register failed', error: err.message });
    }
  });

  // LOGIN
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email & password are required' });
      }

      // Cek user sa
      const user = await UserModel.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Cek password hash
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'devsecret',
        { expiresIn: '1h' }
      );

      res.json({
        message: 'Login success',
        token,
        user: { id: user.id, email: user.email }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Login failed', error: err.message });
    }
  });

  // OPTIONAL: Tambahkan route untuk cek status/health atau profile
  router.get('/profile', async (req, res) => {
    res.json({ message: 'Auth service profile endpoint OK' });
  });

  return router;
};
