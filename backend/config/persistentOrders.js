const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {}
}

// Load persistent orders from JSON file
function loadPersistentOrders() {
    try {
        if (fs.existsSync(ORDERS_FILE)) {
            const raw = fs.readFileSync(ORDERS_FILE, 'utf8');
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
        }
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
