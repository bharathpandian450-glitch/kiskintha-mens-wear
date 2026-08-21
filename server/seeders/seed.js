const bcrypt = require('bcryptjs');
const { categories, subcategories, allProducts } = require('./seedData');

const runMySQLSeed = async (pool) => {
  try {
    console.log('Seeding categories...');
    for (const cat of categories) {
      await pool.query(
        'INSERT INTO categories (id, name, slug, description, image) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name)',
        [cat.id, cat.name, cat.slug, cat.description, cat.image]
      );
    }

    console.log('Seeding subcategories...');
    for (const sc of subcategories) {
      await pool.query(
        'INSERT INTO subcategories (id, category_id, name, slug) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name)',
        [sc.id, sc.category_id, sc.name, sc.slug]
      );
    }

    console.log('Seeding 130 products with subcategories & local linen images...');
    for (const prod of allProducts) {
      await pool.query(
        `INSERT INTO products 
        (id, name, slug, category_id, subcategory_id, subcategory, description, price, discount_price, stock_quantity, rating, review_count, status, is_bestseller, is_new, is_trending) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name=VALUES(name), subcategory_id=VALUES(subcategory_id), subcategory=VALUES(subcategory)`,
        [
          prod.id,
          prod.name,
          prod.slug,
          prod.category_id,
          prod.subcategory_id,
          prod.subcategory,
          prod.description,
          prod.price,
          prod.discount_price,
          prod.stock_quantity,
          prod.rating,
          prod.review_count,
          prod.status,
          prod.is_bestseller,
          prod.is_new,
          prod.is_trending
        ]
      );

      // Insert primary image
      if (prod.images && prod.images.length > 0) {
        for (let i = 0; i < prod.images.length; i++) {
          await pool.query(
            'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)',
            [prod.id, prod.images[i], i === 0 ? 1 : 0]
          );
        }
      }

      // Insert size & color variants
      for (const sz of prod.sizes) {
        for (const col of prod.colors) {
          await pool.query(
            'INSERT INTO product_variants (product_id, size, color, stock) VALUES (?, ?, ?, ?)',
            [prod.id, sz, col, 10]
          );
        }
      }
    }

    // Seed Admin
    const adminPass = await bcrypt.hash('admin123', 10);
    await pool.query(
      'INSERT INTO admins (name, email, password, role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE email=VALUES(email)',
      ['Kiskintha Admin', 'admin@kiskintha.com', adminPass, 'admin']
    );

    // Seed User
    const userPass = await bcrypt.hash('user123', 10);
    await pool.query(
      'INSERT INTO users (name, mobile, email, password, role) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE email=VALUES(email)',
      ['Demo Customer', '9876543210', 'user@kiskintha.com', userPass, 'user']
    );

    console.log('✅ Successfully seeded subcategories, 130 unique products & accounts into MySQL!');
  } catch (err) {
    console.error('Error during MySQL seed:', err.message);
  }
};

module.exports = { runMySQLSeed };
