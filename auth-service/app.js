// auth/app.js
const express = require('express');
const sequelize = require('./infrastructure/db');
const initUserModel = require('./infrastructure/UserModel');
const authRouter = require('./presentation/AuthRouter'); // Ini function, bukan router langsung!

const app = express();
app.use(express.json());

// Inisialisasi User Model dan sync DB (opsional, untuk dev/testing)
const User = initUserModel(sequelize); // <--- Model Sequelize, hasil dari pemanggilan function

sequelize.sync()
  .then(() => console.log('DB synced!'))
  .catch((err) => console.error('DB sync error:', err));

// Inject User Model ke Router!
app.use('/auth', authRouter(User));

app.get('/', (req, res) => {
  res.send('Auth Service is running!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Auth service listening on port ${PORT}`);
});
