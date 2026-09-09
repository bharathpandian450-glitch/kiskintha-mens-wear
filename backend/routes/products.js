const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { Product, Category, connectMongoDB, getIsConnected } = require('../config/mongodb');
const { auth, isOwner } = require('../middleware/auth');
const { initialData } = require('../config/db');
const { savePersistentProduct, loadPersistentProducts, deletePersistentProduct } = require('../config/persistentProducts');

// Non-blocking background MongoDB check
router.use((req, res, next) => {
    if (!getIsConnected()) {
        connectMongoDB(initialData).catch(() => {});
    }
    next();
});

const os = require('os');
const fs = require('fs');

const uploadsDir = process.env.VERCEL 
    ? path.join(os.tmpdir(), 'uploads')
    : path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadsDir)) {
    try { fs.mkdirSync(uploadsDir, { recursive: true }); } catch (e) {}
}

// Multer config for product image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + (file.originalname || 'image.jpg').replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

// GET all products (Native MongoDB with filters for category, sleeve, color, search)
router.get('/', async (req, res) => {
    try {
        const filter = {};

        if (req.query.category) {
            const catParam = req.query.category;
            if (catParam === 'shirts-full') {
                filter.$or = [{ category_id: 2 }, { category_id: '2' }, { category_name: /^shirts$/i }];
                filter.sleeve_type = 'Full Hand';
            } else if (catParam === 'shirts-half') {
                filter.$or = [{ category_id: 2 }, { category_id: '2' }, { category_name: /^shirts$/i }];
                filter.sleeve_type = 'Half Hand';
            } else if (catParam === 'tshirts-full') {
                filter.$or = [{ category_id: 1 }, { category_id: '1' }, { category_name: /^t-shirts$/i }];
                filter.sleeve_type = 'Full Hand';
            } else if (catParam === 'tshirts-half') {
                filter.$or = [{ category_id: 1 }, { category_id: '1' }, { category_name: /^t-shirts$/i }];
                filter.sleeve_type = 'Half Hand';
            } else if (!isNaN(Number(catParam))) {
                const numCat = Number(catParam);
                filter.$or = [{ category_id: numCat }, { category_id: String(numCat) }];
            } else {
                const catLower = catParam.toLowerCase();
                if (catLower.includes('group')) {
                    filter.$or = [{ category_id: 8 }, { category_id: '8' }, { category_name: /group/i }];
                } else if (catLower.includes('t-shirt') || catLower.includes('tshirt')) {
                    filter.$or = [{ category_id: 1 }, { category_id: '1' }, { category_name: /t-shirt/i }];
                } else if (catLower.includes('shirt')) {
                    filter.$or = [{ category_id: 2 }, { category_id: '2' }, { category_name: /^shirts$/i }];
                } else if (catLower.includes('pant')) {
                    filter.$or = [{ category_id: 3 }, { category_id: '3' }, { category_name: /pant/i }];
                } else if (catLower.includes('trouser')) {
                    filter.$or = [{ category_id: 4 }, { category_id: '4' }, { category_name: /trouser/i }];
                } else if (catLower.includes('hoodie')) {
                    filter.$or = [{ category_id: 7 }, { category_id: '7' }, { category_name: /hoodie/i }];
                }
            }
        }

        if (req.query.sleeve_type) {
            filter.sleeve_type = req.query.sleeve_type;
        }

        if (req.query.subcategory && req.query.subcategory !== 'All') {
            filter.subcategory = new RegExp(`^${req.query.subcategory.trim()}$`, 'i');
        }

        if (req.query.color && req.query.color !== 'All') {
            filter.color = new RegExp(`^${req.query.color.trim()}$`, 'i');
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

        if (!getIsConnected()) {
            await connectMongoDB().catch(() => {});
        }

        let mongoProducts = [];
        if (getIsConnected()) {
            try {
                mongoProducts = await Product.find({}).sort({ created_at: -1 }).lean();
            } catch (pErr) {}
        }
        
        const persistentProds = loadPersistentProducts();

        // Build master products map with layered priority: initialData < persistentProds < mongoProducts
        const productMap = new Map();
        (initialData.products || []).forEach(p => productMap.set(Number(p.id), { ...p }));
        persistentProds.forEach(p => productMap.set(Number(p.id), { ...productMap.get(Number(p.id)), ...p }));
        mongoProducts.forEach(p => productMap.set(Number(p.id), { ...productMap.get(Number(p.id)), ...p }));

        let products = Array.from(productMap.values());

        // Apply filters in-memory if query parameters are present
        if (req.query.category) {
            const catParam = req.query.category;
            if (catParam === 'shirts-full') {
                products = products.filter(p => (Number(p.category_id) === 2 || /shirts/i.test(p.category_name)) && p.sleeve_type === 'Full Hand');
            } else if (catParam === 'shirts-half') {
                products = products.filter(p => (Number(p.category_id) === 2 || /shirts/i.test(p.category_name)) && p.sleeve_type === 'Half Hand');
            } else if (catParam === 'tshirts-full') {
                products = products.filter(p => (Number(p.category_id) === 1 || /t-shirts/i.test(p.category_name)) && p.sleeve_type === 'Full Hand');
            } else if (catParam === 'tshirts-half') {
                products = products.filter(p => (Number(p.category_id) === 1 || /t-shirts/i.test(p.category_name)) && p.sleeve_type === 'Half Hand');
            } else if (!isNaN(Number(catParam))) {
                const numCat = Number(catParam);
                products = products.filter(p => Number(p.category_id) === numCat);
            } else {
                const catLower = catParam.toLowerCase();
                if (catLower.includes('group')) {
                    products = products.filter(p => Number(p.category_id) === 8 || /group/i.test(p.category_name));
                } else if (catLower.includes('t-shirt') || catLower.includes('tshirt')) {
                    products = products.filter(p => Number(p.category_id) === 1 || /t-shirt/i.test(p.category_name));
                } else if (catLower.includes('shirt')) {
                    products = products.filter(p => Number(p.category_id) === 2 || /shirts/i.test(p.category_name));
                } else if (catLower.includes('pant')) {
                    products = products.filter(p => Number(p.category_id) === 3 || /pant/i.test(p.category_name));
                } else if (catLower.includes('trouser')) {
                    products = products.filter(p => Number(p.category_id) === 4 || /trouser/i.test(p.category_name));
                } else if (catLower.includes('hoodie')) {
                    products = products.filter(p => Number(p.category_id) === 7 || /hoodie/i.test(p.category_name));
                }
            }
        }

        if (req.query.sleeve_type) {
            products = products.filter(p => p.sleeve_type === req.query.sleeve_type);
        }

        if (req.query.subcategory && req.query.subcategory !== 'All') {
            const sub = req.query.subcategory.trim().toLowerCase();
            products = products.filter(p => (p.subcategory || '').toLowerCase() === sub);
        }

        if (req.query.color && req.query.color !== 'All') {
            const col = req.query.color.trim().toLowerCase();
            products = products.filter(p => (p.color || '').toLowerCase().includes(col));
        }

        if (req.query.search) {
            const term = req.query.search.trim().toLowerCase();
            products = products.filter(p => 
                (p.name || '').toLowerCase().includes(term) ||
                (p.description || '').toLowerCase().includes(term) ||
                (p.color || '').toLowerCase().includes(term) ||
                (p.subcategory || '').toLowerCase().includes(term)
            );
        }

        // Fetch categories map for category_name normalization
        const catMap = new Map();
        if (getIsConnected()) {
            try {
                const categories = await Category.find({}).lean();
                if (categories && categories.length > 0) {
                    categories.forEach(c => catMap.set(Number(c.id), c.name));
                }
            } catch (e) {}
        }
        if (catMap.size === 0 && initialData && initialData.categories) {
            initialData.categories.forEach(c => catMap.set(Number(c.id), c.name));
        }

        const formattedProducts = (products || []).map(p => ({
            ...p,
            category_name: p.category_name || catMap.get(Number(p.category_id)) || 'Men Wear'
        }));

        res.json(formattedProducts);
    } catch (error) {
        console.error('Error fetching products from MongoDB:', error);
        if (initialData && initialData.products && initialData.products.length > 0) {
            return res.json(initialData.products);
        }
        res.status(500).json({ message: 'Server error fetching products' });
    }
});

// GET single product by ID (Native MongoDB)
router.get('/:id', async (req, res) => {
    try {
        let prod = null;
        if (getIsConnected()) {
            try { prod = await Product.findOne({ id: Number(req.params.id) }).lean(); } catch (e) {}
        }
        if (!prod && initialData && initialData.products) {
            prod = initialData.products.find(p => Number(p.id) === Number(req.params.id));
        }

        if (!prod) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (!prod.category_name && prod.category_id) {
            if (getIsConnected()) {
                try {
                    const cat = await Category.findOne({ id: Number(prod.category_id) }).lean();
                    if (cat) prod.category_name = cat.name;
                } catch (e) {}
            }
        }

        res.json(prod);
    } catch (error) {
        console.error('Error fetching product from MongoDB:', error);
        if (initialData && initialData.products) {
            const fallbackProd = initialData.products.find(p => Number(p.id) === Number(req.params.id));
            if (fallbackProd) return res.json(fallbackProd);
        }
        res.status(500).json({ message: 'Server error fetching product' });
    }
});

// Safe Multer upload middleware to catch boundary or upload errors gracefully
const handleUpload = (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.log('Multer upload note (proceeding with text fields):', err.message);
        }
        next();
    });
};

