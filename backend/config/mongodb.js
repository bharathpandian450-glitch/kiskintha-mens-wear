const mongoose = require('mongoose');

// Disable Mongoose command buffering so queries fail-fast when disconnected instead of timing out after 10000ms
mongoose.set('bufferCommands', false);

const ATLAS_SRV_URI = "mongodb+srv://kiskinthowner:Gowtham%40123@cluster0.o5j3a.mongodb.net/garments?retryWrites=true&w=majority";
const ATLAS_DIRECT_URI = "mongodb://kiskinthowner:Gowtham%40123@cluster0-shard-00-00.o5j3a.mongodb.net:27017,cluster0-shard-00-01.o5j3a.mongodb.net:27017,cluster0-shard-00-02.o5j3a.mongodb.net:27017/garments?ssl=true&replicaSet=atlas-13cypq-shard-0&authSource=admin&retryWrites=true&w=majority";

const getMongoURI = () => {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (uri && !uri.includes('127.0.0.1') && !uri.includes('localhost')) {
        return uri;
    }
    return ATLAS_SRV_URI;
};

// ----------------------------------------------------
// MONGOOSE SCHEMAS & MODELS
// ----------------------------------------------------

const userSchema = new mongoose.Schema({
    id: { type: Number },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, default: '' },
    password: { type: String, required: true },
    address: { type: String, default: '' },
    role: { type: String, enum: ['customer', 'admin', 'owner'], default: 'customer' },
    created_at: { type: Date, default: Date.now }
});

const categorySchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true }
});

const productSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    original_price: { type: Number },
    image: { type: String, default: '' },
    category_id: { type: Number, required: true },
    category_name: { type: String, required: true },
    subcategory: { type: String, default: '' },
    sleeve_type: { type: String, default: '' },
    size: { type: String, default: 'S,M,L,XL,XXL' },
    color: { type: String, default: 'Assorted' },
    rating: { type: Number, default: 4.5 },
    stock: { type: Number, default: 50 },
    created_at: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    user_id: { type: Number, required: true },
    customer_name: { type: String, default: '' },
    customer_email: { type: String, default: '' },
    customer_phone: { type: String, default: '' },
    total: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
    address: { type: String, default: '' },
    city: { type: String, default: 'Chennai' },
    state: { type: String, default: 'Tamil Nadu' },
    pincode: { type: String, default: '600040' },
    phone: { type: String, default: '' },
    payment_method: { type: String, default: 'COD' },
    items: [
        {
            product_id: { type: Number },
            product_name: { type: String },
            name: { type: String },
            image: { type: String },
            category_name: { type: String },
            sleeve_type: { type: String },
            color: { type: String },
            size: { type: String },
            quantity: { type: Number },
            price: { type: Number }
        }
    ],
    created_at: { type: Date, default: Date.now }
});

const reviewSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    product_id: { type: Number, required: true },
    user_id: { type: Number, required: true },
    customer_name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

reviewSchema.index({ product_id: 1, user_id: 1 }, { unique: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

// Connection Caching for Vercel Serverless
let cachedConnection = null;
let connectionPromise = null;
let lastAttemptTime = 0;

const connectMongoDB = async (seedData = null) => {
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    // If an attempt is currently in progress, return its promise
    if (connectionPromise) {
        return connectionPromise;
    }

    // Throttle connection attempts to once every 5 seconds if disconnected
    const now = Date.now();
    if (now - lastAttemptTime < 5000 && mongoose.connection.readyState !== 1) {
        return null;
    }

    lastAttemptTime = now;
    const uri = getMongoURI();
    const opts = {
        serverSelectionTimeoutMS: 2000,
        maxPoolSize: 10
    };

    const runAutoSeed = async () => {
        try {
            const count = await Product.countDocuments();
            if (count === 0) {
                const data = seedData || require('./db').initialData;
                if (data && data.products && data.products.length > 0) {
                    console.log(`🌱 Empty MongoDB detected. Seeding ${data.products.length} initial products...`);
                    if (data.users && data.users.length) {
                        await User.deleteMany({}).catch(() => {});
                        await User.insertMany(data.users).catch(() => {});
                    }
                    if (data.categories && data.categories.length) {
                        await Category.deleteMany({}).catch(() => {});
                        await Category.insertMany(data.categories).catch(() => {});
                    }
                    await Product.insertMany(data.products).catch(() => {});
                    console.log(`✅ MongoDB auto-seeded successfully!`);
                }
            }
        } catch (sErr) {
            console.error("Auto-seed note:", sErr.message);
        }
    };

    connectionPromise = (async () => {
        try {
            cachedConnection = await mongoose.connect(uri, opts);
            console.log("✅ MongoDB Connected Successfully to Atlas Cluster");
            await runAutoSeed();
            return cachedConnection;
        } catch (err) {
            if (uri.startsWith('mongodb+srv://')) {
                try {
                    cachedConnection = await mongoose.connect(ATLAS_DIRECT_URI, opts);
                    console.log("✅ MongoDB Connected via Direct Seedlist to Atlas Cluster");
                    await runAutoSeed();
                    return cachedConnection;
                } catch (directErr) {
                    console.error("❌ MongoDB Direct Connection Note:", directErr.message);
                }
            } else {
                console.error("❌ MongoDB Connection Note:", err.message);
            }

            try {
                cachedConnection = await mongoose.connect("mongodb://127.0.0.1:27017/garments", opts);
                console.log("✅ MongoDB Connected Successfully to Local MongoDB instance");
                await runAutoSeed();
                return cachedConnection;
            } catch (localErr) {
                cachedConnection = null;
                console.error("❌ Local MongoDB Connection Note:", localErr.message);
            }
            return null;
        } finally {
            connectionPromise = null;
        }
    })();

    return connectionPromise;
};

module.exports = {
    mongoose,
    connectMongoDB,
    getIsConnected: () => mongoose.connection.readyState === 1,
    User,
    Category,
    Product,
    Order,
    Review
};