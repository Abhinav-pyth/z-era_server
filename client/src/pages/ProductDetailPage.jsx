import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../api/api';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiShoppingBag, FiArrowLeft, FiStar, FiHeart } from 'react-icons/fi';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addItem, setIsOpen } = useCart();
    const { t } = useLanguage();
    const { user } = useAuth();

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            api.getProduct(id),
            api.getReviews(id)
        ]).then(([prodData, revData]) => {
            setProduct(prodData.product);
            setReviews(revData.reviews || []);
        })
            .catch(err => { console.error(err); navigate('/'); })
            .finally(() => setLoading(false));
    }, [id, navigate]);

    const handleAddToCart = () => {
        if (!selectedSize) {
            toast.error(t('pleaseSelectSize'));
            return;
        }
        addItem(product, selectedSize);
        toast.success(t('addedToCart', { name: product.name }));
        setIsOpen(true);
    };

    const handleWishlist = async () => {
        if (!user) {
            toast.error(t('pleaseLogin'));
            return;
        }
        try {
            const res = await api.toggleWishlist(product.id);
            toast.success(res.action === 'added' ? t('addedToWishlist') : t('removedFromWishlist'));
        } catch (err) {
            toast.error(err.message);
        }
    };

    const onReviewAdded = () => {
        api.getReviews(id).then(data => setReviews(data.reviews || []));
    };

    if (loading) return <div className="loader" style={{ minHeight: '100vh' }}><div className="spinner"></div></div>;
    if (!product) return null;

    const categoryIcons = { sandals: '🩴', flats: '🥿', sneakers: '👟' };
    const icon = categoryIcons[product.category?.slug] || '👠';
    const sizes = typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes;
    const discount = product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : 0;

    return (
        <div className="product-detail section-padding">
            <div className="container">
                <button
                    className="btn btn-ghost"
                    onClick={() => navigate(-1)}
                    style={{ marginBottom: 24 }}
                >
                    <FiArrowLeft /> {t('back')}
                </button>

                <div className="product-detail-layout">
                    {/* Image */}
                    <div className="product-gallery">
                        <div className="product-main-image glass-card">
                            <span style={{ fontSize: '8rem' }}>{icon}</span>
                            <div className="product-card-badges">
                                {product.is_new && <span className="badge badge-new">{t('new')}</span>}
                                {discount > 0 && <span className="badge badge-sale">-{discount}%</span>}
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="product-info fade-in-up">
                        <div className="product-category">{product.category?.name || 'Footwear'}</div>
                        <h1>{product.name}</h1>

                        {product.rating > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '12px 0', color: '#fbbf24' }}>
                                {[...Array(5)].map((_, i) => (
                                    <FiStar key={i} size={18} fill={i < Math.round(product.rating) ? '#fbbf24' : 'none'} stroke="#fbbf24" />
                                ))}
                                <span style={{ color: 'var(--text-secondary)', marginLeft: 8, fontSize: '0.9rem' }}>{product.rating}</span>
                            </div>
                        )}

                        <div className="product-price-area">
                            <span className="current">₹{Number(product.price).toLocaleString()}</span>
                            {product.original_price && (
                                <>
                                    <span className="original">₹{Number(product.original_price).toLocaleString()}</span>
                                    <span className="discount">{discount}% OFF</span>
                                </>
                            )}
                        </div>

                        <p className="product-description">{product.description}</p>

                        {/* Size Selector */}
                        <div className="product-sizes">
                            <h4>{t('selectSize')}</h4>
                            <div className="size-options">
                                {sizes?.map(size => (
                                    <button
                                        key={size}
                                        className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Colors */}
                        {product.colors && product.colors.length > 0 && (
                            <div style={{ marginBottom: 24 }}>
                                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-secondary)', marginBottom: 10, fontWeight: 600 }}>
                                    {t('availableColors')}
                                    {selectedColor && <span style={{ color: 'var(--accent-primary)', marginLeft: 8, textTransform: 'none', fontWeight: 700 }}>– {selectedColor}</span>}
                                </h4>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {(typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors).map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                                            style={{
                                                padding: '6px 16px',
                                                borderRadius: '20px',
                                                border: `2px solid ${selectedColor === color ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                                                background: selectedColor === color ? 'var(--accent-primary)' : 'var(--bg-card)',
                                                color: selectedColor === color ? 'white' : 'var(--text-primary)',
                                                cursor: 'pointer',
                                                fontWeight: selectedColor === color ? 700 : 500,
                                                fontSize: '0.85rem',
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="product-actions" style={{ display: 'flex', gap: '16px' }}>
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={handleAddToCart}
                                id="add-to-cart"
                                style={{ flex: 1 }}
                                disabled={product.stock === 0}
                            >
                                <FiShoppingBag /> {product.stock === 0 ? 'Out of Stock' : t('addToCart')}
                            </button>
                            <button className="btn btn-lg btn-white" onClick={handleWishlist} title={t('wishlist')}>
                                <FiHeart />
                            </button>
                        </div>

                        {product.stock != null && (
                            <p style={{ marginTop: 16, fontSize: '0.85rem', color: product.stock > 10 ? 'var(--accent-green)' : 'var(--accent-orange)' }}>
                                {product.stock > 10 ? t('inStock') : t('onlyLeft', { count: product.stock })}
                            </p>
                        )}
                    </div>
                </div>

                <hr style={{ margin: '60px 0', opacity: 0.1 }} />

                <div className="reviews-section" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <ReviewList reviews={reviews} />
                    {user && <ReviewForm productId={id} onReviewAdded={onReviewAdded} />}
                </div>
            </div>

            {/* Mobile Sticky Action Bar */}
            <div className="mobile-sticky-actions">
                <button
                    className="btn btn-primary btn-lg"
                    onClick={handleAddToCart}
                    style={{ flex: 1 }}
                    disabled={product.stock === 0}
                >
                    <FiShoppingBag /> {product.stock === 0 ? 'Out' : t('addToCart')}
                </button>
                <button className="btn btn-icon btn-white" style={{ width: 56, height: 56 }} onClick={handleWishlist}>
                    <FiHeart size={20} />
                </button>
            </div>
        </div>
    );
}
