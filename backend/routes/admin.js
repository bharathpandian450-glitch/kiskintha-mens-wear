const express = require('express');
const router = express.Router();
const { Product, Order, User, connectMongoDB, getIsConnected } = require('../config/mongodb');
const { initialData } = require('../config/db');
const { loadPersistentUsers } = require('../config/persistentUsers');
const { loadPersistentOrders } = require('../config/persistentOrders');
const { auth, isAdmin } = require('../middleware/auth');

router.use(async (req, res, next) => {
    if (!getIsConnected()) {
        try { await connectMongoDB(); } catch (e) {}
    }
    next();
});

// GET dashboard stats (Admin & Owner - Native MongoDB + Persistent Backup)
router.get('/stats', auth, isAdmin, async (req, res) => {
    try {
        let totalProducts = 0;
        let totalOrders = 0;
        let totalCustomers = 0;
        let totalRevenue = 0;

        if (getIsConnected()) {
            try {
                totalProducts = await Product.countDocuments();
                totalOrders = await Order.countDocuments();
                totalCustomers = await User.countDocuments({ role: 'customer' });

                const revResult = await Order.aggregate([
                    { $match: { status: { $ne: 'Cancelled' } } },
                    { $group: { _id: null, total: { $sum: '$total' } } }
                ]);
                totalRevenue = revResult.length > 0 ? revResult[0].total : 0;
            } catch (mErr) {}
        }

        const diskOrders = loadPersistentOrders();
        if (diskOrders.length > totalOrders) {
            totalOrders = diskOrders.length;
            const valid = diskOrders.filter(o => (o.status || '').toLowerCase() !== 'cancelled');
            totalRevenue = valid.reduce((sum, o) => sum + Number(o.total || 0), 0);
        }

        const diskCustomers = loadPersistentUsers().filter(u => u.role === 'customer' || (!u.role && u.role !== 'owner' && u.role !== 'admin'));
        if (diskCustomers.length > totalCustomers) {
            totalCustomers = diskCustomers.length;
        }

        res.json({
            totalProducts: totalProducts || initialData.products?.length || 153,
            totalOrders: totalOrders || 0,
            totalCustomers: totalCustomers || 0,
            totalRevenue: totalRevenue || 0
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        const diskOrders = loadPersistentOrders();
        const diskCustomers = loadPersistentUsers().filter(u => u.role !== 'owner' && u.role !== 'admin');
        res.json({
            totalProducts: initialData.products?.length || 153,
            totalOrders: diskOrders.length || 0,
            totalCustomers: diskCustomers.length || 0,
            totalRevenue: 0
        });
    }
});

// GET all customers (Admin & Owner - Native MongoDB + Persistent Backup)
router.get('/customers', auth, isAdmin, async (req, res) => {
    try {
        let mongoCustomers = [];
        if (getIsConnected()) {
            try {
                mongoCustomers = await User.find({ role: 'customer' })
                    .sort({ created_at: -1 })
                    .select('-password')
                    .lean();
            } catch (e) {}
        }

        const diskUsers = loadPersistentUsers().filter(u => u.role !== 'owner' && u.role !== 'admin');
        const userMap = new Map();

        // 1. Add Disk Users (strip password)
        diskUsers.forEach(u => {
            const { password, ...safeUser } = u;
            const key = (u.email || u.id || '').toString().toLowerCase().trim();
            if (key) userMap.set(key, safeUser);
        });

        // 2. Add Mongo Users
        (mongoCustomers || []).forEach(u => {
            const key = (u.email || u.id || '').toString().toLowerCase().trim();
            if (key) userMap.set(key, u);
        });

        const allCustomers = Array.from(userMap.values());
        allCustomers.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

        res.json(allCustomers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        const diskUsers = loadPersistentUsers().filter(u => u.role !== 'owner' && u.role !== 'admin');
        res.json(diskUsers.map(({ password, ...u }) => u));
    }
});

module.exports = router;
