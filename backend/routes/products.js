const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { initialData } = require('../config/db');

// Ensure MongoDB is connected and seeded before route handlers execute
router.use(async (req, res, next) => {
    if (!getIsConnected()) {
        await connectMongoDB(initialData).catch(() => {});
    }
    next();
});

// Multer config for product image uploads
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

// GET all products (Native MongoDB with filters for category, sleeve, color, search)
router.get('/', async (req, res) => {
    try {
        const filter = {};

        if (req.query.category) {
            filter.category_id = Number(req.query.category);
        }

        if (req.query.sleeve_type) {
            filter.sleeve_type = req.query.sleeve_type;
        }

        if (req.query.color) {
            filter.color = new RegExp(`^${req.query.color}$`, 'i');
        }

        if (req.query.search) {
            const searchTerm = req.query.search.trim();
            filter.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { color: { $regex: searchTerm, $options: 'i' } },
                { subcategory: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        let products = await Product.find(filter).sort({ created_at: -1 }).lean();
        
        // Fallback guarantee: if MongoDB yields empty results and no search/category filter is active, serve initialData products
        if ((!products || products.length === 0) && Object.keys(filter).length === 0 && initialData && initialData.products && initialData.products.length > 0) {
            products = initialData.products;
        }
        
        // Fetch categories map for category_name normalization
        const categories = await Category.find({}).lean();
        const catMap = new Map();
        if (categories && categories.length > 0) {
            categories.forEach(c => catMap.set(Number(c.id), c.name));
        } else if (initialData && initialData.categories) {
            initialData.categories.forEach(c => catMap.set(Number(c.id), c.name));
        }

        const formattedProducts = (products || []).map(p => ({
            ...p,
            category_name: p.category_name || catMap.get(Number(p.category_id)) || 'Men Wear'
        }));

        res.json(formattedProducts);
    } catch (error) {
        console.error('Error fetching products from MongoDB:', error);
        // Resilient fallback on error: return initialData products instead of 500
        if (initialData && initialData.products && initialData.products.length > 0) {
            return res.json(initialData.products);
        }
        res.status(500).json({ message: 'Server error fetching products' });
    }
});

// GET single product by ID (Native MongoDB)
router.get('/:id', async (req, res) => {
    try {
        const prod = await Product.findOne({ id: Number(req.params.id) }).lean();

        if (!prod) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (!prod.category_name && prod.category_id) {
            const cat = await Category.findOne({ id: Number(prod.category_id) }).lean();
            if (cat) prod.category_name = cat.name;
        }

        res.json(prod);
    } catch (error) {
        console.error('Error fetching product from MongoDB:', error);
        res.status(500).json({ message: 'Server error fetching product' });
    }
});

// POST create product (Store Owner only - Native MongoDB)
router.post('/', auth, isOwner, upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, category_id, size, stock, color, sleeve_type, subcategory } = req.body;
        const image = req.file ? req.file.filename : '';

        const maxProd = await Product.findOne({}).sort({ id: -1 }).lean();
        const newId = maxProd && maxProd.id ? Number(maxProd.id) + 1 : 1;

        // Resolve Category Name
        let catName = 'Men Wear';
        if (category_id) {
            const cat = await Category.findOne({ id: Number(category_id) }).lean();
            if (cat) catName = cat.name;
        }

        const newProduct = await Product.create({
            id: newId,
            name: name ? name.trim() : 'New Garment Product',
            description: description || '',
            price: parseFloat(price) || 0,
            image,
            category_id: parseInt(category_id) || 1,
            category_name: catName,
            subcategory: subcategory || '',
            sleeve_type: sleeve_type || '',
            size: size || 'S,M,L,XL',
            color: color || 'Assorted',
            stock: parseInt(stock) || 50,
            created_at: new Date()
        });

        res.status(201).json({ message: 'Product created successfully by Owner', id: newProduct.id, product: newProduct });
    } catch (error) {
        console.error('Error creating product in MongoDB:', error);
        res.status(500).json({ message: 'Server error creating product' });
    }
});

// PUT update product (Store Owner only - Native MongoDB)
router.put('/:id', auth, isOwner, upload.single('image'), async (req, res) => {
    try {
        const productId = Number(req.params.id);
        const { name, description, price, category_id, size, stock, color, sleeve_type, subcategory } = req.body;

        const existing = await Product.findOne({ id: productId }).lean();
        if (!existing) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const image = req.file ? req.file.filename : existing.image;

        let catName = existing.category_name || 'Men Wear';
        if (category_id) {
            const cat = await Category.findOne({ id: Number(category_id) }).lean();
            if (cat) catName = cat.name;
        }

        const updateData = {
            name: name ? name.trim() : existing.name,
            description: description !== undefined ? description : existing.description,
            price: price !== undefined ? parseFloat(price) : existing.price,
            image,
            category_id: category_id !== undefined ? parseInt(category_id) : existing.category_id,
            category_name: catName,
            size: size || existing.size,
            color: color || existing.color,
            stock: stock !== undefined ? parseInt(stock) : existing.stock,
            sleeve_type: sleeve_type !== undefined ? sleeve_type : existing.sleeve_type,
            subcategory: subcategory !== undefined ? subcategory : existing.subcategory
        };

        const updatedProd = await Product.findOneAndUpdate(
            { id: productId },
            { $set: updateData },
            { new: true }
        ).lean();

        res.json({ message: 'Product updated successfully by Owner', product: updatedProd });
    } catch (error) {
        console.error('Error updating product in MongoDB:', error);
        res.status(500).json({ message: 'Server error updating product' });
    }
});

// PATCH update product price (Store Owner only - Native MongoDB)
router.patch('/:id/price', auth, isOwner, async (req, res) => {
    try {
        const productId = Number(req.params.id);
        const { price } = req.body;
        const numPrice = parseFloat(price);
        if (isNaN(numPrice) || numPrice < 0) {
            return res.status(400).json({ message: 'Invalid price value' });
        }

        const updated = await Product.findOneAndUpdate(
            { id: productId },
            { $set: { price: numPrice } },
            { new: true }
        ).lean();

        if (!updated) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Price updated successfully in MongoDB', productId, price: numPrice, product: updated });
    } catch (error) {
        console.error('Error updating product price in MongoDB:', error);
        res.status(500).json({ message: 'Server error updating price' });
    }
});

// DELETE product (Store Owner only - Native MongoDB)
router.delete('/:id', auth, isOwner, async (req, res) => {
    try {
        const productId = Number(req.params.id);
        const result = await Product.deleteOne({ id: productId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted by Owner from MongoDB' });
    } catch (error) {
        console.error('Error deleting product from MongoDB:', error);
        res.status(500).json({ message: 'Server error deleting product' });
    }
});

module.exports = router;
