const express = require('express');
const router = express.Router();
const { Product, Order, User, connectMongoDB, getIsConnected } = require('../config/mongodb');
const { loadPersistentOrders } = require('../config/persistentOrders');
const { initialData } = require('../config/db');
const { auth, isOwner } = require('../middleware/auth');

router.use((req, res, next) => {
    if (!getIsConnected()) {
        connectMongoDB(initialData).catch(() => {});
    }
    next();
});

// GET Store Owner Financial & Executive Stats (Native MongoDB)
router.get('/overview', auth, isOwner, async (req, res) => {
    try {
        let totalProducts = 0;
        let totalOrders = 0;
        let totalCustomers = 0;
        let totalAdmins = 1;
        let totalRevenue = 0;

        try {
            totalProducts = await Product.countDocuments();
            totalOrders = await Order.countDocuments();
            totalCustomers = await User.countDocuments({ role: 'customer' });
            totalAdmins = await User.countDocuments({ role: 'admin' });

            const revResult = await Order.aggregate([
                { $match: { status: { $ne: 'Cancelled' } } },
                { $group: { _id: null, total: { $sum: '$total' } } }
            ]);
            totalRevenue = revResult.length > 0 ? revResult[0].total : 0;
        } catch (dbErr) {
            console.error('MongoDB aggregation error in owner overview:', dbErr.message);
        }

        if (!totalProducts && initialData && initialData.products) {
            totalProducts = initialData.products.length;
        }

        const diskOrders = loadPersistentOrders();
        if (diskOrders.length > totalOrders) {
            totalOrders = diskOrders.length;
            const validOrders = diskOrders.filter(o => (o.status || '').toLowerCase() !== 'cancelled');
            totalRevenue = validOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
        }

        res.json({
            ownerName: req.user.name || 'Kiskintha (Store Owner)',
            shopName: 'Kiskintha Mens Wear',
            totalProducts: totalProducts || 153,
            totalOrders: totalOrders || 0,
            totalCustomers: totalCustomers || 0,
            totalAdmins: totalAdmins || 1,
            totalRevenue: totalRevenue || 0
        });
    } catch (error) {
        console.error('Error fetching owner overview from MongoDB:', error);
        const diskOrders = loadPersistentOrders();
        const validOrders = diskOrders.filter(o => (o.status || '').toLowerCase() !== 'cancelled');
        const fallbackRev = validOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
        res.json({
            ownerName: req.user.name || 'Kiskintha (Store Owner)',
            shopName: 'Kiskintha Mens Wear',
            totalProducts: initialData.products?.length || 153,
            totalOrders: diskOrders.length || 0,
            totalCustomers: 1,
            totalAdmins: 1,
            totalRevenue: fallbackRev || 0
        });
    }
});

// GET all customer orders for Store Owner (Native MongoDB + Persistent Backup)
router.get('/orders', auth, isOwner, async (req, res) => {
    try {
        let mongoOrders = [];
        if (getIsConnected()) {
            try {
                mongoOrders = await Order.find({}).sort({ created_at: -1 }).lean();
            } catch (e) {}
        }
        const diskOrders = loadPersistentOrders();
        const orderMap = new Map();
        diskOrders.forEach(o => orderMap.set(Number(o.id), o));
        mongoOrders.forEach(o => orderMap.set(Number(o.id), o));
        const allOrders = Array.from(orderMap.values());
        allOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        res.json(allOrders);
    } catch (error) {
        console.error('Error fetching owner orders:', error);
        res.status(500).json({ message: 'Server error fetching owner orders' });
    }
});

// GET all admins and staff (Owner only - Native MongoDB)
router.get('/staff', auth, isOwner, async (req, res) => {
    try {
        const staff = await User.find({ role: { $in: ['admin', 'owner'] } })
            .sort({ id: 1 })
            .select('-password')
            .lean();
        res.json(staff || []);
    } catch (error) {
        console.error('Error fetching staff from MongoDB:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
