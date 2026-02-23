const express = require('express');
const Coupon = require('../models/Coupon');
const { Op } = require('sequelize');

const router = express.Router();

// POST /api/coupons/validate
router.post('/validate', async (req, res) => {
    try {
        const { code, amount } = req.body;

        if (!code) return res.status(400).json({ error: 'Code is required' });

        const coupon = await Coupon.findOne({
            where: {
                code,
                is_active: true,
                [Op.or]: [
                    { expires_at: null },
                    { expires_at: { [Op.gt]: new Date() } }
                ]
            }
        });

        if (!coupon) {
            return res.status(404).json({ error: 'Invalid or expired coupon code.' });
        }

        if (amount < coupon.min_purchase) {
            return res.status(400).json({
                error: `Minimum purchase of ₹${coupon.min_purchase} required for this coupon.`
            });
        }

        let discount = 0;
        if (coupon.discount_type === 'percentage') {
            discount = (amount * coupon.discount_value) / 100;
        } else {
            discount = coupon.discount_value;
        }

        res.json({
            message: 'Coupon applied!',
            code: coupon.code,
            discount: parseFloat(discount).toFixed(2),
            type: coupon.discount_type,
            value: coupon.discount_value
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to validate coupon.' });
    }
});

module.exports = router;
