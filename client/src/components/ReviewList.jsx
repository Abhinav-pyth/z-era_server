import { FiStar, FiUser } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

export default function ReviewList({ reviews }) {
    const { t } = useLanguage();

    if (!reviews || reviews.length === 0) {
        return (
            <div className="no-reviews text-center" style={{ padding: '40px 0' }}>
                <p>{t('noReviewsYet')}</p>
                <p style={{ color: 'var(--text-muted)' }}>{t('beFirstToReview')}</p>
            </div>
        );
    }

    return (
        <div className="review-list" style={{ marginTop: '24px' }}>
            <h3>{t('customerReviews')} ({reviews.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                {reviews.map(review => (
                    <div key={review.id} className="review-item glass-card" style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiUser />
                                <span style={{ fontWeight: 600 }}>{review.User?.name || 'Anonymous'}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '2px' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <FiStar
                                        key={star}
                                        fill={star <= review.rating ? '#fbbf24' : 'none'}
                                        stroke="#fbbf24"
                                        size={14}
                                    />
                                ))}
                            </div>
                        </div>
                        <p style={{ color: 'var(--text-secondary)' }}>{review.comment}</p>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {new Date(review.created_at).toLocaleDateString()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
