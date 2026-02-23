import { useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiStar, FiHeart } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import * as api from '../api/api';
import { toast } from 'react-hot-toast';

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useLanguage();

    const discount = product.original_price
        ? Math.round((1 - product.price / product.original_price) * 100)
        : 0;

    const categoryIcons = { sandals: '🩴', flats: '🥿', sneakers: '👟' };
    const icon = categoryIcons[product.category?.slug] || '👠';

    const handleWishlist = async (e) => {
        e.stopPropagation();
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

    return (
        <div
            className="product-card glass-card"
            onClick={() => navigate(`/product/${product.id}`)}
            id={`product-${product.id}`}
        >
            <div className="product-card-image">
                <span className="placeholder-img">{icon}</span>
                <div className="product-card-badges">
                    {product.is_new && <span className="badge badge-new">{t('new')}</span>}
                    {discount > 0 && <span className="badge badge-sale">-{discount}%</span>}
                    {product.stock === 0 && <span className="badge badge-out">{t('outOfStock') || 'Out of Stock'}</span>}
                </div>
                <div className="product-card-actions">
                    <button className="btn btn-icon btn-white" onClick={handleWishlist} title={t('wishlist')}>
                        <FiHeart size={16} />
                    </button>
                    <button
                        className="btn btn-icon btn-primary"
                        style={{ width: 38, height: 38, opacity: product.stock === 0 ? 0.5 : 1, cursor: product.stock === 0 ? 'not-allowed' : 'pointer' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (product.stock > 0) navigate(`/product/${product.id}`);
                        }}
                        disabled={product.stock === 0}
                    >
                        <FiShoppingBag size={16} />
                    </button>
                </div>
            </div>

            <div className="product-card-info">
                <div className="product-card-category">
                    {product.category?.name || 'Footwear'}
                </div>
                <h3 className="product-card-name">{product.name}</h3>
                <div className="product-card-price">
                    <span className="price-current">₹{Number(product.price).toLocaleString()}</span>
                    {product.original_price && (
                        <span className="price-original">₹{Number(product.original_price).toLocaleString()}</span>
                    )}
                </div>
                {product.rating > 0 && (
                    <div className="product-card-rating">
                        <FiStar fill="#fbbf24" stroke="#fbbf24" size={14} />
                        <span>{product.rating}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
