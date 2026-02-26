import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLayout, FiPackage, FiShoppingBag, FiArrowLeft, FiBarChart2 } from 'react-icons/fi';

const AdminLayout = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    const menuItems = [
        { label: 'Dashboard', icon: <FiLayout />, path: '/admin', roles: ['admin', 'manager'] },
        { label: 'Products', icon: <FiPackage />, path: '/admin/products', roles: ['admin', 'manager'] },
        { label: 'Orders', icon: <FiShoppingBag />, path: '/admin/orders', roles: ['admin', 'manager'] },
        { label: 'Reports', icon: <FiBarChart2 />, path: '/admin/reports', roles: ['admin', 'manager'] },
    ];

    if (!user || !['admin', 'manager'].includes(user.role)) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>Access Denied</h2>
                    <p style={{ color: '#64748b' }}>You do not have permission to view this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                background: 'white',
                borderRight: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                left: 0,
                top: 0,
                zIndex: 10
            }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', marginBottom: '20px' }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        background: 'linear-gradient(to right, #7c3aed, #4f46e5)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Z-era Control
                    </h2>
                </div>

                <nav style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {menuItems.filter(item => item.roles.includes(user.role)).map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                transition: 'all 0.2s ease',
                                background: location.pathname === item.path ? '#f5f3ff' : 'transparent',
                                color: location.pathname === item.path ? '#7c3aed' : '#64748b'
                            }}
                        >
                            <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div style={{ padding: '24px', borderTop: '1px solid #f1f5f9' }}>
                    <Link to="/" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#94a3b8',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: 500
                    }}>
                        <FiArrowLeft /> Back to Store
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{
                flex: 1,
                marginLeft: '260px', // Space for fixed sidebar
                minWidth: 0 // Prevent content overflow
            }}>
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
