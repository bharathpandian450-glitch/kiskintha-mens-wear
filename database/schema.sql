-- =============================================
-- Kiskintha Mens Wear - Database Schema
-- =============================================

CREATE DATABASE IF NOT EXISTS bharath_garments;
USE bharath_garments;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    address TEXT,
    role ENUM('customer', 'admin', 'owner') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255) DEFAULT '',
    category_id INT,
    size VARCHAR(100) DEFAULT 'S,M,L,XL',
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total DECIMAL(10, 2) NOT NULL,
    status ENUM('Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    address TEXT,
    phone VARCHAR(15),
    payment_method VARCHAR(50) DEFAULT 'COD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    size VARCHAR(10),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- =============================================
-- Seed Data
-- =============================================

-- Seed Users
INSERT INTO users (name, email, password, phone, role) VALUES
('Customer', 'customer@kiskinthamenswear.com', '$2a$10$xPLP0KJ8qXKLp6N5kJJ8CeGx6kFOkXmRVRHNF7pPT8WQFxMOEBrHK', '9876543211', 'customer'),
('Admin', 'admin@kiskinthamenswear.com', '$2a$10$xPLP0KJ8qXKLp6N5kJJ8CeGx6kFOkXmRVRHNF7pPT8WQFxMOEBrHK', '9876543210', 'admin'),
('Owner', 'owner@kiskinthamenswear.com', '$2a$10$xPLP0KJ8qXKLp6N5kJJ8CeGx6kFOkXmRVRHNF7pPT8WQFxMOEBrHK', '9876543200', 'owner');

-- Categories
INSERT INTO categories (name) VALUES
('T-Shirts'),
('Shirts'),
('Pants'),
('Hoodies'),
('Group Shirts');

-- Products table starts empty so Store Owner can upload product details.
