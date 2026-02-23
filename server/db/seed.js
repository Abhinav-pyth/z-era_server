require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const sequelize = require('./db');
const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Wishlist = require('../models/Wishlist');
require('../models/associations');
const appConfig = require('../config/appConfig.json');

const seedDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected');

        await sequelize.sync({ force: true });
        console.log('✅ Tables recreated');

        // Seed categories from config
        const categories = {};
        for (const cat of appConfig.categories) {
            const created = await Category.create({
                name: cat.name,
                slug: cat.slug,
                icon: cat.icon,
                description: cat.description,
                is_active: true
            });
            categories[cat.slug] = created.id;
        }
        console.log('✅ Categories seeded');

        // Seed products
        const products = [
            // Sandals
            {
                name: 'Aurora Slide Sandal',
                description: 'Minimalist slide sandal with cushioned sole and matte finish. Perfect for everyday vibes.',
                price: 1299,
                original_price: 1799,
                category_id: categories['sandals'],
                sizes: [5, 6, 7, 8, 9],
                colors: ['Black', 'Beige', 'Pink'],
                images: ['/images/sandal1.jpg'],
                stock: 45,
                cost_price: 650,
                is_featured: true,
                is_new: true,
                rating: 4.5,
                tier: 'budget'
            },
            {
                name: 'Neon Wave Strappy',
                description: 'Bold strappy sandal with neon accents and anti-slip sole. Stand out on any surface.',
                price: 1599,
                original_price: 2199,
                category_id: categories['sandals'],
                sizes: [4, 5, 6, 7, 8],
                colors: ['Multi', 'Black', 'White'],
                images: ['/images/sandal2.jpg'],
                stock: 30,
                cost_price: 800,
                is_featured: false,
                is_new: true,
                rating: 4.2,
                tier: 'budget'
            },
            {
                name: 'Cloud Nine Platform',
                description: 'Chunky platform sandal with memory foam insole. Elevate your look, literally.',
                price: 2499,
                original_price: 3199,
                category_id: categories['sandals'],
                sizes: [5, 6, 7, 8, 9, 10],
                colors: ['White', 'Pink', 'Gold'],
                images: ['/images/sandal3.jpg'],
                stock: 20,
                cost_price: 1200,
                is_featured: true,
                is_new: false,
                rating: 4.7,
                tier: 'premium'
            },
            {
                name: 'Zen Garden Toe Ring',
                description: 'Delicate toe ring sandal with braided detail. Quiet luxury meets barefoot comfort.',
                price: 999,
                original_price: 1499,
                category_id: categories['sandals'],
                sizes: [5, 6, 7, 8],
                colors: ['Brown', 'Black', 'Beige'],
                images: ['/images/sandal4.jpg'],
                stock: 55,
                cost_price: 500,
                is_featured: false,
                is_new: false,
                rating: 4.0,
                tier: 'budget'
            },

            // Flats
            {
                name: 'Midnight Ballet Flat',
                description: 'Classic ballet flat with a twist — metallic shimmer finish and arch support. Day to night ready.',
                price: 1799,
                original_price: 2499,
                category_id: categories['flats'],
                sizes: [5, 6, 7, 8, 9],
                colors: ['Black', 'Silver', 'Gold'],
                images: ['/images/flat1.jpg'],
                stock: 40,
                cost_price: 900,
                is_featured: true,
                is_new: true,
                rating: 4.6,
                tier: 'budget'
            },
            {
                name: 'Pixel Point Loafer',
                description: 'Pointed-toe loafer with digital-print lining. Business meets streetwear.',
                price: 2299,
                original_price: 2999,
                category_id: categories['flats'],
                sizes: [5, 6, 7, 8, 9, 10],
                colors: ['Black', 'Brown', 'Red'],
                images: ['/images/flat2.jpg'],
                stock: 25,
                cost_price: 1100,
                is_featured: true,
                is_new: false,
                rating: 4.4,
                tier: 'premium'
            },
            {
                name: 'Daydream Moccasin',
                description: 'Soft suede moccasin with tassel detail. Cozy enough for home, stylish enough for brunch.',
                price: 1499,
                original_price: 1999,
                category_id: categories['flats'],
                sizes: [4, 5, 6, 7, 8, 9],
                colors: ['Beige', 'Blue', 'Pink'],
                images: ['/images/flat3.jpg'],
                stock: 35,
                cost_price: 750,
                is_featured: false,
                is_new: true,
                rating: 4.3,
                tier: 'budget'
            },
            {
                name: 'Grid Walk Espadrille',
                description: 'Woven espadrille flat with jute trim. Summer vacation energy, all year round.',
                price: 1199,
                original_price: 1699,
                category_id: categories['flats'],
                sizes: [5, 6, 7, 8],
                colors: ['White', 'Beige', 'Blue'],
                images: ['/images/flat4.jpg'],
                stock: 50,
                cost_price: 600,
                is_featured: false,
                is_new: false,
                rating: 4.1,
                tier: 'budget'
            },

            // Sneakers
            {
                name: 'Genesis Retro Runner',
                description: 'Retro-inspired chunky sneaker with gradient mesh upper. Run the streets in style.',
                price: 3499,
                original_price: 4499,
                category_id: categories['sneakers'],
                sizes: [5, 6, 7, 8, 9, 10, 11],
                colors: ['White', 'Pink', 'Multi'],
                images: ['/images/sneaker1.jpg'],
                stock: 30,
                cost_price: 1800,
                is_featured: true,
                is_new: true,
                rating: 4.8,
                tier: 'premium'
            },
            {
                name: 'Flux Canvas High-Top',
                description: 'Canvas high-top with custom graffiti print and extra-thick sole. Art on your feet.',
                price: 2799,
                original_price: 3599,
                category_id: categories['sneakers'],
                sizes: [5, 6, 7, 8, 9, 10],
                colors: ['Multi', 'Black', 'White'],
                images: ['/images/sneaker2.jpg'],
                stock: 20,
                cost_price: 1400,
                is_featured: true,
                is_new: true,
                rating: 4.6,
                tier: 'premium'
            },
            {
                name: 'Aero Knit Slip-On',
                description: 'Ultra-lightweight knit sneaker with slip-on design. Like walking on air with zero effort.',
                price: 1999,
                original_price: 2599,
                category_id: categories['sneakers'],
                sizes: [5, 6, 7, 8, 9],
                colors: ['Black', 'White', 'Pink'],
                images: ['/images/sneaker3.jpg'],
                stock: 45,
                cost_price: 1000,
                is_featured: false,
                is_new: true,
                rating: 4.5,
                tier: 'budget'
            },
            {
                name: 'Prism Platform Sneaker',
                description: 'Holographic platform sneaker that shifts color in light. Future-proof fashion.',
                price: 3999,
                original_price: 4999,
                category_id: categories['sneakers'],
                sizes: [5, 6, 7, 8, 9, 10],
                colors: ['Silver', 'Multi', 'White'],
                images: ['/images/sneaker4.jpg'],
                stock: 15,
                cost_price: 2000,
                is_featured: true,
                is_new: false,
                rating: 4.9,
                tier: 'premium'
            },

            // Boots
            {
                name: 'Midnight Combat Boot',
                description: 'Durable faux leather combat boot with side zip and chunky tread. Command attention.',
                price: 4499,
                original_price: 5999,
                category_id: categories['boots'],
                sizes: [5, 6, 7, 8, 9, 10],
                colors: ['Black', 'Deep Red'],
                images: ['/images/boot1.jpg'],
                stock: 25,
                cost_price: 2200,
                is_featured: true,
                is_new: true,
                rating: 4.8,
                tier: 'premium'
            },
            {
                name: 'Desert Storm Chelsea',
                description: 'Classic Chelsea boot with elastic side panels and pull tab. Effortless cool in matte finish.',
                price: 3299,
                original_price: 3999,
                category_id: categories['boots'],
                sizes: [6, 7, 8, 9, 10, 11],
                colors: ['Tan', 'Sand', 'Black'],
                images: ['/images/boot2.jpg'],
                stock: 40,
                cost_price: 1600,
                is_featured: false,
                is_new: true,
                rating: 4.5,
                tier: 'budget'
            },

            // Heels
            {
                name: 'Starlight Stiletto',
                description: 'Sleek stiletto heel with shimmering strap and padded footbed. Dance until dawn.',
                price: 2999,
                original_price: 4499,
                category_id: categories['heels'],
                sizes: [4, 5, 6, 7, 8],
                colors: ['Silver', 'Gold', 'Black'],
                images: ['/images/heel1.jpg'],
                stock: 20,
                cost_price: 1500,
                is_featured: true,
                is_new: true,
                rating: 4.7,
                tier: 'premium'
            },
            {
                name: 'Velvet Dream Block Heel',
                description: 'Soft velvet finish with a stable block heel. Vintage style meets modern comfort.',
                price: 1899,
                original_price: 2499,
                category_id: categories['heels'],
                sizes: [5, 6, 7, 8, 9],
                colors: ['Emerald', 'Burgundy', 'Black'],
                images: ['/images/heel2.jpg'],
                stock: 35,
                cost_price: 900,
                is_featured: false,
                is_new: false,
                rating: 4.4,
                tier: 'budget'
            }
        ];

        await Product.bulkCreate(products);
        console.log(`✅ ${products.length} products seeded`);

        // Seed Users (Admin & Manager)
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);

        await User.bulkCreate([
            {
                name: 'Admin User',
                email: 'admin@z-era.com',
                password: await bcrypt.hash('admin123', salt),
                role: 'admin'
            },
            {
                name: 'Manager User',
                email: 'manager@z-era.com',
                password: await bcrypt.hash('manager123', salt),
                role: 'manager'
            },
            {
                name: 'Demo Customer',
                email: 'customer@z-era.com',
                password: await bcrypt.hash('customer123', salt),
                role: 'user'
            }
        ]);
        console.log('✅ Admin, Manager, and Customer seeded');

        console.log('\n🎉 Database seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed error:', err);
        process.exit(1);
    }
};

seedDatabase();
