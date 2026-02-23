import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import { placeOrder, validateCoupon } from '../api/api';
import toast from 'react-hot-toast';
import { FiMapPin, FiCreditCard, FiCheck } from 'react-icons/fi';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { items, totalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const { config } = useConfig();
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [payment, setPayment] = useState('COD');
    const [address, setAddress] = useState({
        name: user?.name || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });

    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponLoading, setCouponLoading] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setCouponLoading(true);
        try {
            const res = await validateCoupon(couponCode, totalPrice);
            setCouponDiscount(parseFloat(res.discount));
            setAppliedCoupon(res.code);
            toast.success(res.message);
        } catch (err) {
            toast.error(err.message);
            setCouponDiscount(0);
            setAppliedCoupon(null);
        } finally {
            setCouponLoading(false);
        }
    };

    const finalTotal = totalPrice - couponDiscount;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to place an order');
            navigate('/login');
            return;
        }
        if (items.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        setLoading(true);
        try {
            await placeOrder({
                items: items.map(i => ({
                    product_id: i.id,
                    name: i.name,
                    price: i.price,
                    size: i.size,
                    quantity: i.quantity
                })),
                total: finalTotal,
                payment_method: payment,
                shipping_address: {
                    name: address.name,
                    address: address.address,
                    city: address.city,
                    state: address.state,
                    pincode: address.pincode
                },
                phone: address.phone,
                coupon_code: appliedCoupon
            });

            clearCart();
            setOrderPlaced(true);
            toast.success('Order placed successfully! 🎉');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Success screen
    if (orderPlaced) {
        return (
            <div className="order-success">
                <div className="success-icon">
                    <FiCheck size={48} />
                </div>
                <h1>Order Confirmed!</h1>
                <p style={{ marginBottom: 8 }}>Thanks for shopping with Z-era 🎉</p>
                <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>
                    {payment === 'COD' ? 'Pay when your order arrives.' : 'Complete UPI payment to confirm.'}
                </p>
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/')}>
                    Continue Shopping →
                </button>
            </div>
        );
    }

    const categoryIcons = { Sandals: '🩴', Flats: '🥿', Sneakers: '👟' };

    return (
        <div className="checkout-page">
            <div className="container">
                <div className="section-header" style={{ marginBottom: 32 }}>
                    <h2>Checkout</h2>
                </div>

                {items.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🛒</div>
                        <h3>Your cart is empty</h3>
                        <p>Add some awesome footwear first!</p>
                        <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/')}>
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="checkout-layout">
                            {/* Left — Form */}
                            <div>
                                {/* Shipping Address */}
                                <div className="checkout-section glass-card">
                                    <h2><span className="step-num">1</span> <FiMapPin /> Shipping Address</h2>
                                    <div className="address-form">
                                        <div className="input-group">
                                            <label className="input-label">Full Name</label>
                                            <input
                                                className="input-field"
                                                value={address.name}
                                                onChange={(e) => setAddress({ ...address, name: e.target.value })}
                                                required
                                                id="checkout-name"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label">Phone</label>
                                            <input
                                                className="input-field"
                                                type="tel"
                                                value={address.phone}
                                                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                                                required
                                                id="checkout-phone"
                                            />
                                        </div>
                                        <div className="input-group full-width">
                                            <label className="input-label">Address</label>
                                            <input
                                                className="input-field"
                                                value={address.address}
                                                onChange={(e) => setAddress({ ...address, address: e.target.value })}
                                                required
                                                placeholder="House/Flat No., Street, Landmark"
                                                id="checkout-address"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label">City</label>
                                            <input
                                                className="input-field"
                                                value={address.city}
                                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                                required
                                                id="checkout-city"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label">State</label>
                                            <input
                                                className="input-field"
                                                value={address.state}
                                                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                                required
                                                id="checkout-state"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label className="input-label">Pincode</label>
                                            <input
                                                className="input-field"
                                                value={address.pincode}
                                                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                                                required
                                                id="checkout-pincode"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Payment */}
                                <div className="checkout-section glass-card">
                                    <h2><span className="step-num">2</span> <FiCreditCard /> Payment Method</h2>
                                    <div className="payment-options">
                                        <div
                                            className={`payment-option ${payment === 'COD' ? 'selected' : ''}`}
                                            onClick={() => setPayment('COD')}
                                            id="payment-cod"
                                        >
                                            <span className="payment-radio"></span>
                                            <div className="payment-info">
                                                <h4>💵 Cash on Delivery</h4>
                                                <p>Pay when your order arrives at your doorstep</p>
                                            </div>
                                        </div>

                                        <div
                                            className={`payment-option ${payment === 'UPI' ? 'selected' : ''}`}
                                            onClick={() => setPayment('UPI')}
                                            id="payment-upi"
                                        >
                                            <span className="payment-radio"></span>
                                            <div className="payment-info">
                                                <h4>📱 UPI Payment</h4>
                                                <p>Pay via UPI — {config?.payment?.upiId || 'z-era@upi'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {payment === 'UPI' && (
                                        <div style={{
                                            marginTop: 20,
                                            padding: 20,
                                            background: 'rgba(139, 92, 246, 0.08)',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--border-accent)',
                                            textAlign: 'center'
                                        }}>
                                            <p style={{ marginBottom: 8, fontWeight: 600 }}>Scan or pay to UPI ID:</p>
                                            <p style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent-purple)' }}>
                                                {config?.payment?.upiId || 'z-era@upi'}
                                            </p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>
                                                Your order will be confirmed after payment verification
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right — Order Summary */}
                            <div>
                                <div className="order-summary glass-card">
                                    <h3>Order Summary</h3>

                                    {items.map(item => (
                                        <div key={item.key} className="order-item">
                                            <div className="order-item-img">
                                                {categoryIcons[item.category] || '👠'}
                                            </div>
                                            <div className="order-item-details">
                                                <div className="order-item-name">{item.name}</div>
                                                <div className="order-item-meta">Size: {item.size} × {item.quantity}</div>
                                            </div>
                                            <div className="order-item-price">₹{(item.price * item.quantity).toLocaleString()}</div>
                                        </div>
                                    ))}

                                    <div className="order-totals">
                                        <div className="order-total-row">
                                            <span>Subtotal</span>
                                            <span>₹{totalPrice.toLocaleString()}</span>
                                        </div>
                                        <div className="order-total-row">
                                            <span>Delivery</span>
                                            <span style={{ color: 'var(--accent-green)' }}>Free</span>
                                        </div>

                                        {/* Coupon Selection */}
                                        <div className="coupon-section" style={{ margin: '16px 0', padding: '16px 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <input
                                                    className="form-control"
                                                    placeholder="Coupon Code"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                    style={{ flex: 1 }}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={handleApplyCoupon}
                                                    disabled={couponLoading || appliedCoupon === couponCode}
                                                >
                                                    {couponLoading ? '...' : (appliedCoupon === couponCode ? 'Applied' : 'Apply')}
                                                </button>
                                            </div>
                                            {appliedCoupon && (
                                                <div style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                                                    ✓ Coupon "{appliedCoupon}" applied!
                                                </div>
                                            )}
                                        </div>

                                        {couponDiscount > 0 && (
                                            <div className="order-total-row" style={{ color: 'var(--accent-green)' }}>
                                                <span>Discount</span>
                                                <span>-₹{couponDiscount.toLocaleString()}</span>
                                            </div>
                                        )}

                                        <div className="order-total-row grand-total">
                                            <span>Total</span>
                                            <span>₹{finalTotal.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg"
                                        style={{ width: '100%', marginTop: 24 }}
                                        disabled={loading}
                                        id="place-order-btn"
                                    >
                                        {loading ? 'Placing Order...' : `Place Order — ₹${finalTotal.toLocaleString()}`}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
