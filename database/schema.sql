// =============================================
// Kiskintha Mens Wear - MongoDB Database Schema & Init Script
// Database Name: bharath_garments
// Technology: MongoDB / Mongoose ODM
// =============================================

// MongoDB MongoShell Initialization (mongosh)
use bharath_garments;

// Create MongoDB Collections
db.createCollection("users");
db.createCollection("categories");
db.createCollection("products");
db.createCollection("orders");

// Create MongoDB Indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.categories.createIndex({ "id": 1 }, { unique: true });
db.products.createIndex({ "id": 1 }, { unique: true });
db.orders.createIndex({ "id": 1 }, { unique: true });
db.orders.createIndex({ "user_id": 1 });

// =============================================
// MongoDB Document Schema Structure
// =============================================

/*
1. USERS COLLECTION (db.users)
{
  "_id": ObjectId("..."),
  "id": Number,
  "name": String,
  "email": String,
  "password": String,
  "phone": String,
  "address": String,
  "role": "customer" | "admin" | "owner",
  "created_at": Date
}

2. CATEGORIES COLLECTION (db.categories)
{
  "_id": ObjectId("..."),
  "id": Number,
  "name": String
}

3. PRODUCTS COLLECTION (db.products)
{
  "_id": ObjectId("..."),
  "id": Number,
  "name": String,
  "description": String,
  "price": Number,
  "original_price": Number,
  "image": String,
  "category_id": Number,
  "category_name": String,
  "subcategory": String,
  "sleeve_type": String,
  "size": String,
  "color": String,
  "rating": Number,
  "stock": Number,
  "created_at": Date
}

4. ORDERS COLLECTION (db.orders)
{
  "_id": ObjectId("..."),
  "id": Number,
  "user_id": Number,
  "customer_name": String,
  "customer_email": String,
  "customer_phone": String,
  "total": Number,
  "status": "Pending" | "Confirmed" | "Packed" | "Shipped" | "Delivered" | "Cancelled",
  "address": String,
  "city": String,
  "state": String,
  "pincode": String,
  "payment_method": String,
  "payment_status": "Paid",
  "items": [
    {
      "product_id": Number,
      "product_name": String,
      "name": String,
      "image": String,
      "category_name": String,
      "color": String,
      "size": String,
      "quantity": Number,
      "price": Number
    }
  ],
  "created_at": Date
}
*/
