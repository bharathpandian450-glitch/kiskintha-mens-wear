const mongoose = require('mongoose');

const getMongoURI = () => process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bharath_garments';

// ----------------------------------------------------
// MONGOOSE SCHEMAS & MODELS
// ----------------------------------------------------

// 1. User Schema
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

// 2. Category Schema
const categorySchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true }
});

// 3. Product Schema
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

// 4. Order Schema
const orderSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    user_id: { type: Number, required: true },
    customer_name: { type: String, default: '' },
    customer_email: { type: String, default: '' },
    total: { type: Number, required: true },
    status: { type: String, default: 'Pending Approval' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    payment_method: { type: String, default: 'COD' },
    items: [
        {
            product_id: { type: Number },
            name: { type: String },
            quantity: { type: Number },
            price: { type: Number },
            size: { type: String }
        }
    ],
    created_at: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

// Connection Status Flag
let isConnected = false;

// ----------------------------------------------------
// CONNECT TO MONGOOSE & AUTO-SEED DATA
// ----------------------------------------------------
const connectMongoDB = async (initialData = null) => {
    if (mongoose.connection.readyState === 1) {
        isConnected = true;
        return;
    }
    const uri = getMongoURI();
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 3000
        });
        isConnected = true;
        console.log(`✅ MongoDB Connected Successfully: ${uri}`);

        if (initialData) {
            await seedMongoDB(initialData);
        }
    } catch (err) {
        console.log(`ℹ️ MongoDB connection note for ${uri}: ${err.message}. Operating on zero-downtime persistence.`);
        isConnected = false;
    }
};

const seedMongoDB = async (data) => {
    if (!isConnected) return;
    try {
        // Seed Categories
        if (data.categories && data.categories.length > 0) {
            for (const cat of data.categories) {
                await Category.updateOne({ id: cat.id }, { $set: cat }, { upsert: true });
            }
        }

        // Seed Users
        if (data.users && data.users.length > 0) {
            for (const u of data.users) {
                await User.updateOne({ email: u.email }, { $set: u }, { upsert: true });
            }
        }

        // Seed Products
        if (data.products && data.products.length > 0) {
            for (const prod of data.products) {
                await Product.updateOne({ id: prod.id }, { $set: prod }, { upsert: true });
            }
        }

        console.log('✅ MongoDB Collections Auto-Seeded (Users, Categories, Products)!');
    } catch (err) {
        console.error('Error seeding MongoDB collections:', err.message);
    }
};

module.exports = {
    mongoose,
    connectMongoDB,
    seedMongoDB,
    getIsConnected: () => isConnected,
    User,
    Category,
    Product,
    Order
};
