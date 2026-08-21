const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { categories, subcategories, allProducts } = require('../seeders/seedData');

let pool = null;
let useFallback = false;
let fallbackDB = {
  users: [],
  admins: [],
  categories: [...categories],
  subcategories: [...subcategories],
  products: [...allProducts],
  cart: [],
  orders: [],
  order_items: [],
  reviews: []
};

const initFallbackData = async () => {
  const adminHash = await bcrypt.hash('admin123', 10);
  fallbackDB.admins.push({
    id: 1,
    name: 'Kiskintha Admin',
    email: 'admin@kiskintha.com',
    password: adminHash,
    role: 'admin',
    created_at: new Date().toISOString()
  });

  const userHash = await bcrypt.hash('user123', 10);
  fallbackDB.users.push({
    id: 1,
    name: 'Demo Customer',
    mobile: '9876543210',
    email: 'user@kiskintha.com',
    password: userHash,
    role: 'user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  fallbackDB.orders.push({
    id: 1,
    user_id: 1,
    order_number: 'ORD-KMW-1001',
    subtotal: 1499.00,
    delivery_charge: 0.00,
    discount: 100.00,
    total_amount: 1399.00,
    payment_method: 'Cash on Delivery',
    status: 'Delivered',
    shipping_name: 'Demo Customer',
    shipping_phone: '9876543210',
    shipping_email: 'user@kiskintha.com',
    shipping_address: '123 Main Street, Sector 4',
    shipping_city: 'Chennai',
    shipping_state: 'Tamil Nadu',
    shipping_pincode: '600001',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  });

  fallbackDB.order_items.push({
    id: 1,
    order_id: 1,
    product_id: 1,
    product_name: 'Royal Silk White Formal Shirt',
    size: 'L',
    color: 'White',
    quantity: 1,
    price: 1399.00
  });

  console.log('✅ Fallback database initialized with 130 Products & Local Linen Pictures!');
};

const connectDB = async () => {
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'kiskintha_mens_wear';

  try {
    const connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.end();

    pool = mysql.createPool({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    console.log(`✅ Connected to MySQL Database [${dbName}] on ${dbHost}`);
    await setupMySQLSchemaAndSeeds();
    useFallback = false;
  } catch (err) {
    console.warn(`⚠️ MySQL Notice (${err.message}). Using built-in high performance database mode.`);
    useFallback = true;
    await initFallbackData();
  }
};

const setupMySQLSchemaAndSeeds = async () => {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sqlStatements = fs.readFileSync(schemaPath, 'utf8')
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);

      for (const stmt of sqlStatements) {
        await pool.query(stmt);
      }
    }

    const [rows] = await pool.query('SELECT COUNT(*) as count FROM products');
    if (rows[0].count === 0) {
      console.log('🌱 Seeding 130 unique products into MySQL...');
      const seedScript = require('../seeders/seed');
      await seedScript.runMySQLSeed(pool);
    }
  } catch (error) {
    console.error('MySQL Setup Error:', error.message);
  }
};

const query = async (sql, params = []) => {
  if (!useFallback && pool) {
    try {
      const [rows] = await pool.query(sql, params);
      return rows;
    } catch (err) {
      console.error('MySQL Execution Error, switching to memory state:', err.message);
    }
  }

  return executeFallbackQuery(sql, params);
};

