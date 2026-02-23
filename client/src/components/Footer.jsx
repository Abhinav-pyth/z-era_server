import { Link } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import { FiInstagram, FiTwitter } from 'react-icons/fi';
import { SiTiktok } from 'react-icons/si';

export default function Footer() {
    const { config } = useConfig();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3>{config?.brand?.name || 'Z-era'}</h3>
                        <p>{config?.brand?.description?.slice(0, 120) || 'Bold Gen-Z women\'s footwear.'}...</p>
                        <div className="social-links" style={{ justifyContent: 'flex-start', marginTop: 20 }}>
                            <a href={config?.brand?.socialLinks?.instagram || '#'} className="social-link" target="_blank" rel="noopener noreferrer">
                                <FiInstagram />
                            </a>
                            <a href={config?.brand?.socialLinks?.twitter || '#'} className="social-link" target="_blank" rel="noopener noreferrer">
                                <FiTwitter />
                            </a>
                            <a href={config?.brand?.socialLinks?.tiktok || '#'} className="social-link" target="_blank" rel="noopener noreferrer">
                                <SiTiktok />
                            </a>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Shop</h4>
                        {config?.categories?.map(cat => (
                            <Link key={cat.slug} to={`/?category=${cat.slug}`}>{cat.name}</Link>
                        ))}
                    </div>

                    <div className="footer-col">
                        <h4>Company</h4>
                        <Link to="/about">About Us</Link>
                        <a href="#">Careers</a>
                        <a href="#">Press</a>
                    </div>

                    <div className="footer-col">
                        <h4>Help</h4>
                        <a href="#">FAQs</a>
                        <a href="#">Shipping</a>
                        <a href="#">Returns</a>
                        <a href="#">Contact</a>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} {config?.brand?.name || 'Z-era'}. All rights reserved. Walk the Future.</p>
                </div>
            </div>
        </footer>
    );
}
