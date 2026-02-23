const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();
const authorizeRoles = authorize('admin', 'manager');

// POST /api/orders — Place an order
router.post('/', auth, async (req, res) => {
    try {
        const { items, total, payment_method, shipping_address, phone, coupon_code } = req.body;

        if (!items || !items.length) {
            return res.status(400).json({ error: 'Cart is empty.' });
        }

        // Validate stock and collect cost prices
        const itemDetails = [];
        const costAtOrder = [];

        for (const item of items) {
            const product = await Product.findByPk(item.product_id);
            if (!product) return res.status(404).json({ error: `Product ${item.name} not found.` });
            if (product.stock < item.quantity) {
                return res.status(400).json({ error: `Insufficient stock for ${product.name}.` });
            }

            // Deduct stock
            product.stock -= item.quantity;
            await product.save();

            costAtOrder.push({
                product_id: product.id,
                cost_price: product.cost_price || 0,
                quantity: item.quantity
            });
        }

        const order = await Order.create({
            user_id: req.user.id,
            items,
            total,
            payment_method,
            shipping_address,
            phone,
            coupon_code,
            cost_at_order: costAtOrder,
            status: 'confirmed'
        });

        res.status(201).json({ order, message: 'Order placed successfully!' });
    } catch (err) {
        console.error('Order error:', err);
        res.status(500).json({ error: 'Failed to place order.' });
    }
});

// PUT /api/orders/:id/ship — Mark as shipped (Admin/Manager only)
router.post('/:id/ship', auth, authorize('admin'), async (req, res) => {
    try {
        const { tracking_number, courier_name } = req.body;
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

// GET /api/orders — User's order history
router.get('/', auth, async (req, res) => {
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

// GET /api/orders — Admin/Manager order management
router.get('/', authorizeRoles, async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const where = {};
        if (status) where.status = status;

        const orders = await Order.findAll({
            where,
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
                { model: Product, as: 'products', attributes: ['id', 'name', 'price', 'images'] }
            ],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit)
        });

        res.json({ orders });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch orders.' });
    }
});

// GET /api/orders/:id — Get single order (Admin/Manager only)
router.get('/:id', authorizeRoles, async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
                { model: Product, as: 'products', attributes: ['id', 'name', 'price', 'images'] }
            ]
        });
        if (!order) return res.status(404).json({ error: 'Order not found.' });
        res.json({ order });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch order.' });
    }
});

// PUT /api/orders/:id/status — Update order status (Admin only)
router.put('/:id/status', auth, authorize('admin'), async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        const { status } = req.body;
        await order.update({ status });
        res.json({ message: 'Order status updated successfully', order });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

module.exports = router;