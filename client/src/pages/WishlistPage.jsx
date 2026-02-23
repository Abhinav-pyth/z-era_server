import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import * as api from '../api/api';
import ProductCard from '../components/ProductCard';
import { FiHeart } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

export default function WishlistPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchWishlist();
    }, [user]);

    const fetchWishlist = async () => {
        try {
            const data = await api.getWishlist();
            setProducts(data.products || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-state">Loading...</div>;

    return (
        <div className="wishlist-page container section-padding">
            <div className="section-header">
                <h2>{t('myWishlist')}</h2>
                <p>{t('myWishlistDesc')}</p>
            </div>

            {products.length === 0 ? (
                <div className="empty-wishlist text-center">
                    <FiHeart size={64} style={{ color: 'var(--accent-primary)', marginBottom: '24px', opacity: 0.5 }} />
                    <h3>{t('emptyWishlist')}</h3>
                    <p>{t('emptyWishlistDesc')}</p>
                    <Link to="/" className="btn btn-primary" style={{ marginTop: '24px' }}>
                        {t('browseProducts')}
                    </Link>
                </div>
            ) : (
                <div className="products-grid">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
