require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./infrastructure/db');
const initCartModels = require('./infrastructure/CartModel');
const cartRouter = require('./presentation/CartRouter');
const jwtMiddleware = require('../shared/jwtMiddleware'); 

const app = express();
app.use(cors());
app.use(express.json());

// Inisialisasi Model
initCartModels(sequelize);

// Sync DB
sequelize.sync()
  .then(() => {
    console.log('Cart DB synced!');
  })
  .catch((err) => {
    console.error('Cart DB sync error:', err);
  });

// Routing utama cart-service
app.use('/cart', jwtMiddleware, cartRouter);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Mercari Cart Service API running!');
});

// JANGAN panggil app.listen() di sini!
module.exports = app;
