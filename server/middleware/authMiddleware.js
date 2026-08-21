const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'kiskintha_mens_wear_secret_key_2026';

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Admin authentication required.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.isAdmin && decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired admin token.' });
  }
};

module.exports = {
  JWT_SECRET,
  authenticateUser,
  authenticateAdmin
};
