const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const { authenticateAdmin } = require('../middleware/authMiddleware');

// GET /api/products (with search, category, subcategory, price, size, color, rating, sort, pagination)
router.get('/', async (req, res) => {
  try {
    const {
      search,
      category,
      subcategory,
      subcategory_id,
      minPrice,
      maxPrice,
      size,
      color,
      minRating,
      sort,
      bestseller,
      newArrivals,
      trending,
      page = 1,
      limit = 12
    } = req.query;

    let products = await query('SELECT * FROM products');

    // 1. Search Filter (matches name, main category, subcategory, and description)
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        p => p.name.toLowerCase().includes(q) ||
             (p.description && p.description.toLowerCase().includes(q)) ||
             (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
             (p.category_name && p.category_name.toLowerCase().includes(q))
      );
    }

    // 2. Category Filter
    if (category) {
      const catQuery = category.toLowerCase();
      const catMap = {
        'shirts': 1,
        'pants': 2,
        'trousers': 3,
        't-shirts': 4,
        'group-shirts': 5
      };
      const catId = catMap[catQuery] || (parseInt(category) ? parseInt(category) : null);
      if (catId) {
        products = products.filter(p => p.category_id == catId);
      } else {
        products = products.filter(p => p.category_slug === catQuery || (p.category_name && p.category_name.toLowerCase() === catQuery));
      }
    }

    // 3. Subcategory Filter (by subcategory_id or subcategory name/slug)
    if (subcategory_id) {
      products = products.filter(p => p.subcategory_id == subcategory_id);
    } else if (subcategory) {
      const subcatQuery = subcategory.toLowerCase().replace(/-/g, ' ');
      products = products.filter(
        p => p.subcategory.toLowerCase() === subcatQuery ||
             p.subcategory.toLowerCase().replace(/ /g, '-') === subcategory.toLowerCase()
      );
    }

    // 4. Price Filter
    if (minPrice) {
      products = products.filter(p => (p.discount_price || p.price) >= parseFloat(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => (p.discount_price || p.price) <= parseFloat(maxPrice));
    }

    // 5. Size Filter
    if (size) {
      products = products.filter(p => p.sizes && p.sizes.includes(size.toUpperCase()));
    }

    // 6. Color Filter
    if (color) {
      products = products.filter(p => p.colors && p.colors.some(c => c.toLowerCase().includes(color.toLowerCase())));
    }

    // 7. Rating Filter
    if (minRating) {
      products = products.filter(p => p.rating >= parseFloat(minRating));
    }

    // Feature Flags Filters
    if (bestseller === 'true') {
      products = products.filter(p => p.is_bestseller === 1);
    }
    if (newArrivals === 'true') {
      products = products.filter(p => p.is_new === 1);
    }
    if (trending === 'true') {
      products = products.filter(p => p.is_trending === 1);
    }

    // 8. Sorting
    if (sort === 'price_asc') {
      products.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
    } else if (sort === 'price_desc') {
      products.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
    } else if (sort === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'popularity') {
      products.sort((a, b) => b.review_count - a.review_count);
    } else if (sort === 'newest') {
      products.sort((a, b) => b.id - a.id);
    }

    // Total Count
    const total = products.length;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;
    const totalPages = Math.ceil(total / limitNum) || 1;

    // Pagination slice
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedProducts = products.slice(startIndex, startIndex + limitNum);

    res.json({
      products: paginatedProducts,
      total,
      page: pageNum,
      totalPages,
      limit: limitNum
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products.', error: error.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const products = await query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    const product = products[0];
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product details.', error: error.message });
  }
});

// POST /api/products (Admin)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { name, category_id, subcategory_id, subcategory, description, price, discount_price, stock_quantity, status, image } = req.body;
    if (!name || !category_id || !price) {
      return res.status(400).json({ message: 'Name, Category, and Price are required.' });
    }
    const result = await query(
      'INSERT INTO products (name, category_id, subcategory_id, subcategory, description, price, discount_price, stock_quantity, status, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, category_id, subcategory_id || null, subcategory || 'General', description || '', price, discount_price || price, stock_quantity || 50, status || 'Active', image || '']
    );
    res.status(201).json({ message: 'Product created successfully!', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product.', error: error.message });
  }
});

// PUT /api/products/:id (Admin)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { name, category_id, subcategory_id, subcategory, description, price, discount_price, stock_quantity, status } = req.body;
    await query(
      'UPDATE products SET name = ?, category_id = ?, subcategory_id = ?, subcategory = ?, description = ?, price = ?, discount_price = ?, stock_quantity = ?, status = ? WHERE id = ?',
      [name, category_id, subcategory_id || null, subcategory, description, price, discount_price, stock_quantity, status, req.params.id]
    );
    res.json({ message: 'Product updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product.', error: error.message });
  }
});

// DELETE /api/products/:id (Admin)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    await query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product.', error: error.message });
  }
});

module.exports = router;
