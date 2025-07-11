// auth/infrastructure/UserModel.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // akan menyimpan hash, bukan plaintext
    },
  }, {
    tableName: 'users',
    timestamps: true,
  });

  return User;
};
