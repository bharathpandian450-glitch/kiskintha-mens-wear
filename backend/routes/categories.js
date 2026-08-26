const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { auth, isOwner } = require('../middleware/auth');

// GET all categories
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM categories ORDER BY name');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST create category (Store Owner only)
router.post('/', auth, isOwner, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const [result] = await pool.query('INSERT INTO categories (name) VALUES (?)', [name]);
        res.status(201).json({ message: 'Category created by Owner', id: result.insertId });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE category (Store Owner only)
router.delete('/:id', auth, isOwner, async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ message: 'Category deleted by Owner' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
