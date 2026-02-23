import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { FiStar } from 'react-icons/fi';
import * as api from '../api/api';
import { toast } from 'react-hot-toast';

export default function ReviewForm({ productId, onReviewAdded }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { t } = useLanguage();
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error(t('pleaseLogin'));
            return;
        }
        setSubmitting(true);
        try {
            await api.submitReview({ product_id: productId, rating, comment });
            toast.success(t('reviewSuccess'));
            setComment('');
            if (onReviewAdded) onReviewAdded();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className="review-form glass-card" onSubmit={handleSubmit} style={{ padding: '24px', marginTop: '24px' }}>
            <h3>{t('writeAReview')}</h3>
            <div className="rating-input" style={{ display: 'flex', gap: '8px', margin: '16px 0' }}>
                {[1, 2, 3, 4, 5].map(star => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        <FiStar
                            fill={star <= rating ? '#fbbf24' : 'none'}
                            stroke="#fbbf24"
                            size={24}
                        />
                    </button>
                ))}
            </div>
            <textarea
                className="form-control"
                placeholder={t('comment')}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                style={{ width: '100%', minHeight: '100px', marginBottom: '16px' }}
            />
            <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? '...' : t('submitReview')}
            </button>
        </form>
    );
}
