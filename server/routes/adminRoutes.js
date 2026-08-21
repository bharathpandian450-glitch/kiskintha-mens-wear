const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query, fallbackDB } = require('../config/db');
const { JWT_SECRET, authenticateAdmin } = require('../middleware/authMiddleware');

// POST /api/admin/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Admin email and password required.' });
    }

    const admins = await query('SELECT * FROM admins WHERE email = ?', [email.trim()]);
    if (!admins || admins.length === 0) {
      return res.status(401).json({ message: 'Invalid admin credentials.' });
    }

    const admin = admins[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials.' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name, role: 'admin', isAdmin: true },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Admin Sign In Successful!',
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email, role: 'admin' }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during admin login.', error: error.message });
  }
});

// GET /api/admin/dashboard (Metrics)
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    const products = await query('SELECT COUNT(*) as count FROM products');
    const orders = await query('SELECT * FROM orders');
    const customers = await query('SELECT COUNT(*) as count FROM users');

    const totalProducts = products[0]?.count || fallbackDB.products.length;
    const totalOrders = orders.length;
    const totalCustomers = customers[0]?.count || fallbackDB.users.length;

    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;

    res.json({
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue,
      pendingOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard metrics.', error: error.message });
  }
});

// GET /api/admin/orders
router.get('/orders', authenticateAdmin, async (req, res) => {
  try {
    const orders = await query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin orders.', error: error.message });
  }
});

// PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    await query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: `Order status updated to ${status}.` });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status.', error: error.message });
  }
});

// GET /api/admin/customers
router.get('/customers', authenticateAdmin, async (req, res) => {
  try {
    const customers = await query('SELECT id, name, mobile, email, created_at FROM users');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer list.', error: error.message });
  }
});

module.exports = router;
