const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { auth, isAdmin } = require('../middleware/auth');

// GET dashboard stats (Admin & Owner)
router.get('/stats', auth, isAdmin, async (req, res) => {
    try {
        const [stats] = await pool.query('SELECT COUNT(*) as count FROM products');
        // If query returns single row stats object from memory/db
        if (stats && stats[0] && typeof stats[0].totalProducts !== 'undefined') {
            return res.json(stats[0]);
        }

        const [products] = await pool.query('SELECT COUNT(*) as count FROM products');
        const [orders] = await pool.query('SELECT COUNT(*) as count FROM orders');
        const [customers] = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'customer'");
        const [revenue] = await pool.query("SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status != 'Cancelled'");

        res.json({
            totalProducts: products[0]?.count || 0,
            totalOrders: orders[0]?.count || 0,
            totalCustomers: customers[0]?.count || 0,
            totalRevenue: revenue[0]?.total || 0
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET all customers (Admin & Owner)
router.get('/customers', auth, isAdmin, async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT id, name, email, phone, address, created_at FROM users WHERE role = 'customer' ORDER BY created_at DESC"
        );
        res.json(rows || []);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
