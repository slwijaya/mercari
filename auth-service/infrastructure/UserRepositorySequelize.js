// auth-service/infrastructure/UserRepositorySequelize.js
const UserRepository = require('../domain/UserRepository');
const UserModel = require('./UserModel');

class UserRepositorySequelize extends UserRepository {
  async findByEmail(email) {
    return await UserModel.findOne({ where: { email } });
  }
  async create(userData) {
    return await UserModel.create(userData);
  }
}

module.exports = new UserRepositorySequelize();
