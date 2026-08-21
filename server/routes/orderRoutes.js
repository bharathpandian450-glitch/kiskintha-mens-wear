const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { authenticateUser } = require('../middleware/authMiddleware');

// POST /api/orders (Create Order - COD ONLY)
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { items, subtotal, deliveryCharge = 0, discount = 0, totalAmount, shippingDetails } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item.' });
    }

    if (!shippingDetails || !shippingDetails.name || !shippingDetails.phone || !shippingDetails.address) {
      return res.status(400).json({ message: 'Shipping name, mobile phone, and full address are required.' });
    }

    const orderNumber = `ORD-KMW-${Date.now().toString().slice(-6)}`;

    const orderResult = await query(
      `INSERT INTO orders 
      (user_id, order_number, subtotal, delivery_charge, discount, total_amount, payment_method, status, shipping_name, shipping_phone, shipping_email, shipping_address, shipping_city, shipping_state, shipping_pincode) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        orderNumber,
        subtotal,
        deliveryCharge,
        discount,
        totalAmount,
        'Cash on Delivery',
        'Pending',
        shippingDetails.name,
        shippingDetails.phone,
        shippingDetails.email || req.user.email,
        shippingDetails.address,
        shippingDetails.city || 'Chennai',
        shippingDetails.state || 'Tamil Nadu',
        shippingDetails.pincode || '600001'
      ]
    );

    const orderId = orderResult.insertId || Date.now();

    for (const item of items) {
      await query(
        'INSERT INTO order_items (order_id, product_id, product_name, size, color, quantity, price) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          orderId,
          item.product_id || item.id,
          item.product_name || item.name,
          item.size || 'L',
          item.color || 'Standard',
          item.quantity || 1,
          item.price
        ]
      );
    }

    await query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully via Cash on Delivery!',
      orderId,
      orderNumber
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order.', error: error.message });
  }
});

// GET /api/orders (User's Orders)
router.get('/', authenticateUser, async (req, res) => {
  try {
    const orders = await query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order history.', error: error.message });
  }
});

// GET /api/orders/:id (Single Order Details)
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const orders = await query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    const order = orders[0];
    const items = await query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
    res.json({ ...order, items });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order details.', error: error.message });
  }
});

module.exports = router;
