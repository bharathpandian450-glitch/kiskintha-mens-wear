const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { authenticateUser } = require('../middleware/authMiddleware');

// GET /api/cart
router.get('/', authenticateUser, async (req, res) => {
  try {
    const items = await query('SELECT * FROM cart WHERE user_id = ?', [req.user.id]);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart items.', error: error.message });
  }
});

// POST /api/cart
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { productId, size, color, quantity = 1 } = req.body;
    if (!productId || !size || !color) {
      return res.status(400).json({ message: 'Product ID, size, and color are required.' });
    }
    const result = await query(
      'INSERT INTO cart (user_id, product_id, size, color, quantity) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, productId, size, color, quantity]
    );
    res.status(201).json({ message: 'Item added to bag!', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart.', error: error.message });
  }
});

// PUT /api/cart/:id
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { quantity } = req.body;
    await query('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, req.params.id]);
    res.json({ message: 'Bag item quantity updated.' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating item quantity.', error: error.message });
  }
});

// DELETE /api/cart/:id
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    await query('DELETE FROM cart WHERE id = ?', [req.params.id]);
    res.json({ message: 'Item removed from bag.' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing item.', error: error.message });
  }
});

// DELETE /api/cart (Clear all)
router.delete('/', authenticateUser, async (req, res) => {
  try {
    await query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'Bag cleared successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing bag.', error: error.message });
  }
});

module.exports = router;
