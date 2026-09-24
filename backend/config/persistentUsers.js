const fs = require('fs');
const path = require('path');
const os = require('os');

const DATA_DIR = process.env.VERCEL 
    ? path.join(os.tmpdir(), 'garments_data')
    : path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const BUNDLED_USERS_FILE = path.join(__dirname, '../data/users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {}
}

// Ensure initial file is seeded from bundled data on serverless startup
if (process.env.VERCEL && !fs.existsSync(USERS_FILE) && fs.existsSync(BUNDLED_USERS_FILE)) {
    try {
        fs.copyFileSync(BUNDLED_USERS_FILE, USERS_FILE);
    } catch (e) {}
}

// Load persistent users from JSON file with bundled fallback
function loadPersistentUsers() {
    try {
        let users = [];
        if (fs.existsSync(USERS_FILE)) {
            const raw = fs.readFileSync(USERS_FILE, 'utf8');
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) users = parsed;
        } else if (fs.existsSync(BUNDLED_USERS_FILE)) {
            const raw = fs.readFileSync(BUNDLED_USERS_FILE, 'utf8');
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) users = parsed;
        }

        // Also merge any bundled users that might be missing
        if (fs.existsSync(BUNDLED_USERS_FILE)) {
            try {
                const bRaw = fs.readFileSync(BUNDLED_USERS_FILE, 'utf8');
                const bParsed = JSON.parse(bRaw);
                if (Array.isArray(bParsed)) {
                    const existingEmails = new Set(users.map(u => (u.email || '').toLowerCase().trim()));
                    bParsed.forEach(bUser => {
                        const bEmail = (bUser.email || '').toLowerCase().trim();
                        if (bEmail && !existingEmails.has(bEmail)) {
                            users.push(bUser);
                        }
                    });
                }
            } catch (bErr) {}
        }

        return users;
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
        const cleanPhone = (userObj.phone || '').trim().replace(/\D/g, '').slice(-10);

        const idx = users.findIndex(u => 
            (cleanEmail && u.email && u.email.toLowerCase().trim() === cleanEmail) ||
            (cleanPhone && cleanPhone.length === 10 && u.phone && u.phone.replace(/\D/g, '').slice(-10) === cleanPhone) ||
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
    const cleanDigits = clean.replace(/\D/g, '').slice(-10);
    const users = loadPersistentUsers();
    return users.find(u => {
        const uEmail = (u.email || '').toLowerCase().trim();
        const uPhone = (u.phone || '').trim();
        const uPhoneDigits = uPhone.replace(/\D/g, '').slice(-10);
        const uUsername = (u.username || '').toLowerCase().trim();
        const uName = (u.name || '').toLowerCase().trim();

        if (uEmail && uEmail === clean) return true;
        if (cleanDigits && cleanDigits.length === 10 && uPhoneDigits === cleanDigits) return true;
        if (uPhone && uPhone === clean) return true;
        if (uUsername && uUsername === clean) return true;
        if (uName && uName === clean) return true;
        return false;
    }) || null;
}

module.exports = {
    loadPersistentUsers,
    savePersistentUser,
    findPersistentUser
};
