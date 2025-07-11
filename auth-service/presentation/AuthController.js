// auth/presentation/authController.js
const AuthService = require('../application/AuthService');
//register
async function register(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email & password wajib diisi' });
    }
    const user = await AuthService.register({ email, password });
    res.status(201).json({ message: 'Registrasi sukses', user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
//login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email & password wajib diisi' });
    }
    const { token, user } = await AuthService.login({ email, password });
    res.status(200).json({ message: 'Login sukses', token, user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}

module.exports = { register, login };
