import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import * as api from '../api/api';
import { FiPackage, FiClock, FiCheckCircle, FiTruck } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export default function OrdersPage() {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { t } = useLanguage();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await api.getOrders();
                setOrders(data.orders || []);
            } catch (err) {
                toast.error(t('errorFetchingOrders'));
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            if (!user) {
                navigate('/login');
            } else {
                fetchOrders();
            }
        }
    }, [user, authLoading, navigate, t]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered': return <FiCheckCircle className="text-green" />;
            case 'shipped': return <FiTruck className="text-blue" />;
            default: return <FiClock className="text-orange" />;
        }
    };

    if (loading) return <div className="loader"><div className="spinner"></div></div>;

    return (
        <div className="container" style={{ paddingTop: 'calc(var(--nav-height) + 40px)', paddingBottom: '80px' }}>
            <div className="section-header" style={{ textAlign: 'left', marginBottom: '40px' }}>
                <h2>{t('myOrders')}</h2>
                <p>{t('myOrdersDesc')}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {orders.length > 0 ? (
                    orders.map(order => (
                        <div key={order.id} className="glass-card" style={{ padding: '24px' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingBottom: '16px',
                                borderBottom: '1px solid var(--border-subtle)',
                                marginBottom: '16px'
                            }}>
                                <div>
                                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('orderId')}: #{order.id}</h4>
                                    <p style={{ fontSize: '0.85rem' }}>{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', textTransform: 'capitalize' }}>
                                    {getStatusIcon(order.status)}
                                    {order.status}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                                {order.items.map((item, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex',
                                        gap: '12px',
                                        alignItems: 'center',
                                        background: 'var(--bg-secondary)',
                                        padding: '12px',
                                        borderRadius: 'var(--radius-md)',
                                        minWidth: '240px'
                                    }}>
                                        <div style={{ fontSize: '1.5rem' }}>👟</div>
                                        <div>
                                            <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>{item.name}</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                {t('size')}: {item.size} • {t('qty')}: {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: '16px',
                                borderTop: '1px solid var(--border-subtle)'
                            }}>
                                <div>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('payment')}: </span>
                                    <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>{order.payment_method.toUpperCase()}</span>
                                </div>
                                <div style={{ fontSize: '1.2rem', fontWeight: '800', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    ₹{parseFloat(order.total).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon"><FiPackage /></div>
                        <h3>{t('noOrdersYet')}</h3>
                        <p>{t('startShoppingToSeeOrders')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
