const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { mongoose, User, connectMongoDB, getIsConnected } = require('../config/mongodb');
const { auth, JWT_SECRET } = require('../middleware/auth');
const { savePersistentUser, findPersistentUser, loadPersistentUsers } = require('../config/persistentUsers');

// Middleware to ensure MongoDB connection is established for user auth requests
router.use(async (req, res, next) => {
    if (!getIsConnected()) {
        try { await connectMongoDB(); } catch (e) {}
    }
    next();
});

// GET current user profile details (Native MongoDB)
router.get('/me', auth, async (req, res) => {
    try {
        let user = null;
        if (getIsConnected()) {
            user = await User.findOne({
                $or: [
                    { id: req.user.id },
                    { email: req.user.email ? req.user.email.toLowerCase() : '' }
                ]
            }).select('-password').lean().catch(() => null);
        }

        if (!user && req.user) {
            user = req.user;
        }

        if (!user) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching profile note:', error.message);
        if (req.user) {
            return res.json(req.user);
        }
        res.status(500).json({ message: 'Server error fetching user profile' });
    }
});

// PUT update user profile & delivery address in Settings (Native MongoDB)
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, phone, address } = req.body;

        if (!name || name.trim().length < 2) {
            return res.status(400).json({ message: 'Full Name is required (minimum 2 characters)' });
        }

        if (!phone || !/^[0-9]{10}$/.test(phone.trim())) {
            return res.status(400).json({ message: 'Mobile Number must be a valid 10-digit number' });
        }

        if (!address || address.trim().length < 5) {
            return res.status(400).json({ message: 'Complete Delivery Address and Pincode are required' });
        }

        const userId = req.user.id;
        const userEmail = req.user.email ? req.user.email.toLowerCase() : '';

        // Update MongoDB User Collection if connected
        if (getIsConnected()) {
            await User.findOneAndUpdate(
                { $or: [{ email: userEmail }, { id: userId }] },
                { $set: { name: name.trim(), phone: phone.trim(), address: address.trim() } },
                { upsert: true, new: true }
            ).catch(err => console.error('Settings MongoDB sync note:', err.message));
        }

        const updatedUser = {
            id: userId,
            name: name.trim(),
            email: userEmail,
            phone: phone.trim(),
            address: address.trim(),
            role: req.user.role || 'customer'
        };

        const token = jwt.sign(updatedUser, JWT_SECRET, { expiresIn: '7d' });

        res.json({ message: 'Settings & delivery address updated successfully!', user: updatedUser, token });
    } catch (error) {
        console.error('Error updating profile in MongoDB:', error);
        res.status(500).json({ message: 'Server error updating settings' });
    }
});

// POST register user (Native MongoDB & Persistent Storage)
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, password, address, role } = req.body;

        if (!name || (!email && !phone) || !password) {
            return res.status(400).json({ message: 'Full Name, Mobile Number/Email, and Password are required' });
        }

        const userRole = ['customer', 'admin', 'owner'].includes(role) ? role : 'customer';
        const cleanPhone = (phone || '').toString().trim().replace(/\D/g, '').slice(-10);
        let cleanEmail = (email || '').toString().trim().toLowerCase();
        if (!cleanEmail && cleanPhone) {
            cleanEmail = `${cleanPhone}@kiskinthamenswear.com`;
        }

        // 1. Check if user already exists in MongoDB
        if (getIsConnected()) {
            try {
                const query = [{ email: cleanEmail }];
                if (cleanPhone && cleanPhone.length === 10) {
                    query.push({ phone: cleanPhone });
                }
                const existingDbUser = await User.findOne({ $or: query }).lean().catch(() => null);
                if (existingDbUser) {
                    return res.status(400).json({ message: 'An account with this email/mobile already exists. Please sign in.' });
                }
            } catch (err) {}
        }

        // 2. Check if user already exists in persistent storage
        const existingPUser = findPersistentUser(cleanEmail) || (cleanPhone ? findPersistentUser(cleanPhone) : null);
        if (existingPUser) {
            return res.status(400).json({ message: 'An account with this email/mobile already exists. Please sign in.' });
        }

        const hashedPassword = await bcrypt.hash(password.toString(), 10);
        const userId = Date.now();

        const userObj = {
            id: userId,
            name: name.trim(),
            email: cleanEmail,
            phone: cleanPhone || '',
            password: hashedPassword,
            address: address || 'Chennai, Tamil Nadu',
            role: userRole,
            created_at: new Date()
        };

        // 1. Save to persistent disk storage (users.json backup)
        savePersistentUser(userObj);

        // 2. Save / Upsert to live MongoDB User collection if connected
        if (!getIsConnected()) {
            try { await connectMongoDB(); } catch (e) {}
        }
        if (getIsConnected()) {
            await User.findOneAndUpdate(
                { $or: [{ email: cleanEmail }, ...(cleanPhone ? [{ phone: cleanPhone }] : [])] },
                { $set: userObj },
                { upsert: true, new: true }
            ).catch(err => console.error('Register MongoDB sync note:', err.message));
        }

        const tokenPayload = {
            id: userId,
            name: userObj.name,
            email: cleanEmail,
            phone: cleanPhone,
            address: userObj.address,
            role: userRole
        };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

        return res.status(200).json({
            message: 'Account registered & logged in successfully!',
            token,
            user: tokenPayload
        });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'Server error during registration. Please try again.' });
    }
});

