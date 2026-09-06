const express = require('express');
const router = express.Router();
const { Category, connectMongoDB, getIsConnected } = require('../config/mongodb');
const { initialData } = require('../config/db');
const { auth, isOwner } = require('../middleware/auth');

// Middleware to ensure MongoDB is connected before running operations
router.use(async (req, res, next) => {
    if (!getIsConnected()) {
        await connectMongoDB(initialData).catch(() => {});
    }
    next();
});

// GET all categories (Native MongoDB)
router.get('/', async (req, res) => {
    try {
        let categories = await Category.find({}).sort({ name: 1 }).lean();
        if ((!categories || categories.length === 0) && initialData && initialData.categories) {
            categories = initialData.categories;
        }
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories from MongoDB:', error);
        if (initialData && initialData.categories) {
            return res.json(initialData.categories);
        }
        res.status(500).json({ message: 'Server error fetching categories' });
    }
});

// POST create category (Store Owner only - Native MongoDB)
router.post('/', auth, isOwner, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const maxCat = await Category.findOne({}).sort({ id: -1 }).lean();
        const newId = maxCat && maxCat.id ? Number(maxCat.id) + 1 : 1;

        const newCategory = await Category.create({
            id: newId,
            name: name.trim()
        });

        res.status(201).json({ message: 'Category created successfully by Owner', id: newCategory.id, category: newCategory });
    } catch (error) {
        console.error('Error creating category in MongoDB:', error);
        res.status(500).json({ message: 'Server error creating category' });
    }
});

// DELETE category (Store Owner only - Native MongoDB)
router.delete('/:id', auth, isOwner, async (req, res) => {
    try {
        const result = await Category.deleteOne({ id: Number(req.params.id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ message: 'Category deleted successfully by Owner' });
    } catch (error) {
        console.error('Error deleting category from MongoDB:', error);
        res.status(500).json({ message: 'Server error deleting category' });
    }
});

module.exports = router;
