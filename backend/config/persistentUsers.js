const fs = require('fs');
const path = require('path');
const os = require('os');

const DATA_DIR = process.env.VERCEL 
    ? path.join(os.tmpdir(), 'garments_data')
    : path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {}
}

// Load persistent users from JSON file
function loadPersistentUsers() {
    try {
        if (fs.existsSync(USERS_FILE)) {
            const raw = fs.readFileSync(USERS_FILE, 'utf8');
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (err) {
        console.error('Error reading persistent users.json:', err.message);
    }
    return [];
}

// Save or update persistent user to JSON file
function savePersistentUser(userObj) {
    try {
        const users = loadPersistentUsers();
        const cleanEmail = (userObj.email || '').toLowerCase().trim();
        const cleanPhone = (userObj.phone || '').trim();

        const idx = users.findIndex(u => 
            (cleanEmail && u.email && u.email.toLowerCase().trim() === cleanEmail) ||
            (cleanPhone && u.phone && u.phone.trim() === cleanPhone) ||
            (u.id && userObj.id && Number(u.id) === Number(userObj.id))
        );

        if (idx !== -1) {
            users[idx] = { ...users[idx], ...userObj };
        } else {
            users.unshift(userObj);
        }

        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
        console.log('Saved user to persistent storage');
    } catch (err) {
        console.error('Error writing to users.json:', err.message);
    }
}

// Find persistent user by email, phone, or username
function findPersistentUser(credential) {
    if (!credential) return null;
    const clean = credential.toString().toLowerCase().trim();
    const users = loadPersistentUsers();
    return users.find(u => 
        (u.email && u.email.toLowerCase().trim() === clean) ||
        (u.phone && u.phone.trim() === clean) ||
        (u.username && u.username.toLowerCase().trim() === clean)
    ) || null;
}

module.exports = {
    loadPersistentUsers,
    savePersistentUser,
    findPersistentUser
};
