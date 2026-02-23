const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');
const User = require('./User');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: User, key: 'id' }
    },
    items: {
        type: DataTypes.JSON,
        allowNull: false
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    payment_method: {
        type: DataTypes.ENUM('COD', 'UPI'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending'
    },
    shipping_address: {
        type: DataTypes.JSON,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    tracking_number: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    courier_name: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    shipped_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    cost_at_order: {
        type: DataTypes.JSON, // Stores cost prices of items at time of purchase
        allowNull: true
    }
}, {
    tableName: 'orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });

module.exports = Order;
