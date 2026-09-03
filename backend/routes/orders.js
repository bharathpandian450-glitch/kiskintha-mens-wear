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

        const { items, address, phone } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Order must have at least one item' });
        }

        if (!address || !phone) {
            return res.status(400).json({ message: 'Address and phone are required' });
        }

        // Calculate total
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const paymentMethod = req.body.payment_method || 'UPI QR Payment (bharathpandian450-1@okhdfcbank)';

        // Insert order with initial status: 'Pending Approval'
        const [orderResult] = await pool.query(
            'INSERT INTO orders (user_id, total, address, phone, payment_method, status) VALUES (?, ?, ?, ?, ?, ?)',
            [req.user.id, total, address, phone, paymentMethod, 'Pending Approval']
        );

        const orderId = orderResult.insertId;

        // Import Product model
        const { Product, getIsConnected } = require('../config/mongodb');

        // Insert order items and decrease stock
        for (const item of items) {
            await pool.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price, size) VALUES (?, ?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.price, item.size || 'M']
            );

            // Decrease stock in pool / memoryStore
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

        res.status(201).json({
            message: 'Order placed successfully! Pending Store Owner approval.',
            orderId,
            status: 'Pending Approval'
        });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Server error placing order' });
    }
});

// GET user's orders (Auth required)
router.get('/my', auth, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET all orders (Admin & Owner)
router.get('/', auth, isAdmin, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone as u_phone FROM orders o LEFT JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET order items for a specific order
router.get('/:id/items', auth, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT oi.*, p.name as product_name, p.image FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
            [req.params.id]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching order items:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT update / approve / reject order status (Admin & Owner)
router.put('/:id', auth, isAdmin, async (req, res) => {
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

        // If order was cancelled / rejected, restore product stock
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

        res.json({ message: `Order #${orderId} updated to ${status}`, status });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
