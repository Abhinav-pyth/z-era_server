const express = require('express');
const { Op } = require('sequelize');
const Product = require('../models/Product');
const Category = require('../models/Category');
const sequelize = require('../db/db');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();
const authorizeRoles = authorize('admin', 'manager');

// GET /api/products — List with filters
router.get('/', async (req, res) => {
    try {
        const { category, size, priceMin, priceMax, search, sort, featured, isNew, tier, page = 1, limit = 12 } = req.query;

        const where = {};
        const include = [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }];

        // Category filter
        if (category) {
            const cat = await Category.findOne({ where: { slug: category } });
            if (cat) where.category_id = cat.id;
        }

        if (tier) {
            where.tier = tier;
        }

        if (req.query.has_discount === 'true') {
            where.original_price = { [Op.gt]: sequelize.col('price') };
        }

        // Price filter
        if (priceMin || priceMax) {
            where.price = {};
            if (priceMin) where.price[Op.gte] = parseFloat(priceMin);
            if (priceMax) where.price[Op.lte] = parseFloat(priceMax);
        }

        // Search filter
        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        // Featured filter
        if (featured === 'true') where.is_featured = true;

        // New arrivals filter
        if (isNew === 'true') where.is_new = true;

        // Sorting
        let order = [['created_at', 'DESC']];
        if (sort === 'price_asc') order = [['price', 'ASC']];
        else if (sort === 'price_desc') order = [['price', 'DESC']];
        else if (sort === 'name_asc') order = [['name', 'ASC']];
        else if (sort === 'rating') order = [['rating', 'DESC']];
        else if (sort === 'newest') order = [['created_at', 'DESC']];

        const offset = (parseInt(page) - 1) * parseInt(limit);

        const { count, rows } = await Product.findAndCountAll({
            where,
            include,
            order,
            limit: parseInt(limit),
            offset
        });

        // Post-filter by size (JSON field)
        let products = rows;
        if (size) {
            const sizeNum = parseInt(size);
            products = rows.filter(p => {
                const sizes = typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes;
                return sizes.includes(sizeNum);
            });
        }

        res.json({
            products,
            total: size ? products.length : count,
            page: parseInt(page),
            totalPages: Math.ceil((size ? products.length : count) / parseInt(limit))
        });
    } catch (err) {
        console.error('Products fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch products.' });
    }
});

// GET /api/products/featured
router.get('/featured', async (req, res) => {
    try {
        const products = await Product.findAll({
            where: { is_featured: true },
            include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
            limit: 8
        });
        res.json({ products });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch featured products.' });
    }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }]
        });
        if (!product) return res.status(404).json({ error: 'Product not found.' });
        res.json({ product });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch product.' });
    }
});

// POST /api/products - Create product (admin only)
router.post('/', auth, authorize('admin'), async (req, res) => {
    try {
        const { name, description, price, cost_price, category_id, images, stock, sizes, colors, is_featured, is_new, tier, original_price } = req.body;
        const product = await Product.create({
            name, description, price, cost_price: parseFloat(cost_price) || 0,
            category_id, images, stock: parseInt(stock) || 0, sizes, colors,
            is_featured: is_featured || false, is_new: is_new || false,
            tier: tier || 'budget', original_price: original_price || null
        });
        const fullProduct = await Product.findByPk(product.id, {
            include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }]
        });
        res.status(201).json({ product: fullProduct });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create product.' });
    }
});

// PUT /api/products/:id/stock - Quick stock update (admin)
router.put('/:id/stock', auth, authorize('admin'), async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found.' });
        await product.update({ stock: parseInt(req.body.stock) || 0 });
        res.json({ message: 'Stock updated', product });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update stock.' });
    }
});

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', auth, authorize('admin'), async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found.' });
        const updatable = ['name', 'description', 'price', 'cost_price', 'category_id', 'images', 'stock', 'sizes', 'colors', 'is_featured', 'is_new', 'tier', 'original_price', 'rating'];
        const updates = {};
        updatable.forEach(key => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });
        await product.update(updates);
        res.json({ product: await Product.findByPk(product.id, { include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }] }) });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update product.' });
    }
});

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found.' });
        await product.destroy();
        res.json({ message: 'Product deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete product.' });
    }
});

module.exports = router;