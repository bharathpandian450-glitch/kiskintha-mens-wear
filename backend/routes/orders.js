const express = require('express');
const router = express.Router();
const { Order, Product, User, connectMongoDB, getIsConnected } = require('../config/mongodb');
const { savePersistentOrder, loadPersistentOrders } = require('../config/persistentOrders');
const { auth, isAdmin } = require('../middleware/auth');

// Ensure MongoDB is connected before handling order requests
router.use(async (req, res, next) => {
    if (!getIsConnected()) {
        await connectMongoDB().catch(() => {});
    }
    next();
});

// POST place order (Auth required - Only Customers can place orders - Native MongoDB)
router.post('/', auth, async (req, res) => {
    try {
        if (req.user && (req.user.role === 'owner' || req.user.role === 'admin')) {
            return res.status(403).json({ message: 'Store Owner accounts cannot place orders. Only customers can place orders.' });
        }

        const { items, address, phone, name, email, city, state, pincode, payment_method } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Order must have at least one item' });
        }

        if (!address || !phone) {
            return res.status(400).json({ message: 'Address and phone are required' });
        }

        // Calculate total
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const paymentMethod = payment_method || 'Online Payment (UPI/Cards)';

        // Customer details resolution
        const custName = name || (req.user ? req.user.name : 'Customer');
        const custEmail = email || (req.user ? req.user.email : '');
        const custPhone = phone || (req.user ? req.user.phone : '');
        const custCity = city || 'Chennai';
        const custState = state || 'Tamil Nadu';
        const custPincode = pincode || '600040';

        // Determine unique next order ID in MongoDB
        let maxMongoId = 0;
        if (getIsConnected()) {
            try {
                const maxOrder = await Order.findOne({}).sort({ id: -1 }).lean();
                if (maxOrder && maxOrder.id) maxMongoId = Number(maxOrder.id);
            } catch (e) {}
        }
        
        const diskOrders = loadPersistentOrders();
        const maxDiskId = diskOrders.reduce((max, o) => Math.max(max, Number(o.id || 0)), 0);

        const orderId = Math.max(maxMongoId, maxDiskId, 0) + 1;

        const savedItems = [];

        // Decrease stock in MongoDB Product collection and structure order items
        for (const item of items) {
            let prod = null;
            if (getIsConnected()) {
                try { prod = await Product.findOne({ id: item.product_id }).lean(); } catch (e) {}
            }

            const itemSize = item.size || 'M';
            const itemColor = item.color || (prod ? prod.color : 'Assorted');
            const itemName = item.name || (prod ? prod.name : 'Kiskintha Item');
            const itemImage = item.image || (prod ? prod.image : '');
            const itemCat = item.category_name || (prod ? prod.category_name : 'Men Wear');
            const itemSleeve = item.sleeve_type || (prod ? prod.sleeve_type : '');

            savedItems.push({
                product_id: item.product_id,
                product_name: itemName,
                name: itemName,
                image: itemImage,
                category_name: itemCat,
                sleeve_type: itemSleeve,
                color: itemColor,
                size: itemSize,
                quantity: item.quantity,
                price: item.price
            });

            // Decrease stock in MongoDB if connected
            if (getIsConnected()) {
                try {
                    await Product.findOneAndUpdate(
                        { id: item.product_id, stock: { $gte: item.quantity } },
                        { $inc: { stock: -item.quantity } }
                    );
                } catch (mErr) {
                    console.log('MongoDB Stock Decrement Note:', mErr.message);
                }
            }
        }

        const fullOrderObj = {
            id: orderId,
            user_id: req.user.id,
            customer_name: custName,
            customer_email: custEmail,
            customer_phone: custPhone,
            total,
            status: 'Pending',
            address,
            city: custCity,
            state: custState,
            pincode: custPincode,
            phone: custPhone,
            payment_method: paymentMethod,
            payment_status: 'Paid',
            items: savedItems,
            created_at: new Date()
        };

        // 1. Save to persistent disk storage (orders.json backup)
        savePersistentOrder(fullOrderObj);

        // 2. Save permanently in MongoDB Order Collection if connected
        if (getIsConnected()) {
            try {
                await Order.updateOne({ id: orderId }, { $set: fullOrderObj }, { upsert: true });
                console.log(`✅ Order #${orderId} saved permanently in MongoDB for ${custName}!`);
            } catch (mSaveErr) {
                console.error('MongoDB Order Save Note:', mSaveErr.message);
            }
        }

        res.status(201).json({
            message: 'Order placed successfully! Visible in Owner Portal.',
            orderId,
            status: 'Pending'
        });
    } catch (error) {
        console.error('Error placing order in MongoDB:', error);
        res.status(500).json({ message: 'Server error placing order' });
    }
});

