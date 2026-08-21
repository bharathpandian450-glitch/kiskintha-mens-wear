const express = require('express');
const router = express.Router();
const { register, login, getProfile, forgotPassword, logout } = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/profile (Protected)
router.get('/profile', authenticateUser, getProfile);

// POST /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);

// POST /api/auth/logout
router.post('/logout', logout);

module.exports = router;
