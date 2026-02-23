const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');
const Category = require('./Category');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    original_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Category, key: 'id' }
    },
    sizes: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    colors: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    images: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    cost_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
    },
    is_featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_new: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    rating: {
        type: DataTypes.DECIMAL(2, 1),
        defaultValue: 0.0
    },
    tier: {
        type: DataTypes.ENUM('premium', 'budget'),
        defaultValue: 'budget'
    }
}, {
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });

module.exports = Product;