const executeFallbackQuery = (sql, params) => {
  const cleanSql = sql.trim().replace(/\s+/g, ' ');

  if (/^SELECT/i.test(cleanSql)) {
    if (cleanSql.includes('FROM users')) {
      if (cleanSql.includes('email = ? OR mobile = ?')) {
        const idVal = params[0];
        return fallbackDB.users.filter(u => u.email === idVal || u.mobile === idVal);
      }
      if (cleanSql.includes('WHERE email =')) {
        return fallbackDB.users.filter(u => u.email === params[0]);
      }
      if (cleanSql.includes('WHERE mobile =')) {
        return fallbackDB.users.filter(u => u.mobile === params[0]);
      }
      if (cleanSql.includes('WHERE id =')) {
        return fallbackDB.users.filter(u => u.id == params[0]);
      }
      return fallbackDB.users;
    }

    if (cleanSql.includes('FROM admins')) {
      if (cleanSql.includes('WHERE email =')) {
        return fallbackDB.admins.filter(a => a.email === params[0]);
      }
      return fallbackDB.admins;
    }

    if (cleanSql.includes('FROM categories')) {
      return fallbackDB.categories;
    }

    if (cleanSql.includes('FROM subcategories')) {
      if (cleanSql.includes('WHERE category_id =')) {
        return fallbackDB.subcategories.filter(s => s.category_id == params[0]);
      }
      return fallbackDB.subcategories;
    }

    if (cleanSql.includes('FROM products')) {
      let prods = [...fallbackDB.products];
      if (cleanSql.includes('WHERE id =')) {
        return prods.filter(p => p.id == params[0]);
      }
      return prods;
    }

    if (cleanSql.includes('FROM cart')) {
      if (cleanSql.includes('WHERE user_id =')) {
        const userId = params[0];
        const items = fallbackDB.cart.filter(c => c.user_id == userId);
        return items.map(item => {
          const prod = fallbackDB.products.find(p => p.id == item.product_id) || {};
          return {
            ...item,
            product_name: prod.name,
            price: prod.discount_price || prod.price,
            original_price: prod.price,
            product_image: prod.images ? prod.images[0] : '',
            category_name: prod.category_name
          };
        });
      }
    }

    if (cleanSql.includes('FROM orders')) {
      if (cleanSql.includes('WHERE user_id =')) {
        return fallbackDB.orders.filter(o => o.user_id == params[0]).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }
      if (cleanSql.includes('WHERE id =')) {
        return fallbackDB.orders.filter(o => o.id == params[0]);
      }
      return [...fallbackDB.orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    if (cleanSql.includes('FROM order_items')) {
      if (cleanSql.includes('WHERE order_id =')) {
        return fallbackDB.order_items.filter(oi => oi.order_id == params[0]);
      }
      return fallbackDB.order_items;
    }
  }

  if (/^INSERT INTO/i.test(cleanSql)) {
    if (cleanSql.includes('users')) {
      const newUser = {
        id: fallbackDB.users.length + 1,
        name: params[0],
        mobile: params[1],
        email: params[2],
        password: params[3],
        role: params[4] || 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      fallbackDB.users.push(newUser);
      return { insertId: newUser.id, affectedRows: 1 };
    }

    if (cleanSql.includes('products')) {
      const newProd = {
        id: fallbackDB.products.length + 1,
        name: params[0],
        slug: (params[0] || 'prod').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category_id: parseInt(params[1]) || 1,
        category_name: (fallbackDB.categories.find(c => c.id == params[1]) || {}).name || 'Shirts',
        subcategory_id: parseInt(params[2]) || 1,
        subcategory: params[3] || 'Casual',
        description: params[4] || '',
        price: parseFloat(params[5]),
        discount_price: parseFloat(params[6] || params[5]),
        stock_quantity: parseInt(params[7] || 50),
        rating: 4.5,
        review_count: 1,
        status: params[8] || 'Active',
        images: params[9] ? [params[9]] : ['/picture/linen 1.jpg'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Standard']
      };
      fallbackDB.products.unshift(newProd);
      return { insertId: newProd.id, affectedRows: 1 };
    }

    if (cleanSql.includes('cart')) {
      const existing = fallbackDB.cart.find(
        c => c.user_id == params[0] && c.product_id == params[1] && c.size == params[2] && c.color == params[3]
      );
      if (existing) {
        existing.quantity += parseInt(params[4] || 1);
        return { insertId: existing.id, affectedRows: 1 };
      } else {
        const newItem = {
          id: fallbackDB.cart.length + 1,
          user_id: params[0],
          product_id: params[1],
          size: params[2],
          color: params[3],
          quantity: parseInt(params[4] || 1),
          created_at: new Date().toISOString()
        };
        fallbackDB.cart.push(newItem);
        return { insertId: newItem.id, affectedRows: 1 };
      }
    }

    if (cleanSql.includes('orders')) {
      const newOrder = {
        id: fallbackDB.orders.length + 1,
        user_id: params[0],
        order_number: params[1],
        subtotal: parseFloat(params[2]),
        delivery_charge: parseFloat(params[3]),
        discount: parseFloat(params[4]),
        total_amount: parseFloat(params[5]),
        payment_method: params[6] || 'Cash on Delivery',
        status: params[7] || 'Pending',
        shipping_name: params[8],
        shipping_phone: params[9],
        shipping_email: params[10],
        shipping_address: params[11],
        shipping_city: params[12],
        shipping_state: params[13],
        shipping_pincode: params[14],
        created_at: new Date().toISOString()
      };
      fallbackDB.orders.unshift(newOrder);
      return { insertId: newOrder.id, affectedRows: 1 };
    }

    if (cleanSql.includes('order_items')) {
      const newItem = {
        id: fallbackDB.order_items.length + 1,
        order_id: params[0],
        product_id: params[1],
        product_name: params[2],
        size: params[3],
        color: params[4],
        quantity: params[5],
        price: params[6]
      };
      fallbackDB.order_items.push(newItem);
      return { insertId: newItem.id, affectedRows: 1 };
    }
  }

  if (/^UPDATE/i.test(cleanSql)) {
    if (cleanSql.includes('users') && cleanSql.includes('SET password =')) {
      const newPass = params[0];
      const targetEmail = params[1];
      const targetUser = fallbackDB.users.find(u => u.email === targetEmail);
      if (targetUser) {
        targetUser.password = newPass;
        targetUser.updated_at = new Date().toISOString();
      }
      return { affectedRows: 1 };
    }

    if (cleanSql.includes('cart')) {
      const id = params[1];
      const item = fallbackDB.cart.find(c => c.id == id);
      if (item) {
        item.quantity = parseInt(params[0]);
      }
      return { affectedRows: 1 };
    }

    if (cleanSql.includes('orders') && cleanSql.includes('SET status =')) {
      const status = params[0];
      const id = params[1];
      const order = fallbackDB.orders.find(o => o.id == id);
      if (order) {
        order.status = status;
      }
      return { affectedRows: 1 };
    }

    if (cleanSql.includes('products')) {
      const id = params[params.length - 1];
      const prod = fallbackDB.products.find(p => p.id == id);
      if (prod) {
        prod.name = params[0] || prod.name;
        prod.category_id = parseInt(params[1]) || prod.category_id;
        prod.subcategory_id = parseInt(params[2]) || prod.subcategory_id;
        prod.subcategory = params[3] || prod.subcategory;
        prod.description = params[4] || prod.description;
        prod.price = parseFloat(params[5]) || prod.price;
        prod.discount_price = parseFloat(params[6]) || prod.discount_price;
        prod.stock_quantity = parseInt(params[7]) || prod.stock_quantity;
        prod.status = params[8] || prod.status;
      }
      return { affectedRows: 1 };
    }
  }

  if (/^DELETE FROM/i.test(cleanSql)) {
    if (cleanSql.includes('cart')) {
      if (cleanSql.includes('WHERE id =')) {
        fallbackDB.cart = fallbackDB.cart.filter(c => c.id != params[0]);
      } else if (cleanSql.includes('WHERE user_id =')) {
        fallbackDB.cart = fallbackDB.cart.filter(c => c.user_id != params[0]);
      }
      return { affectedRows: 1 };
    }

    if (cleanSql.includes('products')) {
      fallbackDB.products = fallbackDB.products.filter(p => p.id != params[0]);
      return { affectedRows: 1 };
    }
  }

  return [];
};

module.exports = {
  connectDB,
  query,
  fallbackDB,
  getIsFallback: () => useFallback
};
