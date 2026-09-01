const jwt = require('jsonwebtoken');

const JWT_SECRET = 'bharath_garments_jwt_secret';

// Verify JWT token
const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided. Please login.' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided. Please login.' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

// Check if user is Admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied. Admin authorization required.' });
    }
};

// Check if user is Store Owner
const isOwner = (req, res, next) => {
    if (req.user && req.user.role === 'owner') {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied. Store Owner authorization required.' });
    }
};

module.exports = { auth, isAdmin, isOwner, JWT_SECRET };
