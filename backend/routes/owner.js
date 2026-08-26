const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { auth, isOwner } = require('../middleware/auth');

// GET Store Owner Financial & Executive Stats
router.get('/overview', auth, isOwner, async (req, res) => {
    try {
        const [stats] = await pool.query('SELECT COUNT(*) as count FROM products');
        if (stats && stats[0] && typeof stats[0].totalRevenue !== 'undefined') {
            return res.json({
                ...stats[0],
                ownerName: req.user.name,
                shopName: 'Kiskintha Mens Wear'
            });
        }

        const [products] = await pool.query('SELECT COUNT(*) as count FROM products');
        const [orders] = await pool.query('SELECT COUNT(*) as count FROM orders');
        const [customers] = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'customer'");
        const [admins] = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");
        const [revenue] = await pool.query("SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status != 'Cancelled'");

        res.json({
            ownerName: req.user.name,
            shopName: 'Kiskintha Mens Wear',
            totalProducts: products[0]?.count || 0,
            totalOrders: orders[0]?.count || 0,
            totalCustomers: customers[0]?.count || 0,
            totalAdmins: admins[0]?.count || 0,
            totalRevenue: revenue[0]?.total || 0
        });
    } catch (error) {
        console.error('Error fetching owner overview:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET all admins and staff (Owner only)
router.get('/staff', auth, isOwner, async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT id, name, email, phone, role, created_at FROM users WHERE role IN ('admin', 'owner') ORDER BY id ASC"
        );
        res.json(rows || []);
    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
