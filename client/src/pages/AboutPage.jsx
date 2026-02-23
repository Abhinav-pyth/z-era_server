import { useConfig } from '../context/ConfigContext';
import { FiInstagram, FiTwitter } from 'react-icons/fi';
import { SiTiktok } from 'react-icons/si';

export default function AboutPage() {
    const { config } = useConfig();
    const brand = config?.brand || {};

    const values = [
        { icon: '🌱', title: 'Sustainable', description: 'Eco-conscious materials and ethical production for a better tomorrow.' },
        { icon: '✨', title: 'Bold Design', description: 'Fashion-forward styles that let you express your unique identity.' },
        { icon: '💜', title: 'Community', description: 'Built by Gen-Z, for Gen-Z. Your voice shapes what we create.' },
        { icon: '🚀', title: 'Innovation', description: 'Cutting-edge comfort tech meets streetwear aesthetics.' },
        { icon: '🤝', title: 'Inclusive', description: 'Every size, every shade, every style. No exceptions.' },
        { icon: '⚡', title: 'Fast & Fresh', description: 'New drops every week. Always ahead of the trend curve.' }
    ];

    return (
        <div className="about-page">
            {/* Hero */}
            <div className="about-hero">
                <div className="container">
                    <h1 className="fade-in-up">{brand.name || 'Z-era'}</h1>
                    <p className="tagline fade-in-up" style={{ animationDelay: '0.1s' }}>
                        {brand.tagline || 'Walk the Future'}
                    </p>
                </div>
            </div>

            {/* Story */}
            <section className="about-section">
                <div className="container">
                    <div className="about-content">
                        <h2>Our Story</h2>
                        <p>{brand.description || 'We are a bold, Gen-Z women\'s footwear brand redefining style with comfort.'}</p>
                        <p>{brand.mission || 'To empower every woman to step into her confidence with footwear that\'s sustainable, stylish, and unapologetically bold.'}</p>
                        {brand.founded && (
                            <p style={{ marginTop: 24 }}>
                                <span style={{
                                    display: 'inline-block',
                                    padding: '8px 24px',
                                    background: 'rgba(139, 92, 246, 0.1)',
                                    border: '1px solid var(--border-accent)',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '0.9rem'
                                }}>
                                    Est. {brand.founded} 🔥
                                </span>
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="about-section" style={{ background: 'var(--bg-secondary)' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>What We Stand For</h2>
                        <p>More than just footwear — it's a movement</p>
                    </div>
                    <div className="values-grid">
                        {values.map((v, i) => (
                            <div key={i} className="value-card glass-card fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                                <span className="value-icon">{v.icon}</span>
                                <h3>{v.title}</h3>
                                <p>{v.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Social / Connect */}
            <section className="about-section">
                <div className="container">
                    <div className="about-content">
                        <h2>Let's Connect</h2>
                        <p>Follow us for daily inspo, behind-the-scenes looks, and exclusive drops.</p>
                        <div className="social-links">
                            <a href={brand.socialLinks?.instagram || '#'} className="social-link" target="_blank" rel="noopener noreferrer">
                                <FiInstagram size={22} />
                            </a>
                            <a href={brand.socialLinks?.twitter || '#'} className="social-link" target="_blank" rel="noopener noreferrer">
                                <FiTwitter size={22} />
                            </a>
                            <a href={brand.socialLinks?.tiktok || '#'} className="social-link" target="_blank" rel="noopener noreferrer">
                                <SiTiktok size={20} />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