// GET user's orders (Auth required - Customer ONLY sees their own orders - Native MongoDB)
router.get('/my', auth, async (req, res) => {
    try {
        const userEmail = req.user.email ? req.user.email.toLowerCase() : '';
        const userPhone = req.user.phone ? req.user.phone.trim() : '';
        const userName = req.user.name ? req.user.name.toLowerCase().trim() : '';
        const userIdStr = String(req.user.id || '');

        let mongoOrders = [];
        if (getIsConnected()) {
            try {
                const filterOr = [];
                if (req.user.id) {
                    filterOr.push({ user_id: req.user.id });
                    filterOr.push({ user_id: Number(req.user.id) });
                    filterOr.push({ user_id: String(req.user.id) });
                }
                if (userEmail) {
                    filterOr.push({ customer_email: userEmail });
                    filterOr.push({ customer_email: { $regex: new RegExp(`^${userEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } });
                }
                if (userPhone) {
                    filterOr.push({ customer_phone: userPhone });
                    filterOr.push({ phone: userPhone });
                }
                if (userName && userName !== 'customer') {
                    filterOr.push({ customer_name: { $regex: new RegExp(`^${userName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } });
                }

                if (filterOr.length > 0) {
                    mongoOrders = await Order.find({ $or: filterOr }).sort({ created_at: -1 }).lean();
                }

                // If MongoDB $or query returned 0 items, scan all MongoDB orders in memory to avoid index/schema mismatch
                if (!mongoOrders || mongoOrders.length === 0) {
                    const allDbOrders = await Order.find({}).sort({ created_at: -1 }).lean();
                    if (allDbOrders && allDbOrders.length > 0) {
                        mongoOrders = allDbOrders.filter(o => 
                            (userIdStr && String(o.user_id) === userIdStr) ||
                            (userEmail && o.customer_email && o.customer_email.toLowerCase() === userEmail) ||
                            (userPhone && (o.customer_phone === userPhone || o.phone === userPhone)) ||
                            (userName && userName !== 'customer' && o.customer_name && o.customer_name.toLowerCase().includes(userName))
                        );
                    }
                }
            } catch (e) {}
        }

        // Also check disk storage backup with multi-attribute matching
        const diskOrders = loadPersistentOrders().filter(o => {
            if (userIdStr && String(o.user_id) === userIdStr) return true;
            if (userEmail && o.customer_email && o.customer_email.toLowerCase() === userEmail) return true;
            if (userPhone && (o.customer_phone === userPhone || o.phone === userPhone)) return true;
            if (userName && userName !== 'customer' && o.customer_name && o.customer_name.toLowerCase() === userName) return true;
            return false;
        });

        const orderMap = new Map();
        diskOrders.forEach(o => orderMap.set(Number(o.id), o));
        mongoOrders.forEach(o => orderMap.set(Number(o.id), o));

        const myOrders = Array.from(orderMap.values());
        myOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        res.json(myOrders);
    } catch (error) {
        console.error('Error fetching customer orders from MongoDB:', error);
        res.status(500).json({ message: 'Server error fetching orders' });
    }
});

// GET all customer orders (Admin & Owner Only - Native MongoDB)
router.get('/', auth, isAdmin, async (req, res) => {
    try {
        let mongoOrders = [];
        if (getIsConnected()) {
            try {
                mongoOrders = await Order.find({}).sort({ created_at: -1 }).lean();
            } catch (e) {}
        }
        const diskOrders = loadPersistentOrders();

        const orderMap = new Map();

        // 1. Add Disk Orders
        diskOrders.forEach(o => orderMap.set(Number(o.id), o));

        // 2. Add MongoDB Orders
        mongoOrders.forEach(o => orderMap.set(Number(o.id), o));

        const allOrders = Array.from(orderMap.values());
        allOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        res.json(allOrders);
    } catch (error) {
        console.error('Error fetching all customer orders from MongoDB:', error);
        res.status(500).json({ message: 'Server error fetching all orders' });
    }
});

// GET order items for a specific order (Native MongoDB)
router.get('/:id/items', auth, async (req, res) => {
    try {
        const orderId = Number(req.params.id);
        const order = await Order.findOne({ id: orderId }).lean();
        
        if (order && order.items && order.items.length > 0) {
            return res.json(order.items);
        }

        const diskOrders = loadPersistentOrders();
        const diskMatch = diskOrders.find(o => Number(o.id) === orderId);
        if (diskMatch && diskMatch.items) {
            return res.json(diskMatch.items);
        }

        res.json([]);
    } catch (error) {
        console.error('Error fetching order items from MongoDB:', error);
        res.status(500).json({ message: 'Server error fetching order items' });
    }
});

// PUT & PATCH update order status (Admin & Owner - Native MongoDB)
const handleStatusUpdate = async (req, res) => {
    try {
        const { status } = req.body;
        const orderId = Number(req.params.id);

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        let existing = null;
        let previousStatus = null;
        let updatedOrder = null;

        if (getIsConnected()) {
            try {
                existing = await Order.findOne({ id: orderId }).lean();
                previousStatus = existing ? existing.status : null;

                updatedOrder = await Order.findOneAndUpdate(
                    { id: orderId },
                    { $set: { status } },
                    { new: true }
                ).lean();
            } catch (e) {}
        }

        // Update persistent disk storage copy
        const diskOrders = loadPersistentOrders();
        const match = diskOrders.find(o => Number(o.id) === orderId);
        if (match) {
            if (!previousStatus) previousStatus = match.status;
            match.status = status;
            savePersistentOrder(match);
        }

        if (!updatedOrder && !existing && !match) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Restore stock if order was cancelled and MongoDB is connected
        if (status.toLowerCase().includes('cancel') || status.toLowerCase().includes('reject')) {
            if (previousStatus && !previousStatus.toLowerCase().includes('cancel') && !previousStatus.toLowerCase().includes('reject')) {
                const itemsToRestore = updatedOrder ? updatedOrder.items : (existing ? existing.items : (match ? match.items : []));
                if (itemsToRestore && itemsToRestore.length > 0 && getIsConnected()) {
                    for (const item of itemsToRestore) {
                        try {
                            await Product.findOneAndUpdate(
                                { id: item.product_id },
                                { $inc: { stock: item.quantity } }
                            );
                        } catch (e) {}
                    }
                }
            }
        }

        res.json({ message: `Order #${orderId} status updated to ${status} in MongoDB`, status });
    } catch (error) {
        console.error('Error updating order status in MongoDB:', error);
        res.status(500).json({ message: 'Server error updating order status' });
    }
};

router.put('/:id', auth, isAdmin, handleStatusUpdate);
router.patch('/:id/status', auth, isAdmin, handleStatusUpdate);

module.exports = router;
