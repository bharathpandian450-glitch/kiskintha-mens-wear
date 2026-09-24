const fs = require('fs');
const path = require('path');
const os = require('os');

const DATA_DIR = process.env.VERCEL 
    ? path.join(os.tmpdir(), 'garments_data')
    : path.join(__dirname, '../data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

const BUNDLED_ORDERS_FILE = path.join(__dirname, '../data/orders.json');

// Ensure data directory and initial file exists
if (!fs.existsSync(DATA_DIR)) {
    try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {}
}

// Ensure initial file is seeded from bundled data on serverless startup
if (process.env.VERCEL && !fs.existsSync(ORDERS_FILE) && fs.existsSync(BUNDLED_ORDERS_FILE)) {
    try {
        fs.copyFileSync(BUNDLED_ORDERS_FILE, ORDERS_FILE);
    } catch (e) {}
}

// Load persistent orders from JSON file with bundled fallback
function loadPersistentOrders() {
    try {
        let orders = [];
        if (fs.existsSync(ORDERS_FILE)) {
            const raw = fs.readFileSync(ORDERS_FILE, 'utf8');
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) orders = parsed;
        } else if (fs.existsSync(BUNDLED_ORDERS_FILE)) {
            const raw = fs.readFileSync(BUNDLED_ORDERS_FILE, 'utf8');
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) orders = parsed;
        }

        // Also merge any bundled orders that might be missing
        if (fs.existsSync(BUNDLED_ORDERS_FILE)) {
            try {
                const bRaw = fs.readFileSync(BUNDLED_ORDERS_FILE, 'utf8');
                const bParsed = JSON.parse(bRaw);
                if (Array.isArray(bParsed)) {
                    const existingIds = new Set(orders.map(o => Number(o.id)));
                    bParsed.forEach(bOrder => {
                        if (!existingIds.has(Number(bOrder.id))) {
                            orders.push(bOrder);
                        }
                    });
                }
            } catch (bErr) {}
        }

        return orders;
    } catch (err) {
        console.error('Error reading persistent orders.json:', err.message);
    }
    return [];
}

// Save persistent order to JSON file
function savePersistentOrder(orderObj) {
    try {
        const orders = loadPersistentOrders();
        const idx = orders.findIndex(o => Number(o.id) === Number(orderObj.id));
        if (idx !== -1) {
            orders[idx] = { ...orders[idx], ...orderObj };
        } else {
            orders.unshift(orderObj);
        }
        fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
        console.log(`💾 Order #${orderObj.id} saved to persistent disk storage (orders.json)!`);
    } catch (err) {
        console.error('Error writing to orders.json:', err.message);
    }
}

// Delete persistent order from JSON file
function deletePersistentOrder(orderId) {
    try {
        const orders = loadPersistentOrders().filter(o => Number(o.id) !== Number(orderId));
        fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
        console.log(`🗑️ Order #${orderId} deleted from persistent disk storage (orders.json)!`);
    } catch (err) {
        console.error('Error deleting from orders.json:', err.message);
    }
}

module.exports = {
    loadPersistentOrders,
    savePersistentOrder,
    deletePersistentOrder
};
