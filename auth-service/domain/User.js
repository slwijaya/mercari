// auth/domain/User.js
class User {
  constructor({ id, email, password }) {
    this.id = id;
    this.email = email;
    this.password = password; // ini akan berupa hash, bukan password asli
  }
}
module.exports = User;
