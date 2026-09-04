const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { auth, isAdmin } = require('../middleware/auth');

// POST place order (Auth required) - Only Customers can place orders
router.post('/', auth, async (req, res) => {
    try {
        if (req.user && (req.user.role === 'owner' || req.user.role === 'admin')) {
            return res.status(403).json({ message: 'Store Owner accounts cannot place orders. Only customers can place orders.' });
        }

        const { items, address, phone, name, email, city, state, pincode } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Order must have at least one item' });
        }

        if (!address || !phone) {
            return res.status(400).json({ message: 'Address and phone are required' });
        }

        // Calculate total
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const paymentMethod = req.body.payment_method || 'Cash on Delivery (COD)';

        // Import Product and Order models
        const { Product, Order, getIsConnected } = require('../config/mongodb');
        const { memoryStore } = require('../config/db');

        // Customer details resolution
        const custName = name || (req.user ? req.user.name : 'Customer');
        const custEmail = email || (req.user ? req.user.email : '');
        const custPhone = phone || (req.user ? req.user.phone : '');
        const custCity = city || 'Chennai';
        const custState = state || 'Tamil Nadu';
        const custPincode = pincode || '600040';

        // Determine unique next order ID to prevent MongoDB duplicate key errors
        let maxMongoId = 0;
        if (getIsConnected()) {
            try {
                const lastOrder = await Order.findOne({}).sort({ id: -1 }).lean();
                if (lastOrder && lastOrder.id) {
                    maxMongoId = Number(lastOrder.id);
                }
            } catch (err) {}
        }

        let maxMemId = 0;
        if (memoryStore && memoryStore.orders) {
            maxMemId = memoryStore.orders.reduce((max, o) => Math.max(max, Number(o.id || 0)), 0);
        }

        const orderId = Math.max(maxMongoId, maxMemId, 0) + 1;

        // Insert order into memoryStore / pool with guaranteed unique ID and full customer details
        const newOrderObj = {
            id: orderId,
            user_id: req.user.id,
            customer_name: custName,
            customer_email: custEmail,
            customer_phone: custPhone,
            total,
            address,
            city: custCity,
            state: custState,
            pincode: custPincode,
            phone: custPhone,
            payment_method: paymentMethod,
            status: 'Pending',
            created_at: new Date()
        };

        if (memoryStore && memoryStore.orders) {
            memoryStore.orders.unshift(newOrderObj);
        }

        const savedItems = [];

        // Insert order items and decrease stock
        for (const item of items) {
            // Find product details
            const [pRows] = await pool.query('SELECT * FROM products WHERE id = ?', [item.product_id]);
            const prod = pRows && pRows[0] ? pRows[0] : null;

            const itemSize = item.size || 'M';
            const itemColor = item.color || (prod ? prod.color : 'Assorted');
            const itemName = item.name || (prod ? prod.name : 'Kiskintha Item');
            const itemImage = item.image || (prod ? prod.image : '');
            const itemCat = prod ? (prod.category_name || 'Men Wear') : 'Men Wear';

            if (memoryStore && memoryStore.order_items) {
                memoryStore.order_items.push({
                    id: memoryStore.order_items.length + 1,
                    order_id: orderId,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.price,
                    size: itemSize,
                    color: itemColor,
                    product_name: itemName,
                    image: itemImage
                });
            }

            savedItems.push({
                product_id: item.product_id,
                product_name: itemName,
                name: itemName,
                image: itemImage,
                category_name: itemCat,
                color: itemColor,
                size: itemSize,
                quantity: item.quantity,
                price: item.price
            });

            // Decrease stock in memoryStore
            await pool.query(
                'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?',
                [item.quantity, item.product_id, item.quantity]
            );

            // Decrease stock in live MongoDB Product collection
            if (getIsConnected()) {
                try {
                    await Product.findOneAndUpdate(
                        { id: item.product_id },
                        { $inc: { stock: -item.quantity } }
                    );
                } catch (mErr) {
                    console.log('MongoDB Stock Decrement Note:', mErr.message);
                }
            }
        }

        // Save order permanently in MongoDB with complete customer details
        if (getIsConnected()) {
            try {
                await Order.create({
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
                    items: savedItems,
                    created_at: new Date()
                });
                console.log(`✅ Order #${orderId} saved permanently in MongoDB with customer details (${custName})!`);
            } catch (mongoErr) {
                console.log('MongoDB Order save note:', mongoErr.message);
            }
        }

        res.status(201).json({
            message: 'Order placed successfully! Visible in Owner Portal.',
            orderId,
            status: 'Pending'
        });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Server error placing order' });
    }
});

