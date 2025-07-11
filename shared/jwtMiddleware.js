// shared/jwtMiddleware.js
const jwt = require('jsonwebtoken');

function jwtMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  // Format header: "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token missing in Authorization header' });
  }

  try {
    // Verifikasi token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // Data user (misal userId, email) tersedia untuk endpoint berikutnya
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = jwtMiddleware;
