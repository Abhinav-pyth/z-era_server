import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiPhone } from 'react-icons/fi';

export default function SignupPage() {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            await signup(form.name, form.email, form.password, form.phone);
            toast.success('Account created! Welcome to Z-era 🎉');
            navigate('/');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Jane Doe', icon: <FiUser />, required: true },
        { key: 'email', label: 'Email', type: 'email', placeholder: 'jane@example.com', icon: <FiMail />, required: true },
        { key: 'password', label: 'Password', type: 'password', placeholder: '6+ characters', icon: <FiLock />, required: true },
        { key: 'phone', label: 'Phone (optional)', type: 'tel', placeholder: '+91 98765 43210', icon: <FiPhone />, required: false },
    ];

    return (
        <div className="auth-page">
            <div className="auth-card glass-card">
                <h1>Join Z-era</h1>
                <p className="subtitle">Create your account and step into the future</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {fields.map(f => (
                        <div className="input-group" key={f.key}>
                            <label className="input-label">{f.label}</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={f.type}
                                    className="input-field"
                                    placeholder={f.placeholder}
                                    value={form[f.key]}
                                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                                    required={f.required}
                                    style={{ paddingLeft: 42 }}
                                    id={`signup-${f.key}`}
                                />
                                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>
                                    {f.icon}
                                </span>
                            </div>
                        </div>
                    ))}

                    <button type="submit" className="btn btn-primary" disabled={loading} id="signup-submit">
                        {loading ? 'Creating account...' : 'Create Account →'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Sign In</Link>
                </div>
            </div>
        </div>
    );
}