// POST create product (Store Owner only - Native MongoDB)
router.post('/', auth, isOwner, handleUpload, async (req, res) => {
    try {
        const { name, description, price, category_id, size, stock, color, sleeve_type, subcategory } = req.body || {};
        const image = req.file ? req.file.filename : '';

        let maxMongoId = 0;
        if (getIsConnected()) {
            try {
                const maxProd = await Product.findOne({}).sort({ id: -1 }).lean();
                if (maxProd && maxProd.id) maxMongoId = Number(maxProd.id);
            } catch (e) {}
        }
        
        let maxDiskId = 0;
        if (initialData && initialData.products) {
            maxDiskId = initialData.products.reduce((max, p) => Math.max(max, Number(p.id || 0)), 0);
        }
        const newId = Math.max(maxMongoId, maxDiskId, 0) + 1;

        // Resolve Category Name
        const numCatId = parseInt(category_id) || 1;
        let catName = 'Men Wear';
        if (numCatId === 2) catName = 'Shirts';
        else if (numCatId === 1) catName = 'T-Shirts';
        else if (numCatId === 3) catName = 'Pants';
        else if (numCatId === 4) catName = 'Trousers';
        else if (numCatId === 7) catName = 'Hoodies';
        else if (numCatId === 8) catName = 'Group Shirts';

        if (getIsConnected()) {
            try {
                const cat = await Category.findOne({ id: numCatId }).lean();
                if (cat) catName = cat.name;
            } catch (e) {}
        }

        const newProductObj = {
            id: newId,
            name: name ? name.trim() : 'New Garment Product',
            description: description || '',
            price: parseFloat(price) || 0,
            image,
            category_id: numCatId,
            category_name: catName,
            subcategory: subcategory || '',
            sleeve_type: sleeve_type || 'Full Hand',
            size: size || 'S,M,L,XL',
            color: color || 'Blue',
            stock: parseInt(stock) || 50,
            created_at: new Date()
        };

        // 1. Save to persistent disk storage (products.json backup)
        savePersistentProduct(newProductObj);

        // 2. Save in live MongoDB collection
        if (!getIsConnected()) {
            await connectMongoDB().catch(() => {});
        }
        if (getIsConnected()) {
            try {
                await Product.create(newProductObj);
            } catch (mErr) {
                console.error('MongoDB product create note:', mErr.message);
            }
        }

        if (initialData && initialData.products) {
            initialData.products.unshift(newProductObj);
        }

        res.status(201).json({ message: 'Product created successfully by Owner', id: newId, product: newProductObj });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Server error creating product' });
    }
});

