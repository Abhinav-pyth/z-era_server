import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiX, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';

export default function CartDrawer() {
    const navigate = useNavigate();
    const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

    const categoryIcons = { Sandals: '🩴', Flats: '🥿', Sneakers: '👟' };

    return (
        <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)}>
            <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="cart-header">
                    <h2><FiShoppingBag /> Cart ({totalItems})</h2>
                    <button className="btn btn-icon btn-ghost" onClick={() => setIsOpen(false)}>
                        <FiX size={20} />
                    </button>
                </div>

                <div className="cart-items">
                    {items.length === 0 ? (
                        <div className="cart-empty">
                            <div className="cart-empty-icon">🛒</div>
                            <h3 style={{ marginBottom: 8 }}>Your cart is empty</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                Time to treat yourself ✨
                            </p>
                            <button
                                className="btn btn-primary"
                                style={{ marginTop: 20 }}
                                onClick={() => { setIsOpen(false); navigate('/'); }}
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        items.map(item => (
                            <div key={item.key} className="cart-item">
                                <div className="cart-item-img">
                                    {categoryIcons[item.category] || '👠'}
                                </div>
                                <div className="cart-item-details">
                                    <div className="cart-item-name">{item.name}</div>
                                    <div className="cart-item-meta">Size: {item.size}</div>
                                    <div className="cart-item-controls">
                                        <button className="qty-btn" onClick={() => updateQuantity(item.key, item.quantity - 1)}>
                                            <FiMinus size={14} />
                                        </button>
                                        <span style={{ fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                                        <button className="qty-btn" onClick={() => updateQuantity(item.key, item.quantity + 1)}>
                                            <FiPlus size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                                    <span className="cart-item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                                    <span className="cart-item-remove" onClick={() => removeItem(item.key)}>Remove</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total">
                            <span>Total</span>
                            <span>₹{totalPrice.toLocaleString()}</span>
                        </div>
                        <button
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%' }}
                            onClick={() => { setIsOpen(false); navigate('/checkout'); }}
                        >
                            Checkout →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
