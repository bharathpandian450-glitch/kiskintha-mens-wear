const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Middleware - Allow all origins and preflight OPTIONS requests
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});
app.use(cors());
app.use(express.json());

const { connectMongoDB, initialData } = require('./config/db');

// Ensure MongoDB is connected and seeded on incoming API requests in serverless environments
app.use(async (req, res, next) => {
    try {
        await connectMongoDB(initialData);
    } catch (err) {
        console.error('Serverless connection error:', err.message);
    }
    next();
});

// Cache-Control headers for ultra-fast CDN responses on static images and public endpoints
app.use((req, res, next) => {
    if (req.method === 'GET') {
        if (req.path.startsWith('/uploads') || req.path.startsWith('/picture')) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (req.path.includes('/products') || req.path.includes('/categories')) {
            res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
        }
    }
    next();
});

// Serve uploaded images as static files under /uploads and /picture
const pictureDir = path.join(__dirname, '..', 'picture');
app.use('/uploads', express.static(uploadsDir, { maxAge: '1y', immutable: true }));
if (fs.existsSync(pictureDir)) {
    app.use('/uploads', express.static(pictureDir, { maxAge: '1y', immutable: true }));
    app.use('/picture', express.static(pictureDir, { maxAge: '1y', immutable: true }));
}
app.use('/picture', express.static(uploadsDir, { maxAge: '1y', immutable: true }));

// Routes (/api/...)
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/users', require('./routes/users'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/owner', require('./routes/owner'));

// Alias Routes (without /api prefix for serverless rewrite compatibility)
app.use('/products', require('./routes/products'));
app.use('/categories', require('./routes/categories'));
app.use('/users', require('./routes/users'));
app.use('/orders', require('./routes/orders'));
app.use('/reviews', require('./routes/reviews'));
app.use('/admin', require('./routes/admin'));
app.use('/owner', require('./routes/owner'));

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Kiskintha Mens Wear MongoDB API is running' });
});

// Start server on PORT 5000 and connect to MongoDB
const server = app.listen(PORT, () => {
    console.log(`✅ Kiskintha Mens Wear Server running on port ${PORT}`);
    connectMongoDB(initialData).catch(() => {});
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`⚠️ Port ${PORT} is already occupied by an active server background process.`);
        console.log(`✅ Your backend server is ALREADY RUNNING smoothly on http://localhost:${PORT}!`);
    } else {
        console.error('Server error:', err);
    }
});

module.exports = app;
