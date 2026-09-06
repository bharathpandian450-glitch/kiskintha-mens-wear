const express = require('express');
const router = express.Router();
const { Product, Order, User, connectMongoDB, getIsConnected } = require('../config/mongodb');
const { initialData } = require('../config/db');
const { auth, isAdmin } = require('../middleware/auth');

router.use(async (req, res, next) => {
    if (!getIsConnected()) {
        await connectMongoDB(initialData).catch(() => {});
    }
    next();
});

// GET dashboard stats (Admin & Owner - Native MongoDB)
router.get('/stats', auth, isAdmin, async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalCustomers = await User.countDocuments({ role: 'customer' });

        const revResult = await Order.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);

        const totalRevenue = revResult.length > 0 ? revResult[0].total : 0;

        res.json({
            totalProducts,
            totalOrders,
            totalCustomers,
            totalRevenue
        });
    } catch (error) {
        console.error('Error fetching admin stats from MongoDB:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET all customers (Admin & Owner - Native MongoDB)
router.get('/customers', auth, isAdmin, async (req, res) => {
    try {
        const customers = await User.find({ role: 'customer' })
            .sort({ created_at: -1 })
            .select('-password')
            .lean();
        res.json(customers || []);
    } catch (error) {
        console.error('Error fetching customers from MongoDB:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