// PUT update product (Store Owner & Admin - Native MongoDB & Persistent Storage)
router.put('/:id', auth, isOwner, handleUpload, async (req, res) => {
    try {
        const productId = Number(req.params.id);
        const { name, description, price, category_id, size, stock, color, sleeve_type, subcategory } = req.body || {};

        let existing = null;
        if (getIsConnected()) {
            try {
                existing = await Promise.race([
                    Product.findOne({ id: productId }).lean(),
                    new Promise((resolve) => setTimeout(() => resolve(null), 1200))
                ]);
            } catch (e) {}
        }
        if (!existing) {
            const diskProds = loadPersistentProducts();
            existing = diskProds.find(p => Number(p.id) === productId);
        }
        if (!existing && initialData && initialData.products) {
            existing = initialData.products.find(p => Number(p.id) === productId);
        }

        const image = req.file ? req.file.filename : (existing ? existing.image : '');

        const numCatId = category_id !== undefined ? parseInt(category_id) : (existing ? existing.category_id : 1);
        let catName = existing ? existing.category_name : 'Men Wear';
        if (numCatId === 2) catName = 'Shirts';
        else if (numCatId === 1) catName = 'T-Shirts';
        else if (numCatId === 3) catName = 'Pants';
        else if (numCatId === 4) catName = 'Trousers';
        else if (numCatId === 7) catName = 'Hoodies';
        else if (numCatId === 8) catName = 'Group Shirts';

        if (getIsConnected()) {
            try {
                const cat = await Promise.race([
                    Category.findOne({ id: numCatId }).lean(),
                    new Promise((resolve) => setTimeout(() => resolve(null), 800))
                ]);
                if (cat) catName = cat.name;
            } catch (e) {}
        }

        const updateData = {
            id: productId,
            name: name ? name.trim() : (existing ? existing.name : 'Garment Product'),
            description: description !== undefined ? description : (existing ? existing.description : ''),
            price: price !== undefined ? parseFloat(price) : (existing ? existing.price : 0),
            category_id: numCatId,
            category_name: catName,
            size: size || (existing ? existing.size : 'S,M,L,XL'),
            color: color || (existing ? existing.color : 'Assorted'),
            stock: stock !== undefined ? parseInt(stock) : (existing ? existing.stock : 50),
            sleeve_type: sleeve_type !== undefined ? sleeve_type : (existing ? existing.sleeve_type : ''),
            subcategory: subcategory !== undefined ? subcategory : (existing ? existing.subcategory : '')
        };
        if (image) updateData.image = image;

        // 1. Save to persistent disk storage (products.json backup) immediately
        savePersistentProduct(updateData);

        // 2. Update initialData array in memory immediately
        if (initialData && initialData.products) {
            const idx = initialData.products.findIndex(p => Number(p.id) === productId);
            if (idx !== -1) {
                initialData.products[idx] = { ...initialData.products[idx], ...updateData };
            } else {
                initialData.products.push(updateData);
            }
        }

        // 3. Save in live MongoDB collection if connected (with safe timeout)
        let updatedProd = null;
        if (getIsConnected()) {
            try {
                updatedProd = await Promise.race([
                    Product.findOneAndUpdate(
                        { id: productId },
                        { $set: updateData },
                        { upsert: true, new: true }
                    ).lean(),
                    new Promise((resolve) => setTimeout(() => resolve(null), 1500))
                ]);
            } catch (mErr) {
                console.error('MongoDB product update note:', mErr.message);
            }
        }

        res.json({ message: 'Product updated successfully', product: updatedProd || updateData });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: error.message || 'Server error updating product' });
    }
});

