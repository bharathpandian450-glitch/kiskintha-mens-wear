const fs = require('fs');
const path = require('path');
const os = require('os');

const DATA_DIR = process.env.VERCEL 
    ? path.join(os.tmpdir(), 'garments_data')
    : path.join(__dirname, '../data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {}
}

// Load persistent products from JSON file
function loadPersistentProducts() {
    try {
        if (fs.existsSync(PRODUCTS_FILE)) {
            const raw = fs.readFileSync(PRODUCTS_FILE, 'utf8');
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (err) {
        console.error('Error reading persistent products.json:', err.message);
    }
    return [];
}

// Save persistent product to JSON file
function savePersistentProduct(productObj) {
    try {
        const products = loadPersistentProducts();
        const idx = products.findIndex(p => Number(p.id) === Number(productObj.id));
        if (idx !== -1) {
            products[idx] = { ...products[idx], ...productObj };
        } else {
            products.unshift(productObj);
        }
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
        console.log(`💾 Product #${productObj.id} saved to persistent disk storage (products.json)!`);
    } catch (err) {
        console.error('Error writing to products.json:', err.message);
    }
}

// Delete persistent product from JSON file
function deletePersistentProduct(productId) {
    try {
        const products = loadPersistentProducts().filter(p => Number(p.id) !== Number(productId));
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
        console.log(`🗑️ Product #${productId} deleted from persistent disk storage (products.json)!`);
    } catch (err) {
        console.error('Error deleting from products.json:', err.message);
    }
}

module.exports = {
    loadPersistentProducts,
    savePersistentProduct,
    deletePersistentProduct
};
