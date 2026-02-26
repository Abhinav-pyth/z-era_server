const express = require('express');
const { Op } = require('sequelize');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, authorize } = require('../middleware/auth');
const ExcelJS = require('exceljs');

const router = express.Router();
const authorizeRoles = authorize('admin', 'manager');

// GET /api/analytics/stats — Today & Week Stats (Admin/Manager)
router.get('/stats', auth, authorizeRoles, async (req, res) => {
    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);

        // Today's Orders
        const todayOrders = await Order.findAll({
            where: { created_at: { [Op.gte]: todayStart } }
        });

        // Weekly Orders
        const weekOrders = await Order.findAll({
            where: { created_at: { [Op.gte]: weekStart } }
        });

        const calculateStats = (orders) => {
            let totalSales = 0;
            let totalProfit = 0;
            orders.forEach(order => {
                totalSales += parseFloat(order.total);
                // Profit calculation: total - sum(cost_at_order)
                if (order.cost_at_order) {
                    const cost = order.cost_at_order.reduce((acc, curr) => acc + (curr.cost_price * curr.quantity), 0);
                    totalProfit += (order.total - cost);
                }
            });
            return { count: orders.length, sales: totalSales, profit: totalProfit };
        };

        res.json({
            today: calculateStats(todayOrders),
            week: calculateStats(weekOrders)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch analytics.' });
    }
});

// GET /api/analytics/export — Export Orders to Excel
router.get('/export', auth, authorize('admin'), async (req, res) => {
    try {
        const orders = await Order.findAll({ order: [['created_at', 'DESC']] });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Orders');

        worksheet.columns = [
            { header: 'Order ID', key: 'id', width: 10 },
            { header: 'Date', key: 'date', width: 20 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Total (₹)', key: 'total', width: 15 },
            { header: 'Payment', key: 'payment', width: 15 },
            { header: 'Phone', key: 'phone', width: 15 }
        ];

        orders.forEach(order => {
            worksheet.addRow({
                id: order.id,
                date: order.created_at.toISOString().split('T')[0],
                status: order.status,
                total: order.total,
                payment: order.payment_method,
                phone: order.phone
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=orders_report.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to export report.' });
    }
});

module.exports = router;