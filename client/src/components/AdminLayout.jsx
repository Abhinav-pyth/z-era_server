import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLayout, FiPackage, FiShoppingBag, FiArrowLeft, FiEdit3, FiBarChart2, FiUser } from 'react-icons/fi';

const AdminLayout = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    const menuItems = [
        { label: 'Dashboard', icon: <FiLayout />, path: '/admin', roles: ['admin', 'manager'] },
        { label: 'Products', icon: <FiPackage />, path: '/admin/products', roles: ['admin'] },
        { label: 'Product Management', icon: <FiEdit3 />, path: '/admin/product-management', roles: ['admin'] },
        { label: 'Orders', icon: <FiShoppingBag />, path: '/admin/orders', roles: ['admin', 'manager'] },
        { label: 'Reports', icon: <FiBarChart2 />, path: '/admin/reports', roles: ['admin'] },
        { label: 'Tasks', icon: <FiUser />, path: '/admin/tasks', roles: ['admin', 'manager'] },
    ];

    if (!user || !['admin', 'manager'].includes(user.role)) {
        return <div className="p-20 text-center">Access Denied.</div>;
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
                <div className="p-6 border-b border-slate-100 mb-6">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Z-era Control
                    </h2>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {menuItems.filter(item => item.roles.includes(user.role)).map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${location.pathname === item.path
                                ? 'bg-purple-50 text-purple-700'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-6 mt-auto">
                    <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-sm">
                        <FiArrowLeft /> Back to Store
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;