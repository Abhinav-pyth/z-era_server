import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../../api/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2, FiUser, FiClock, FiFlag } from 'react-icons/fi';

const TaskManagement = () => {
    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assigned_to: '',
        priority: 'medium'
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const data = await getTasks();
            setTasks(data.tasks);
        } catch (err) {
            toast.error('Failed to fetch tasks');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTask) {
                await updateTask(editingTask.id, formData);
                toast.success('Task updated successfully');
            } else {
                await createTask(formData);
                toast.success('Task created successfully');
            }
            setShowForm(false);
            setEditingTask(null);
            setFormData({ title: '', description: '', assigned_to: '', priority: 'medium' });
            fetchTasks();
        } catch (err) {
            toast.error('Failed to save task');
        }
    };

    const handleDelete = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteTask(taskId);
                toast.success('Task deleted successfully');
                fetchTasks();
            } catch (err) {
                toast.error('Failed to delete task');
            }
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setFormData({
            title: task.title,
            description: task.description,
            assigned_to: task.assigned_to.id,
            priority: task.priority
        });
        setShowForm(true);
    };

    const users = [
        { id: 1, name: 'Admin User', email: 'admin@example.com' },
        { id: 2, name: 'Manager User', email: 'manager@example.com' }
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Task Management</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-medium"
                >
                    <FiPlus /> New Task
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">
                        {editingTask ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Assigned To
                                </label>
                                <select
                                    value={formData.assigned_to}
                                    onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                >
                                    <option value="">Select User</option>
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Priority
                                </label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                rows={3}
                            />
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-medium"
                            >
                                {editingTask ? 'Update' : 'Create'} Task
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingTask(null);
                                    setFormData({ title: '', description: '', assigned_to: '', priority: 'medium' });
                                }}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm font-medium">
                        <tr>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Assigned To</th>
                            <th className="px-6 py-4">Priority</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {tasks.map(task => (
                            <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-800">
                                    {task.title}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <FiUser />
                                        <span>{task.assignedTo.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${task.priority === 'low' ? 'bg-green-100 text-green-700' :
                                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-red-100 text-red-700'
                                        }`}>
                                        {task.priority.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${task.status === 'pending' ? 'bg-gray-100 text-gray-700' :
                                            task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                                task.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    'bg-red-100 text-red-700'
                                        }`}>
                                        {task.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex gap-3 text-gray-400">
                                    <button
                                        onClick={() => handleEdit(task)}
                                        className="hover:text-purple-600"
                                    >
                                        <FiEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(task.id)}
                                        className="hover:text-red-500"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TaskManagement;