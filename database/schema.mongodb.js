// =============================================
// Kiskintha Mens Wear - MongoDB Database Initialization
// Database: bharath_garments
// =============================================

// Run this script in MongoShell (mongosh) or MongoDB Compass:
// mongosh "mongodb://127.0.0.1:27017/bharath_garments" database/schema.mongodb.js

db = db.getSiblingDB("bharath_garments");

// Create Collections
db.createCollection("users");
db.createCollection("categories");
db.createCollection("products");
db.createCollection("orders");

// Create Unique Indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.categories.createIndex({ id: 1 }, { unique: true });
db.products.createIndex({ id: 1 }, { unique: true });
db.orders.createIndex({ id: 1 }, { unique: true });
db.orders.createIndex({ user_id: 1 });

print("✅ MongoDB bharath_garments Database Collections & Indexes Initialized!");
