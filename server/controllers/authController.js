const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^[0-9]{10}$/;

const register = async (req, res) => {
  try {
    const { name, mobile, email, password, confirmPassword } = req.body;

    if (!name || !mobile || !email || !password) {
      return res.status(400).json({ message: 'All required fields (Name, Mobile, Email, Password) must be provided.' });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanMobile = mobile.trim();

    if (!EMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({ message: 'Invalid email address format.' });
    }

    if (!MOBILE_REGEX.test(cleanMobile)) {
      return res.status(400).json({ message: 'Mobile number must be exactly 10 numeric digits.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ message: 'Confirm Password does not match Password.' });
    }

    const existingEmail = await query('SELECT * FROM users WHERE email = ?', [cleanEmail]);
    if (existingEmail && existingEmail.length > 0) {
      return res.status(400).json({ message: 'This email address is already registered. Please sign in.' });
    }

    const existingMobile = await query('SELECT * FROM users WHERE mobile = ?', [cleanMobile]);
    if (existingMobile && existingMobile.length > 0) {
      return res.status(400).json({ message: 'This mobile number is already registered. Please sign in.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(
      'INSERT INTO users (name, mobile, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [cleanName, cleanMobile, cleanEmail, hashedPassword, 'user']
    );

    const userId = result.insertId || Date.now();

    res.status(201).json({
      success: true,
      message: 'Registration Successful! Redirecting to Sign In...',
      user: {
        id: userId,
        name: cleanName,
        email: cleanEmail,
        mobile: cleanMobile,
        role: 'user'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { loginId, email, mobile, password, rememberMe } = req.body;
    const identifier = (loginId || email || mobile || '').trim();

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please enter your Email/Mobile Number and Password.' });
    }

    const users = await query('SELECT * FROM users WHERE email = ? OR mobile = ?', [identifier, identifier]);
    if (!users || users.length === 0) {
      return res.status(401).json({ message: 'Invalid login credentials. User not found.' });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid login credentials. Incorrect password.' });
    }

    const expiresIn = rememberMe ? '30d' : '7d';
    const token = jwt.sign(
      { id: user.id, email: user.email, mobile: user.mobile, name: user.name, role: user.role || 'user' },
      JWT_SECRET,
      { expiresIn }
    );

    res.json({
      success: true,
      message: 'Sign In Successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role || 'user'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during sign in.', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const users = await query('SELECT id, name, mobile, email, role, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'User profile not found.' });
    }
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile.', error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and New Password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({ message: 'Invalid email address format.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Confirm password does not match new password.' });
    }

    const users = await query('SELECT * FROM users WHERE email = ?', [cleanEmail]);
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No registered user found with this email address.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, cleanEmail]);

    res.json({
      success: true,
      message: 'Password reset successful! You can now sign in with your new password.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error resetting password.', error: error.message });
  }
};

const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully.'
  });
};

module.exports = {
  register,
  login,
  getProfile,
  forgotPassword,
  logout
};