// PATCH update product price (Store Owner & Admin - Native MongoDB & Persistent Storage)
router.patch('/:id/price', auth, isOwner, async (req, res) => {
    try {
        const productId = Number(req.params.id);
        const { price } = req.body;
        const numPrice = parseFloat(price);
        if (isNaN(numPrice) || numPrice < 0) {
            return res.status(400).json({ message: 'Invalid price value' });
        }

        // 1. Update persistent disk storage copy immediately
        const diskProds = loadPersistentProducts();
        const diskProd = diskProds.find(p => Number(p.id) === productId) || (initialData && initialData.products ? initialData.products.find(p => Number(p.id) === productId) : null);
        const savedData = diskProd ? { ...diskProd, id: productId, price: numPrice } : { id: productId, price: numPrice };
        savePersistentProduct(savedData);

        // 2. Also update initialData in memory fallback
        if (initialData && initialData.products) {
            const p = initialData.products.find(x => Number(x.id) === productId);
            if (p) p.price = numPrice;
        }

        // 3. Update in MongoDB with safe timeout if connected
        let updated = null;
        if (getIsConnected()) {
            try {
                updated = await Promise.race([
                    Product.findOneAndUpdate(
                        { id: productId },
                        { $set: { price: numPrice } },
                        { new: true }
                    ).lean(),
                    new Promise((resolve) => setTimeout(() => resolve(null), 1500))
                ]);
            } catch (e) {}
        }

        res.json({ message: 'Price updated successfully', productId, price: numPrice, product: updated || savedData });
    } catch (error) {
        console.error('Error updating product price:', error);
        res.status(500).json({ message: error.message || 'Server error updating price' });
    }
});

