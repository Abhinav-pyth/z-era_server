const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }
        const token = header.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // If the old token doesn't contain role, fetch fresh user from DB
        if (!decoded.role) {
            const user = await User.findByPk(decoded.id, { attributes: ['id', 'email', 'name', 'role'] });
            if (!user) return res.status(401).json({ error: 'User not found.' });
            req.user = { id: user.id, email: user.email, name: user.name, role: user.role };
        } else {
            req.user = decoded;
        }
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: `Access denied. Required roles: ${roles.join(', ')}. Your role: ${req.user?.role || 'none'}` });
        }
        next();
    };
};

module.exports = { auth, authorize };
