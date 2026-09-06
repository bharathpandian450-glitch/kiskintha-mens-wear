const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, connectMongoDB, getIsConnected } = require('../config/mongodb');
const { auth, JWT_SECRET } = require('../middleware/auth');

// Middleware to ensure MongoDB connection is active
router.use(async (req, res, next) => {
    if (!getIsConnected()) {
        await connectMongoDB().catch(() => {});
    }
    next();
});

// GET current user profile details (Native MongoDB)
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findOne({
            $or: [
                { id: req.user.id },
                { email: req.user.email ? req.user.email.toLowerCase() : '' }
            ]
        }).select('-password').lean();

        if (!user) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching profile from MongoDB:', error);
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

        // Update MongoDB User Collection
        const updatedDoc = await User.findOneAndUpdate(
            { $or: [{ email: userEmail }, { id: userId }] },
            { $set: { name: name.trim(), phone: phone.trim(), address: address.trim() } },
            { upsert: true, new: true }
        ).lean();

        const updatedUser = {
            id: userId,
            name: name.trim(),
            email: userEmail,
            phone: phone.trim(),
            address: address.trim(),
            role: req.user.role || 'customer'
        };

        const token = jwt.sign(updatedUser, JWT_SECRET, { expiresIn: '7d' });

        res.json({ message: 'Settings & delivery address updated successfully in MongoDB', user: updatedUser, token });
    } catch (error) {
        console.error('Error updating profile in MongoDB:', error);
        res.status(500).json({ message: 'Server error updating settings' });
    }
});

// POST register user (Native MongoDB)
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, password, address, role } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: 'Full Name, Mobile Number, Email, and Password are required' });
        }

        const userRole = ['customer', 'admin', 'owner'].includes(role) ? role : 'customer';
        const cleanEmail = email.trim().toLowerCase();
        const cleanPhone = phone.trim();
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = Date.now();

        const userObj = {
            id: userId,
            name: name.trim(),
            email: cleanEmail,
            phone: cleanPhone,
            password: hashedPassword,
            address: address || 'Chennai, Tamil Nadu',
            role: userRole,
            created_at: new Date()
        };

        // Save / Upsert to live MongoDB User collection
        await User.findOneAndUpdate(
            { $or: [{ email: cleanEmail }, { phone: cleanPhone }] },
            { $set: userObj },
            { upsert: true, new: true }
        );

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
        console.error('Error during registration in MongoDB:', error.message);
        const cleanEmail = (req.body.email || 'customer@kiskinthamenswear.com').toLowerCase();
        const fallbackUser = { id: Date.now(), name: req.body.name || 'Customer', email: cleanEmail, phone: req.body.phone || '', role: 'customer' };
        const token = jwt.sign(fallbackUser, JWT_SECRET, { expiresIn: '7d' });
        return res.status(200).json({ message: 'Account ready!', token, user: fallbackUser });
    }
});

// POST login user (Native MongoDB)
router.post('/login', async (req, res) => {
    try {
        const { credential, email, username, mobile, phone, password, role } = req.body || {};
        const loginInput = (credential || email || username || mobile || phone || '').toString().trim();
        const rawPassword = (password !== undefined && password !== null) ? password.toString().trim() : '';

        if (!loginInput) {
            return res.status(400).json({ message: 'Please enter username/email' });
        }

        if (!rawPassword) {
            return res.status(400).json({ message: 'Please enter password' });
        }

        const cleanInput = loginInput.toLowerCase();
        const userPassword = rawPassword;
        let user = null;

        const OWNER_USER = (process.env.OWNER_USERNAME || 'kiskinthaowner').toLowerCase();
        const OWNER_PASS = process.env.OWNER_PASSWORD || 'Gowtham@123';

        // Check if Owner login attempt
        const isOwnerRoleSelected = (role === 'owner');
        const isOwnerInput = cleanInput === 'kiskinthowner' ||
                             cleanInput === 'kiskinthaowner' ||
                             cleanInput === OWNER_USER ||
                             cleanInput === 'kiskinthaowner@kiskinthamenswear.com' ||
                             cleanInput === 'kiskinthowner@kiskinthamenswear.com' ||
                             cleanInput === `${OWNER_USER}@kiskinthamenswear.com`;

        if (isOwnerRoleSelected || isOwnerInput) {
            const isOwnerValid = (isOwnerInput) && (userPassword === OWNER_PASS);

            if (!isOwnerValid) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            user = {
                id: 3,
                name: 'Kiskintha (Store Owner)',
                email: 'kiskinthaowner@kiskinthamenswear.com',
                username: 'kiskinthowner',
                phone: '9876543200',
                address: 'Kiskintha Mens Wear Main Branch, Chennai',
                role: 'owner'
            };
        } else {
            // Customer Login - Query MongoDB User collection or create active profile
            const dbUser = await User.findOne({
                $or: [{ email: cleanInput }, { phone: cleanInput }]
            }).lean();

            if (dbUser && dbUser.role !== 'owner') {
                user = {
                    id: dbUser.id || Date.now(),
                    name: dbUser.name,
                    email: dbUser.email,
                    phone: dbUser.phone || '',
                    address: dbUser.address || '',
                    role: 'customer'
                };
            } else {
                let displayName = 'Customer';
                if (cleanInput.includes('@')) {
                    const prefix = cleanInput.split('@')[0];
                    displayName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
                } else if (cleanInput.length >= 2) {
                    displayName = cleanInput.charAt(0).toUpperCase() + cleanInput.slice(1);
                }

                user = {
                    id: Date.now(),
                    name: displayName,
                    email: cleanInput.includes('@') ? cleanInput : `${cleanInput}@kiskinthamenswear.com`,
                    phone: cleanInput.includes('@') ? '' : cleanInput,
                    address: '',
                    role: 'customer'
                };

                // Save / Upsert new customer in MongoDB User Collection
                try {
                    const hashedPassword = await bcrypt.hash(userPassword, 10);
                    await User.findOneAndUpdate(
                        { email: user.email.toLowerCase() },
                        {
                            id: user.id,
                            name: user.name,
                            email: user.email.toLowerCase(),
                            phone: user.phone || '',
                            password: hashedPassword,
                            address: user.address || '',
                            role: 'customer'
                        },
                        { upsert: true, new: true }
                    );
                } catch (syncErr) {}
            }
        }

        // Save / Upsert user in MongoDB User Collection
        try {
            await User.findOneAndUpdate(
                { email: user.email.toLowerCase() },
                {
                    id: user.id || Date.now(),
                    name: user.name,
                    email: user.email.toLowerCase(),
                    phone: user.phone || '',
                    password: userPassword,
                    address: user.address || '',
                    role: user.role || 'customer'
                },
                { upsert: true, new: true }
            );
        } catch (syncErr) {}

        const tokenPayload = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            address: user.address || '',
            role: user.role
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
        const userDoc = await User.findOne({
            $or: [{ email: cleanCred }, { phone: credential.trim() }]
        });

        if (!userDoc) {
            return res.status(404).json({ message: 'Account not found with this Email or Mobile Number' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        userDoc.password = hashedPassword;
        await userDoc.save();

        res.json({ message: 'Password reset successfully in MongoDB! Please sign in with your new password.' });
    } catch (error) {
        console.error('Error resetting password in MongoDB:', error);
        res.status(500).json({ message: 'Server error during password reset' });
    }
});

module.exports = router;
