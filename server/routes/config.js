const express = require('express');
const appConfig = require('../config/appConfig.json');

const router = express.Router();

// GET /api/config — Returns public app configuration
router.get('/', (req, res) => {
    res.json({
        brand: appConfig.brand,
        categories: appConfig.categories,
        sizes: appConfig.sizes,
        priceRanges: appConfig.priceRanges,
        carousel: appConfig.carousel,
        payment: appConfig.payment,
        colors: appConfig.colors
    });
});

module.exports = router;
