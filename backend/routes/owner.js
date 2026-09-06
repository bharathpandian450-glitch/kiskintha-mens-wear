const express = require('express');
const router = express.Router();
const { Product, Order, User, connectMongoDB, getIsConnected } = require('../config/mongodb');
const { auth, isOwner } = require('../middleware/auth');

router.use(async (req, res, next) => {
    if (!getIsConnected()) {
        await connectMongoDB().catch(() => {});
    }
    next();
});

// GET Store Owner Financial & Executive Stats (Native MongoDB)
router.get('/overview', auth, isOwner, async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalCustomers = await User.countDocuments({ role: 'customer' });
        const totalAdmins = await User.countDocuments({ role: 'admin' });

        const revResult = await Order.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);

        const totalRevenue = revResult.length > 0 ? revResult[0].total : 0;

        res.json({
            ownerName: req.user.name,
            shopName: 'Kiskintha Mens Wear',
            totalProducts,
            totalOrders,
            totalCustomers,
            totalAdmins,
            totalRevenue
        });
    } catch (error) {
        console.error('Error fetching owner overview from MongoDB:', error);
        res.status(500).json({ message: 'Server error' });
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