// GET user's orders (Auth required - Customer ONLY sees their own orders)
router.get('/my', auth, async (req, res) => {
    try {
        const { Order, getIsConnected } = require('../config/mongodb');
        let mongoOrders = [];
        if (getIsConnected()) {
            try {
                mongoOrders = await Order.find({ user_id: req.user.id }).sort({ created_at: -1 }).lean();
            } catch (mErr) {
                console.log('MongoDB user orders fetch note:', mErr.message);
            }
        }

        const [memOrders] = await pool.query(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );

        for (const order of memOrders) {
            const [items] = await pool.query(
                'SELECT oi.*, p.name as product_name, p.image, p.color, p.category_name, p.category_id FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
                [order.id]
            );
            order.items = items || [];
        }

        const orderMap = new Map();
        if (mongoOrders && mongoOrders.length > 0) {
            mongoOrders.forEach(o => orderMap.set(Number(o.id), o));
        }
        if (memOrders && memOrders.length > 0) {
            memOrders.forEach(o => {
                if (!orderMap.has(Number(o.id))) orderMap.set(Number(o.id), o);
            });
        }

        const myOrders = Array.from(orderMap.values());
        myOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        res.json(myOrders);
    } catch (error) {
        console.error('Error fetching customer orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET all customer orders (Admin & Owner Only - Unified MongoDB + MemoryStore Order Fetch)
router.get('/', auth, isAdmin, async (req, res) => {
    try {
        const { Order, getIsConnected } = require('../config/mongodb');

        let mongoOrders = [];
        if (getIsConnected()) {
            try {
                mongoOrders = await Order.find({}).sort({ created_at: -1 }).lean();
            } catch (mErr) {
                console.log('MongoDB all orders fetch note:', mErr.message);
            }
        }

        // Fetch memoryStore orders
        const [memOrders] = await pool.query(
            'SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone as u_phone FROM orders o LEFT JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC'
        );

        for (const order of memOrders) {
            const [items] = await pool.query(
                'SELECT oi.*, p.name as product_name, p.image, p.color, p.category_name, p.category_id FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
                [order.id]
            );
            order.items = items || [];
        }

        // Combine MongoDB & MemoryStore orders uniquely by order.id
        const orderMap = new Map();

        // 1. Add MongoDB orders
        if (mongoOrders && mongoOrders.length > 0) {
            for (const o of mongoOrders) {
                orderMap.set(Number(o.id), {
                    ...o,
                    id: Number(o.id),
                    customer_name: o.customer_name || 'Customer',
                    customer_email: o.customer_email || '',
                    customer_phone: o.customer_phone || o.phone || '',
                    phone: o.phone || o.customer_phone || '',
                    address: o.address || '',
                    city: o.city || 'Chennai',
                    state: o.state || 'Tamil Nadu',
                    pincode: o.pincode || '600040',
                    total: Number(o.total || 0),
                    payment_status: o.payment_status || 'Paid',
                    payment_method: o.payment_method || 'Online Payment',
                    status: o.status || 'Pending',
                    created_at: o.created_at || new Date(),
                    items: o.items || []
                });
            }
        }

        // 2. Add MemoryStore orders (fill in any order not in MongoDB or update items)
        if (memOrders && memOrders.length > 0) {
            for (const o of memOrders) {
                const oid = Number(o.id);
                if (!orderMap.has(oid)) {
                    orderMap.set(oid, {
                        ...o,
                        id: oid,
                        customer_name: o.customer_name || 'Customer',
                        customer_email: o.customer_email || '',
                        customer_phone: o.phone || o.u_phone || '',
                        phone: o.phone || o.u_phone || '',
                        address: o.address || '',
                        city: o.city || 'Chennai',
                        state: o.state || 'Tamil Nadu',
                        pincode: o.pincode || '600040',
                        total: Number(o.total || 0),
                        payment_status: o.payment_status || 'Paid',
                        payment_method: o.payment_method || 'Online Payment',
                        status: o.status || 'Pending',
                        created_at: o.created_at || new Date(),
                        items: o.items || []
                    });

                    // Sync this missing order into MongoDB if DB is connected
                    if (getIsConnected()) {
                        try {
                            await Order.create({
                                id: oid,
                                user_id: o.user_id,
                                customer_name: o.customer_name || 'Customer',
                                customer_email: o.customer_email || '',
                                customer_phone: o.phone || '',
                                total: Number(o.total || 0),
                                status: o.status || 'Pending',
                                address: o.address || '',
                                city: o.city || 'Chennai',
                                state: o.state || 'Tamil Nadu',
                                pincode: o.pincode || '600040',
                                phone: o.phone || '',
                                payment_method: o.payment_method || 'Online Payment',
                                items: o.items || [],
                                created_at: o.created_at || new Date()
                            });
                        } catch (sErr) {}
                    }
                }
            }
        }

        // Convert map to array and sort newest first
        const allOrders = Array.from(orderMap.values());
        allOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        res.json(allOrders);
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET order items for a specific order
router.get('/:id/items', auth, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT oi.*, p.name as product_name, p.image, p.color, p.category_name, p.category_id FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
            [req.params.id]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching order items:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT & PATCH update order status (Admin & Owner)
const handleStatusUpdate = async (req, res) => {
    try {
        const { status } = req.body;
        const orderId = req.params.id;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        // Fetch current order status
        const [existing] = await pool.query('SELECT status FROM orders WHERE id = ?', [orderId]);
        const previousStatus = existing && existing[0] ? existing[0].status : null;

        const [result] = await pool.query(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, orderId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update in live MongoDB Order collection if connected
        const { Order, getIsConnected } = require('../config/mongodb');
        if (getIsConnected()) {
            try {
                await Order.findOneAndUpdate(
                    { id: Number(orderId) },
                    { $set: { status } }
                );
            } catch (mongoErr) {
                console.log('MongoDB Order status update note:', mongoErr.message);
            }
        }

        // If order was cancelled, restore product stock
        if (status.toLowerCase().includes('cancel') || status.toLowerCase().includes('reject')) {
            if (previousStatus && !previousStatus.toLowerCase().includes('cancel') && !previousStatus.toLowerCase().includes('reject')) {
                const [items] = await pool.query('SELECT product_id, quantity FROM order_items WHERE order_id = ?', [orderId]);
                if (items && items.length > 0) {
                    for (const item of items) {
                        await pool.query('UPDATE products SET stock = stock + ? WHERE id = ?', [item.quantity, item.product_id]);
                    }
                }
            }
        }

        res.json({ message: `Order #${orderId} status updated to ${status}`, status });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

router.put('/:id', auth, isAdmin, handleStatusUpdate);
router.patch('/:id/status', auth, isAdmin, handleStatusUpdate);

module.exports = router;
