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

        // Sync MongoDB Products to memoryStore or seed MongoDB if empty
        const mongoProds = await Product.find({}).lean();
        if (mongoProds && mongoProds.length > 0 && data.products) {
            data.products = mongoProds.map(p => ({
                id: p.id,
                name: p.name,
                description: p.description,
                price: p.price,
                original_price: p.original_price,
                image: p.image,
                category_id: p.category_id,
                category_name: p.category_name,
                subcategory: p.subcategory,
                sleeve_type: p.sleeve_type,
                size: p.size,
                color: p.color,
                rating: p.rating,
                stock: p.stock,
                created_at: p.created_at || new Date()
            }));
        } else if (data.products && data.products.length > 0) {
            for (const prod of data.products) {
                await Product.updateOne({ id: prod.id }, { $set: prod }, { upsert: true });
            }
        }

        // Sync existing MongoDB Orders to memoryStore & load disk persistent orders (Non-Destructive Merge)
        const { loadPersistentOrders, savePersistentOrder } = require('./persistentOrders');
        const diskOrders = loadPersistentOrders();
        const mongoOrders = await Order.find({}).sort({ created_at: -1 }).lean();

        const allKnownOrders = new Map();

        // 1. Add Disk Orders
        if (diskOrders && diskOrders.length > 0) {
            diskOrders.forEach(o => allKnownOrders.set(Number(o.id), o));
        }

        // 2. Add MongoDB Orders
        if (mongoOrders && mongoOrders.length > 0) {
            mongoOrders.forEach(o => allKnownOrders.set(Number(o.id), o));
        }

        // 3. Add MemoryStore Orders
        if (data.orders && data.orders.length > 0) {
            data.orders.forEach(o => {
                if (!allKnownOrders.has(Number(o.id))) {
                    allKnownOrders.set(Number(o.id), o);
                }
            });
        }

        // Merge back to data.orders without truncating
        data.orders.length = 0;
        data.order_items.length = 0;

        for (const o of Array.from(allKnownOrders.values())) {
            data.orders.push({
                id: Number(o.id),
                user_id: o.user_id,
                customer_name: o.customer_name || 'Customer',
                customer_email: o.customer_email || '',
                customer_phone: o.customer_phone || o.phone || '',
                total: Number(o.total || 0),
                address: o.address || '',
                city: o.city || 'Chennai',
                state: o.state || 'Tamil Nadu',
                pincode: o.pincode || '600040',
                phone: o.phone || o.customer_phone || '',
                payment_method: o.payment_method || 'Online Payment',
                status: o.status || 'Pending',
                created_at: o.created_at || new Date()
            });

            // Save to persistent disk storage
            savePersistentOrder(o);

            // Sync to MongoDB if not existing in MongoDB
            try {
                await Order.updateOne({ id: Number(o.id) }, { $set: o }, { upsert: true });
            } catch (err) {}

            if (o.items && o.items.length > 0) {
                for (const item of o.items) {
                    data.order_items.push({
                        id: data.order_items.length + 1,
                        order_id: Number(o.id),
                        product_id: item.product_id,
                        quantity: item.quantity,
                        price: item.price,
                        size: item.size || 'M',
                        color: item.color || '',
                        product_name: item.product_name || item.name || '',
                        image: item.image || ''
                    });
                }
            }
        }
        console.log(`✅ Fully Synced ${data.orders.length} Permanent Customer Orders across MongoDB, Disk Storage, and MemoryStore!`);

        console.log('✅ MongoDB Collections Auto-Seeded & Synced!');
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
