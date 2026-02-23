const express = require('express');
const Review = require('../models/Review');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// POST /api/reviews — Submit a review
router.post('/', auth, async (req, res) => {
    try {
        const { product_id, rating, comment } = req.body;
        if (!product_id || !rating) {
            return res.status(400).json({ error: 'Product ID and rating are required.' });
        }

        const review = await Review.create({
            user_id: req.user.id,
            product_id,
            rating,
            comment
        });

        res.status(201).json({ review, message: 'Review submitted successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to submit review.' });
    }
});

// GET /api/reviews/product/:id — Get reviews for a product
router.get('/product/:id', async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: { product_id: req.params.id },
            include: [{
                model: User,
                attributes: ['name']
            }],
            order: [['created_at', 'DESC']]
        });
        res.json({ reviews });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reviews.' });
    }
});

module.exports = router;
