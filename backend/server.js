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

// Serve uploaded images as static files under /uploads and /picture
const pictureDir = path.join(__dirname, '..', 'picture');
app.use('/uploads', express.static(uploadsDir));
if (fs.existsSync(pictureDir)) {
    app.use('/uploads', express.static(pictureDir));
    app.use('/picture', express.static(pictureDir));
}
app.use('/picture', express.static(uploadsDir));

// Routes (/api/...)
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/users', require('./routes/users'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/owner', require('./routes/owner'));

// Alias Routes (without /api prefix for serverless rewrite compatibility)
app.use('/products', require('./routes/products'));
app.use('/categories', require('./routes/categories'));
app.use('/users', require('./routes/users'));
app.use('/orders', require('./routes/orders'));
app.use('/admin', require('./routes/admin'));
app.use('/owner', require('./routes/owner'));

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Kiskintha Mens Wear MongoDB API is running' });
});

const { connectMongoDB, initialData } = require('./config/db');

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
