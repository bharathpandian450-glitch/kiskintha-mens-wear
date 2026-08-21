const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { authenticateAdmin } = require('../middleware/authMiddleware');

// GET /api/categories (Fetch all main categories)
router.get('/', async (req, res) => {
  try {
    const categories = await query('SELECT * FROM categories');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories.', error: error.message });
  }
});

// GET /api/categories/subcategories (Fetch all subcategories or by category_id)
router.get('/subcategories', async (req, res) => {
  try {
    const { category_id, category } = req.query;
    let subcategories = await query('SELECT * FROM subcategories');

    if (category_id) {
      subcategories = subcategories.filter(s => s.category_id == category_id);
    } else if (category) {
      const catMap = {
        'shirts': 1,
        'pants': 2,
        'trousers': 3,
        't-shirts': 4,
        'group-shirts': 5
      };
      const catId = catMap[category.toLowerCase()] || (parseInt(category) ? parseInt(category) : null);
      if (catId) {
        subcategories = subcategories.filter(s => s.category_id == catId);
      }
    }

    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subcategories.', error: error.message });
  }
});

// POST /api/categories (Admin)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { name, slug, description, image } = req.body;
    const result = await query(
      'INSERT INTO categories (name, slug, description, image) VALUES (?, ?, ?, ?)',
      [name, slug || name.toLowerCase().replace(/ /g, '-'), description || '', image || '']
    );
    res.status(201).json({ message: 'Category created successfully!', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating category.', error: error.message });
  }
});

module.exports = router;
