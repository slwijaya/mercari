// app.js 
const express = require('express');
const cors = require('cors');

// DB & model init (opsional jika ingin tes koneksi/sync)
const sequelize = require('./infrastructure/db');
const initProductModel = require('./infrastructure/ProductModel');
const productRouter = require('./presentation/ProductRouter');

// Inisialisasi Product Model (pastikan sebelum sync)
const Product = initProductModel(sequelize);

// Sync DB (opsional, untuk development. Production pakai migration)
sequelize.sync()
  .then(() => {
    console.log('Database synced!');
  })
  .catch((err) => {
    console.error('DB sync error:', err);
  });

const app = express();
app.use(cors());
app.use(express.json());

// Register product routes
app.use('/products', productRouter);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Mercari Product Service API running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Product service listening on port ${PORT}`);
});




