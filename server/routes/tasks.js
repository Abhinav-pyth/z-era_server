const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Task = require('../models/Task');
const User = require('../models/User');

// Get all tasks (admin/manager)
router.get('/', auth, authorize('admin', 'manager'), async (req, res) => {
    try {
        const tasks = await Task.findAll({
            include: [{
                model: User,
                as: 'assignedTo',
                attributes: ['id', 'name', 'email']
            }, {
                model: User,
                as: 'createdBy',
                attributes: ['id', 'name', 'email']
            }]
        });
        res.json({ tasks });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Get task by ID
router.get('/:id', auth, authorize('admin', 'manager'), async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id, {
            include: [{
                model: User,
                as: 'assignedTo',
                attributes: ['id', 'name', 'email']
            }, {
                model: User,
                as: 'createdBy',
                attributes: ['id', 'name', 'email']
            }]
        });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json({ task });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch task' });
    }
});

// Create new task (admin only)
router.post('/', auth, authorize('admin'), async (req, res) => {
    try {
        const { title, description, assigned_to, priority } = req.body;
        const task = await Task.create({
            title,
            description,
            assigned_to,
            priority,
            created_by: req.user.id
        });
        const fullTask = await Task.findByPk(task.id, {
            include: [{
                model: User,
                as: 'assignedTo',
                attributes: ['id', 'name', 'email']
            }, {
                model: User,
                as: 'createdBy',
                attributes: ['id', 'name', 'email']
            }]
        });
        res.status(201).json({ task: fullTask });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Update task (admin/manager if assigned to them)
router.put('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        // Check permissions
        if (req.user.role === 'manager' && task.assigned_to !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const { title, description, status, priority } = req.body;
        await task.update({ title, description, status, priority });

        const fullTask = await Task.findByPk(task.id, {
            include: [{
                model: User,
                as: 'assignedTo',
                attributes: ['id', 'name', 'email']
            }, {
                model: User,
                as: 'createdBy',
                attributes: ['id', 'name', 'email']
            }]
        });
        res.json({ task: fullTask });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Delete task (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        await task.destroy();
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

module.exports = router;