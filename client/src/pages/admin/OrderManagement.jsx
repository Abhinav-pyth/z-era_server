import { useState, useEffect } from 'react';
import { getAllOrders, shipOrder, updateOrderStatus } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
    pending: { bg: '#fef3c7', text: '#92400e' },
    confirmed: { bg: '#dbeafe', text: '#1e40af' },
    shipped: { bg: '#d1fae5', text: '#065f46' },
    delivered: { bg: '#f0fdf4', text: '#14532d' },
    cancelled: { bg: '#fee2e2', text: '#991b1b' },
};

const OrderManagement = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [trackingModal, setTrackingModal] = useState(null); // { orderId, tracking, courier }
    const [saving, setSaving] = useState(false);

    const fetchOrders = async () => {
        try {
            const params = filterStatus ? { status: filterStatus } : {};
            const data = await getAllOrders(params);
            setOrders(data.orders || []);
        } catch (err) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, [filterStatus]);

    const handleShip = async () => {
        if (!trackingModal?.tracking || !trackingModal?.courier) {
            return toast.error('Please fill in all tracking details');
        }
        setSaving(true);
        try {
            await shipOrder(trackingModal.orderId, {
                tracking_number: trackingModal.tracking,
                courier_name: trackingModal.courier
            });
            toast.success('Order marked as Shipped!');
            setTrackingModal(null);
            fetchOrders();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        if (user.role !== 'admin') return;
        try {
            await updateOrderStatus(orderId, newStatus);
            toast.success('Status updated!');
            fetchOrders();
        } catch (err) {
            toast.error(err.message);
        }
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><div className="spinner"></div></div>;

    return (
        <div style={{ padding: '2rem', minHeight: '100vh', background: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Order Fulfillment</h1>
                    <p style={{ color: '#64748b', margin: '4px 0 0' }}>
                        {user?.role === 'manager' ? 'Update shipment tracking for confirmed orders' : 'Manage all orders and update statuses'}
                    </p>
                </div>
                <span style={{ background: '#7c3aed', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                    {user?.role === 'admin' ? 'Admin View' : 'Manager View'}
                </span>
            </div>

            {/* Status Filters */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {['', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => (
                    <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        style={{
                            padding: '6px 16px', borderRadius: '20px', border: '1px solid',
                            borderColor: filterStatus === s ? '#7c3aed' : '#e2e8f0',
                            background: filterStatus === s ? '#7c3aed' : 'white',
                            color: filterStatus === s ? 'white' : '#475569',
                            cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem'
                        }}
                    >
                        {s || 'All Orders'}
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            {['Order ID', 'Customer', 'Items', 'Amount', 'Status', 'Date', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No orders found</td></tr>
                        ) : orders.map(order => {
                            const colors = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
                            const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items || '[]');
                            return (
                                <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#7c3aed' }}>#{order.id}</td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>{order.user?.name || 'Customer'}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{order.user?.phone || ''}</div>
                                    </td>
                                    <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: '#475569' }}>
                                        {items.length} item{items.length !== 1 ? 's' : ''}
                                    </td>
                                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0f172a' }}>
                                        ₹{parseFloat(order.total).toLocaleString('en-IN')}
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        {user?.role === 'admin' ? (
                                            <select
                                                value={order.status}
                                                onChange={e => handleStatusChange(order.id, e.target.value)}
                                                style={{
                                                    padding: '4px 8px', fontSize: '0.8rem', fontWeight: 600,
                                                    background: colors.bg, color: colors.text,
                                                    border: 'none', borderRadius: '20px', cursor: 'pointer'
                                                }}
                                            >
                                                {Object.keys(STATUS_COLORS).map(s => (
                                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, background: colors.bg, color: colors.text }}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: '#94a3b8' }}>
                                        {new Date(order.created_at).toLocaleDateString('en-IN')}
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        {order.tracking_number ? (
                                            <div style={{ fontSize: '0.75rem' }}>
                                                <div style={{ fontWeight: 700, color: '#10b981' }}>📦 {order.courier_name}</div>
                                                <div style={{ color: '#64748b' }}>{order.tracking_number}</div>
                                            </div>
                                        ) : order.status === 'confirmed' ? (
                                            <button
                                                onClick={() => setTrackingModal({ orderId: order.id, tracking: '', courier: '' })}
                                                style={{
                                                    padding: '6px 14px', background: '#7c3aed', color: 'white',
                                                    border: 'none', borderRadius: '8px', cursor: 'pointer',
                                                    fontSize: '0.8rem', fontWeight: 600
                                                }}
                                            >
                                                🚚 Add Tracking
                                            </button>
                                        ) : (
                                            <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>—</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Tracking Modal */}
            {trackingModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', width: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
                        <h2 style={{ margin: '0 0 1.5rem', fontWeight: 800, color: '#0f172a' }}>Add Tracking Info</h2>
                        <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Order #{trackingModal.orderId}</p>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '6px', fontSize: '0.85rem' }}>Courier Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Delhivery, FedEx, BlueDart"
                                value={trackingModal.courier}
                                onChange={e => setTrackingModal(p => ({ ...p, courier: e.target.value }))}
                                style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '6px', fontSize: '0.85rem' }}>Tracking Number</label>
                            <input
                                type="text"
                                placeholder="e.g. DL12345678"
                                value={trackingModal.tracking}
                                onChange={e => setTrackingModal(p => ({ ...p, tracking: e.target.value }))}
                                style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.9rem', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setTrackingModal(null)}
                                style={{ flex: 1, padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, color: '#475569', background: 'white' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleShip}
                                disabled={saving}
                                style={{ flex: 1, padding: '12px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}
                            >
                                {saving ? 'Saving...' : '🚚 Mark Shipped'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
