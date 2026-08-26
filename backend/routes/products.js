const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../config/db');
const { auth, isOwner } = require('../middleware/auth');

// Multer config for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

// GET all products (with optional category and search filters)
router.get('/', async (req, res) => {
    try {
        let sql = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id';
        const conditions = [];
        const params = [];

        if (req.query.category) {
            conditions.push('p.category_id = ?');
            params.push(req.query.category);
        }

        if (req.query.search) {
            conditions.push('(p.name LIKE ? OR p.description LIKE ?)');
            params.push(`%${req.query.search}%`, `%${req.query.search}%`);
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        sql += ' ORDER BY p.created_at DESC';

        const [rows] = await pool.query(sql, params);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET single product by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST create product (Store Owner only)
router.post('/', auth, isOwner, upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, category_id, size, stock } = req.body;
        const image = req.file ? req.file.filename : '';

        const [result] = await pool.query(
            'INSERT INTO products (name, description, price, image, category_id, size, stock) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, description, price, image, category_id, size || 'S,M,L,XL', stock || 0]
        );

        res.status(201).json({ message: 'Product created successfully by Owner', id: result.insertId });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT update product (Store Owner only)
router.put('/:id', auth, isOwner, upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, category_id, size, stock } = req.body;

        const [existing] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const image = req.file ? req.file.filename : existing[0].image;

        await pool.query(
            'UPDATE products SET name = ?, description = ?, price = ?, image = ?, category_id = ?, size = ?, stock = ? WHERE id = ?',
            [name, description, price, image, category_id, size, stock, req.params.id]
        );

        res.json({ message: 'Product updated successfully by Owner' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE product (Store Owner only)
router.delete('/:id', auth, isOwner, async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted by Owner' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