// DELETE product (Store Owner & Admin - Native MongoDB & Persistent Storage)
router.delete('/:id', auth, isOwner, async (req, res) => {
    try {
        const productId = Number(req.params.id);

        if (!getIsConnected()) {
            await connectMongoDB().catch(() => {});
        }

        deletePersistentProduct(productId);

        if (getIsConnected()) {
            await Product.deleteOne({ id: productId });
        }

        if (initialData && initialData.products) {
            const idx = initialData.products.findIndex(p => Number(p.id) === productId);
            if (idx !== -1) initialData.products.splice(idx, 1);
        }

        res.json({ message: 'Product deleted by Owner from MongoDB' });
    } catch (error) {
        console.error('Error deleting product from MongoDB:', error);
        res.status(500).json({ message: 'Server error deleting product' });
    }
});

// PATCH update product stock (Store Owner & Admin - Native MongoDB & Persistent Storage)
router.patch('/:id/stock', auth, isOwner, async (req, res) => {
    try {
        const productId = Number(req.params.id);
        const { stock } = req.body;
        const numStock = parseInt(stock);
        if (isNaN(numStock) || numStock < 0) {
            return res.status(400).json({ message: 'Invalid stock quantity' });
        }

        if (!getIsConnected()) {
            await connectMongoDB().catch(() => {});
        }

        let updated = null;
        if (getIsConnected()) {
            try {
                updated = await Product.findOneAndUpdate(
                    { id: productId },
                    { $set: { stock: numStock } },
                    { new: true }
                ).lean();
            } catch (e) {}
        }

        const diskProds = loadPersistentProducts();
        const diskProd = diskProds.find(p => Number(p.id) === productId) || (initialData && initialData.products ? initialData.products.find(p => Number(p.id) === productId) : null);
        if (diskProd) {
            savePersistentProduct({ ...diskProd, id: productId, stock: numStock });
        } else {
            savePersistentProduct({ id: productId, stock: numStock });
        }

        if (initialData && initialData.products) {
            const p = initialData.products.find(x => Number(x.id) === productId);
            if (p) p.stock = numStock;
        }

        res.json({ message: 'Stock updated successfully in MongoDB', productId, stock: numStock, product: updated });
    } catch (error) {
        console.error('Error updating stock:', error);
        res.status(500).json({ message: 'Server error updating stock' });
    }
});

module.exports = router;
