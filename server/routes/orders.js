const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// POST /api/orders — Place an order (any logged-in user)
router.post('/', auth, async (req, res) => {
    try {
        const { items, total, payment_method, shipping_address, phone, coupon_code } = req.body;

        if (!items || !items.length) {
            return res.status(400).json({ error: 'Cart is empty.' });
        }

        const costAtOrder = [];
        for (const item of items) {
            const product = await Product.findByPk(item.product_id);
            if (!product) return res.status(404).json({ error: `Product ${item.name} not found.` });
            if (product.stock < item.quantity) {
                return res.status(400).json({ error: `Insufficient stock for ${product.name}.` });
            }
            product.stock -= item.quantity;
            await product.save();
            costAtOrder.push({ product_id: product.id, cost_price: parseFloat(product.cost_price) || 0, quantity: item.quantity });
        }

        const order = await Order.create({
            user_id: req.user.id, items, total, payment_method,
            shipping_address, phone, coupon_code, cost_at_order: costAtOrder, status: 'confirmed'
        });

        res.status(201).json({ order, message: 'Order placed successfully!' });
    } catch (err) {
        console.error('Order error:', err);
        res.status(500).json({ error: 'Failed to place order.' });
    }
});

// GET /api/orders/my — User's own order history
router.get('/my', auth, async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { user_id: req.user.id },
            order: [['created_at', 'DESC']]
        });
        res.json({ orders });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch orders.' });
    }
});

// GET /api/orders — All orders (Admin/Manager only)
router.get('/', auth, authorize('admin', 'manager'), async (req, res) => {
    try {
        const { status } = req.query;
        const where = {};
        if (status) where.status = status;
        const orders = await Order.findAll({
            where,
            include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }],
            order: [['created_at', 'DESC']]
        });
        res.json({ orders });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch orders.' });
    }
});

// POST /api/orders/:id/ship — Mark as shipped with tracking (Admin/Manager)
router.post('/:id/ship', auth, authorize('admin', 'manager'), async (req, res) => {
    try {
        const { tracking_number, courier_name } = req.body;
        if (!tracking_number || !courier_name) {
            return res.status(400).json({ error: 'Tracking number and courier name are required.' });
        }
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found.' });

        order.tracking_number = tracking_number;
        order.courier_name = courier_name;
        order.status = 'shipped';
        order.shipped_at = new Date();
        await order.save();
        res.json({ message: 'Order marked as shipped!', order });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update order.' });
    }
});

// PUT /api/orders/:id/status — Update status (Admin only)
router.put('/:id/status', auth, authorize('admin'), async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        await order.update({ status: req.body.status });
        res.json({ message: 'Status updated', order });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

module.exports = router;