// =============================================
// Kiskintha Mens Wear - MongoDB Database Schema
// Database: bharath_garments
// =============================================

const mongoose = require('mongoose');

// 1. Users Collection Schema
const userSchema = new mongoose.Schema({
    id: { type: Number },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    role: { type: String, enum: ['customer', 'admin', 'owner'], default: 'customer' },
    created_at: { type: Date, default: Date.now }
});

// 2. Categories Collection Schema
const categorySchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true }
});

// 3. Products Collection Schema
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

// 4. Orders Collection Schema
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
    payment_method: { type: String, default: 'Online Payment (UPI/Cards)' },
    payment_status: { type: String, default: 'Paid' },
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

module.exports = {
    User,
    Category,
    Product,
    Order,
    userSchema,
    categorySchema,
    productSchema,
    orderSchema
};
