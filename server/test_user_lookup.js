require('dotenv').config();
// Load all models the same way index.js does
require('./models/User');
require('./models/Category');
require('./models/Product');
require('./models/Order');
require('./models/Wishlist');
require('./models/Review');
require('./models/Coupon');
require('./models/associations');

const User = require('./models/User');

async function testLookup() {
    try {
        // Find admin user (id=1)
        const user = await User.findByPk(1, { attributes: ['id', 'email', 'name', 'role'] });
        console.log('findByPk result:', user ? user.toJSON() : 'NOT FOUND');

        // Also try finding by email
        const user2 = await User.findOne({ where: { email: 'admin@z-era.com' } });
        console.log('findOne result:', user2 ? user2.toJSON() : 'NOT FOUND');

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

testLookup();
