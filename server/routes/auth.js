const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required.' });
        }

        const existing = await User.findOne({ where: { email } });
        if (existing) {
            return res.status(409).json({ error: 'Email already registered.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hashed, phone });

        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role }
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Server error during signup.' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role }
        });
    } catch (err) {
        console.error('Login error:', err);
        console.log('FULL ERROR OBJECT:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
        res.status(500).json({ error: 'Server error during login.' });
    }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'name', 'email', 'phone', 'role']
        });
        if (!user) return res.status(404).json({ error: 'User not found.' });
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});

// PUT /api/auth/profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, phone } = req.body;
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found.' });

        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;

        await user.save();

        res.json({
            message: 'Profile updated successfully!',
            user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role }
        });
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ error: 'Failed to update profile.' });
    }
});

// GET /api/auth/debug — Temporary: decode current token and show DB user data
router.get('/debug', async (req, res) => {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer ')) {
            return res.json({ error: 'No token provided in Authorization header' });
        }
        const token = header.split(' ')[1];
        const decoded = jwt.decode(token); // no verify, just decode

        if (!decoded) return res.json({ error: 'Could not decode token' });

        const dbUser = await User.findByPk(decoded.id, { attributes: ['id', 'name', 'email', 'role'] });

        res.json({
            token_payload: { id: decoded.id, email: decoded.email, name: decoded.name, role: decoded.role },
            db_user: dbUser ? dbUser.toJSON() : null,
            issue: !dbUser ? 'User not found in DB' : (!dbUser.role ? 'DB user has no role' : 'Looks OK — role is ' + dbUser.role)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/auth/make-admin — Temporary: promote current user to admin
router.post('/make-admin', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        await user.update({ role: 'admin' });

        // Generate new token with role
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.json({ message: `${user.email} is now admin!`, token, user: { ...user.toJSON(), role: 'admin' } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