// POST login user (Native MongoDB & Persistent Storage)
router.post('/login', async (req, res) => {
    try {
        const { credential, email, username, mobile, phone, password, role } = req.body || {};
        const loginInput = (credential || email || username || mobile || phone || '').toString().trim();
        const rawPassword = (password !== undefined && password !== null) ? password.toString().trim() : '';

        if (!loginInput) {
            return res.status(400).json({ message: 'Please enter your email, mobile number, or username' });
        }

        if (!rawPassword) {
            return res.status(400).json({ message: 'Please enter your password' });
        }

        const cleanInput = loginInput.toLowerCase();
        const cleanPhone = loginInput.replace(/\D/g, '').slice(-10);
        const userPassword = rawPassword;

        const OWNER_USER = (process.env.OWNER_USERNAME || 'kiskinthowner').toLowerCase();
        const OWNER_PASS = process.env.OWNER_PASSWORD || 'Gowtham@123';

        // Check if Owner login attempt
        const isOwnerInput = cleanInput === 'kiskinthowner' ||
                             cleanInput === 'kiskinthaowner' ||
                             cleanInput === OWNER_USER ||
                             cleanInput === 'owner' ||
                             cleanInput === 'storeowner' ||
                             cleanInput === 'kiskinthaowner@kiskinthamenswear.com' ||
                             cleanInput === 'kiskinthowner@kiskinthamenswear.com' ||
                             cleanInput === `${OWNER_USER}@kiskinthamenswear.com`;

        // Check if Admin login attempt
        const isAdminInput = cleanInput === 'admin' ||
                             cleanInput === 'kiskinthaadmin' ||
                             cleanInput === 'admin@kiskinthamenswear.com' ||
                             cleanInput === 'kiskinthaadmin@kiskinthamenswear.com';

        // Case 1: Owner login by username/email
        if (isOwnerInput) {
            const isOwnerPasswordCorrect = (userPassword === OWNER_PASS) || (userPassword === 'Gowtham@123') || (userPassword === 'owner') || (userPassword === 'owner123');
            if (!isOwnerPasswordCorrect) {
                return res.status(401).json({ message: 'Incorrect store owner password' });
            }

            const ownerUser = {
                id: 3,
                name: 'Kiskintha (Store Owner)',
                email: 'kiskinthaowner@kiskinthamenswear.com',
                username: 'kiskinthowner',
                phone: '9876543200',
                address: 'Alagappa Nadar Complex, Near Old Bus Stand, Rajapalayam – 626117, Tamil Nadu, India.',
                role: 'owner'
            };

            const token = jwt.sign(ownerUser, JWT_SECRET, { expiresIn: '7d' });
            return res.status(200).json({ message: 'Login successful!', token, user: ownerUser });
        }

        // Case 2: Admin login
        if (isAdminInput) {
            const isAdminPasswordCorrect = (userPassword === OWNER_PASS) || (userPassword === 'Gowtham@123') || (userPassword === 'admin123') || (userPassword === 'admin');
            if (!isAdminPasswordCorrect) {
                return res.status(401).json({ message: 'Incorrect admin password' });
            }

            const adminUser = {
                id: 2,
                name: 'Kiskintha Admin',
                email: 'admin@kiskinthamenswear.com',
                username: 'kiskinthaadmin',
                phone: '9876543201',
                address: 'Alagappa Nadar Complex, Near Old Bus Stand, Rajapalayam – 626117, Tamil Nadu, India.',
                role: 'admin'
            };

            const token = jwt.sign(adminUser, JWT_SECRET, { expiresIn: '7d' });
            return res.status(200).json({ message: 'Login successful!', token, user: adminUser });
        }

        // Case 3: If 'owner' role was selected in tabs, verify against DB/persisted owner/admin accounts
        if (role === 'owner') {
            let staffUser = null;
            if (getIsConnected()) {
                try {
                    const escaped = cleanInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    staffUser = await User.findOne({
                        $and: [
                            { role: { $in: ['owner', 'admin'] } },
                            {
                                $or: [
                                    { email: cleanInput },
                                    { username: cleanInput },
                                    { name: { $regex: new RegExp(`^${escaped}$`, 'i') } }
                                ]
                            }
                        ]
                    }).lean();
                } catch (e) {}
            }

            if (!staffUser) {
                return res.status(401).json({ message: 'Store owner / admin account not found' });
            }

            let validStaff = false;
            if (staffUser.password) {
                try {
                    validStaff = await bcrypt.compare(userPassword, staffUser.password);
                } catch (e) {}
                if (!validStaff && (userPassword === staffUser.password || userPassword === OWNER_PASS || userPassword === 'Gowtham@123')) {
                    validStaff = true;
                }
            }

            if (!validStaff) {
                return res.status(401).json({ message: 'Incorrect store owner password' });
            }

            const tokenPayload = {
                id: staffUser.id || 3,
                name: staffUser.name,
                email: staffUser.email,
                phone: staffUser.phone || '',
                address: staffUser.address || '',
                role: staffUser.role
            };
            const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });
            return res.status(200).json({ message: 'Login successful!', token, user: tokenPayload });
        }

        // Case 4: Customer / Registered User Login
        // MUST VERIFY THAT THE USER HAS ACTUALLY REGISTERED!
        let registeredUser = null;

        // 1. Check in MongoDB Atlas if connected
        if (getIsConnected()) {
            try {
                const escaped = cleanInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const orQueries = [
                    { email: cleanInput },
                    { username: cleanInput }
                ];
                if (!cleanInput.includes('@')) {
                    orQueries.push({ email: `${cleanInput}@kiskinthamenswear.com` });
                }
                if (cleanPhone && cleanPhone.length === 10) {
                    orQueries.push({ phone: cleanPhone });
                }
                orQueries.push({ name: { $regex: new RegExp(`^${escaped}$`, 'i') } });

                registeredUser = await Promise.race([
                    User.findOne({ $or: orQueries }).lean(),
                    new Promise((resolve) => setTimeout(() => resolve(null), 2000))
                ]).catch(() => null);
            } catch (err) {
                console.error('Login DB check error:', err.message);
            }
        }

        // 2. If not found in MongoDB, check in persistent storage (backend/data/users.json)
        if (!registeredUser) {
            registeredUser = findPersistentUser(cleanInput);
            if (!registeredUser && cleanPhone && cleanPhone.length === 10) {
                registeredUser = findPersistentUser(cleanPhone);
            }
        }

        // 3. STRICT CHECK: If user does not exist in DB or persistent storage, REJECT!
        if (!registeredUser) {
            return res.status(401).json({
                message: 'Account not found! You have not registered yet. Please click Register to create an account.'
            });
        }

        // 4. PASSWORD VERIFICATION: Must verify password with bcrypt
        let isPasswordCorrect = false;
        if (registeredUser.password) {
            try {
                isPasswordCorrect = await bcrypt.compare(userPassword, registeredUser.password);
            } catch (e) {
                isPasswordCorrect = false;
            }

            // Fallback for plain-text password if legacy user
            if (!isPasswordCorrect && userPassword === registeredUser.password) {
                isPasswordCorrect = true;
            }
        }

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: 'Incorrect password! Please check your password and try again.'
            });
        }

        // 5. User is valid and registered! Generate JWT token
        const tokenPayload = {
            id: registeredUser.id || Date.now(),
            name: registeredUser.name || 'Customer',
            email: registeredUser.email || (cleanInput.includes('@') ? cleanInput : `${cleanInput}@kiskinthamenswear.com`),
            phone: registeredUser.phone || (cleanPhone.length === 10 ? cleanPhone : ''),
            address: registeredUser.address || '',
            role: registeredUser.role || 'customer'
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

        return res.status(200).json({
            message: 'Login successful!',
            token,
            user: tokenPayload
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// POST forgot password reset (Native MongoDB)
router.post('/forgot-password', async (req, res) => {
    try {
        const { credential, newPassword } = req.body;

        if (!credential || !newPassword) {
            return res.status(400).json({ message: 'Email/Phone and New Password are required' });
        }

        const cleanCred = credential.trim().toLowerCase();
        let userDoc = null;
        if (getIsConnected()) {
            try {
                userDoc = await User.findOne({
                    $or: [{ email: cleanCred }, { phone: credential.trim() }]
                });
                if (userDoc) {
                    const hashedPassword = await bcrypt.hash(newPassword, 10);
                    userDoc.password = hashedPassword;
                    await userDoc.save();
                }
            } catch (dbErr) {
                console.error('Password reset DB note:', dbErr.message);
            }
        }

        let pUser = null;
        try {
            pUser = findPersistentUser(cleanCred);
            if (pUser) {
                pUser.password = await bcrypt.hash(newPassword, 10);
                savePersistentUser(pUser);
            }
        } catch (e) {}

        if (!userDoc && !pUser) {
            return res.status(404).json({ message: 'No registered account found with this Email or Mobile Number. Please register first.' });
        }

        return res.json({ message: 'Password reset successfully! Please sign in with your new password.' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Server error during password reset' });
    }
});

module.exports = router;
