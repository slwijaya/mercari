// auth/application/AuthService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserRepository = require('../infrastructure/UserRepositorySequelize');
const User = require('../domain/User');

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

async function register({ email, password }) {
  // Cek user sudah ada
  const existing = await UserRepository.findByEmail(email);
  if (existing) {
    throw new Error('Email sudah terdaftar');
  }
  // Hash password
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const userData = { email, password: hashed };
  const user = await UserRepository.create(userData);
  return new User(user);
}

async function login({ email, password }) {
  const user = await UserRepository.findByEmail(email);
  if (!user) {
    throw new Error('User tidak ditemukan');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Password salah');
  }
  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '2h' }
  );
  return { token, user: new User(user) };
}

module.exports = { register, login };
