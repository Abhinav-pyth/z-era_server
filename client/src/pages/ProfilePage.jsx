import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import * as api from '../api/api';
import { toast } from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiSave } from 'react-icons/fi';

export default function ProfilePage() {
    const { user, setUser } = useAuth();
    const { t } = useLanguage();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setPhone(user.phone || '');
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await api.updateProfile({ name, phone });
            setUser(res.user);
            toast.success(t('orderPlacedSuccess')); // Reusing a success toast or add profileUpdateSuccess
            toast.success('Profile updated! ✨');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (!user) return <div className="loader"><div className="spinner"></div></div>;

    return (
        <div className="profile-page container section-padding">
            <div className="section-header">
                <h2>{t('hey')}, {user.name}</h2>
                <p>Manage your account settings and preferences</p>
            </div>

            <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px' }}>
                <form onSubmit={handleUpdate}>
                    <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <FiUser /> {t('fullName')}
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <FiMail /> {t('email')}
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            value={user.email}
                            disabled
                            style={{ opacity: 0.6, cursor: 'not-allowed' }}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <FiPhone /> {t('phone')}
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91..."
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" disabled={saving} style={{ width: '100%' }}>
                        <FiSave style={{ marginRight: '8px' }} /> {saving ? '...' : 'Save Changes'}
                    </button>
                </form>

                <hr style={{ margin: '40px 0', opacity: 0.1 }} />

                <div className="shipping-addresses">
                    <h3 style={{ marginBottom: '20px' }}>Shipping Addresses</h3>
                    {user.shipping_addresses?.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {user.shipping_addresses.map((addr, idx) => (
                                <div key={idx} className="glass-card" style={{ padding: '16px', border: '1px solid var(--border-subtle)' }}>
                                    <p style={{ fontWeight: 600 }}>{addr.name}</p>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        {addr.address}, {addr.city}, {addr.pincode}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-muted)' }}>No saved addresses yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
