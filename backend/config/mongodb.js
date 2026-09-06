const mongoose = require('mongoose');
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
            color: { type: String },
            size: { type: String },
            quantity: { type: Number },
            price: { type: Number }
        }
    ],
    created_at: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

// Connection Caching for Vercel Serverless
let cachedConnection = null;

const connectMongoDB = async () => {
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    const uri = getMongoURI();
    const opts = {
        serverSelectionTimeoutMS: 8000,
        maxPoolSize: 10
    };

    try {
        cachedConnection = await mongoose.connect(uri, opts);
        console.log("✅ MongoDB Connected Successfully to Atlas Cluster");
        return cachedConnection;
    } catch (err) {
        if (uri.startsWith('mongodb+srv://')) {
            console.log("ℹ️ SRV connection failed. Retrying with Direct Seedlist URI...");
            try {
                cachedConnection = await mongoose.connect(ATLAS_DIRECT_URI, opts);
                console.log("✅ MongoDB Connected via Direct Seedlist to Atlas Cluster");
                return cachedConnection;
            } catch (directErr) {
                cachedConnection = null;
                console.error("❌ MongoDB Direct Connection Error:", directErr.message);
                throw directErr;
            }
        }
        cachedConnection = null;
        console.error("❌ MongoDB Connection Error:", err.message);
        throw err;
    }
};

module.exports = {
    mongoose,
    connectMongoDB,
    getIsConnected: () => mongoose.connection.readyState === 1,
    User,
    Category,
    Product,
    Order
};