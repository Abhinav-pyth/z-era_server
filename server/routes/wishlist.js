const express = require('express');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

const router = express.Router();

// POST /api/wishlist — Toggle wishlist status
router.post('/', auth, async (req, res) => {
    try {
        const { product_id } = req.body;
        if (!product_id) return res.status(400).json({ error: 'Product ID is required.' });

        const existing = await Wishlist.findOne({
            where: { user_id: req.user.id, product_id }
        });

        if (existing) {
            await existing.destroy();
            return res.json({ message: 'Removed from wishlist.', action: 'removed' });
        } else {
            await Wishlist.create({ user_id: req.user.id, product_id });
            return res.status(201).json({ message: 'Added to wishlist.', action: 'added' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to update wishlist.' });
    }
});

// GET /api/wishlist — Get user's wishlist
router.get('/', auth, async (req, res) => {
    try {
        const wishlistItems = await Wishlist.findAll({
            where: { user_id: req.user.id }
        });

        const productIds = wishlistItems.map(item => item.product_id);
        const products = await Product.findAll({
            where: { id: productIds }
        });

        res.json({ products });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch wishlist.' });
    }
});

module.exports = router;
