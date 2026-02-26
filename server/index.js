require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db/db');

// Import models to register them
require('./models/User');
require('./models/Category');
require('./models/Product');
require('./models/Order');
require('./models/Wishlist');
require('./models/Review');
require('./models/Coupon'); // Added Coupon model import
require('./models/associations');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const configRoutes = require('./routes/config');
const wishlistRoutes = require('./routes/wishlist');
const reviewRoutes = require('./routes/reviews');
const couponRoutes = require('./routes/coupons');
const analyticsRoutes = require('./routes/analytics');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/config', configRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', brand: 'Z-era', timestamp: new Date().toISOString() });
});

// Start server
const start = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected');

        await sequelize.sync({ alter: true });
        console.log('✅ Database synced');

        // Seed coupons safely
        const Coupon = require('./models/Coupon');
        const defaultCoupons = [
            { code: 'LAUNCH10', discount_type: 'percentage', discount_value: 10, min_purchase: 1000 },
            { code: 'WINTER300', discount_type: 'flat', discount_value: 300, min_purchase: 2000 }
        ];

        for (const c of defaultCoupons) {
            await Coupon.findOrCreate({
                where: { code: c.code },
                defaults: c
            });
        }
        console.log('✅ Coupons checked/seeded');

        app.listen(PORT, () => {
            console.log(`🚀 Z-era API running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err.message);
        process.exit(1);
    }
};

start();
