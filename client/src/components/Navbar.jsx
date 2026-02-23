import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { FiShoppingBag, FiUser, FiLogOut, FiMenu, FiX, FiMoon, FiSun, FiGlobe, FiPackage, FiHeart } from 'react-icons/fi';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { totalItems, setIsOpen } = useCart();
    const { lang, setLang, t, languages } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);

    const isActive = (path) => location.pathname === path ? 'active' : '';

    const navItems = [
        { to: '/', label: t('home') },
        { to: '/about', label: t('about') },
    ];

    const currentLang = languages.find(l => l.code === lang) || languages[0];

    return (
        <>
            <nav className="navbar" id="main-nav">
                <div className="container">
                    <Link to="/" className="nav-logo">Z-era</Link>

                    <div className="nav-links">
                        {navItems.map(item => (
                            <Link key={item.to} to={item.to} className={`nav-link ${isActive(item.to)}`}>
                                {item.label}
                            </Link>
                        ))}
                        {user && (
                            <>
                                <Link to="/wishlist" className={`nav-link ${isActive('/wishlist')}`} title={t('wishlist')}>
                                    <FiHeart /> {t('wishlist')}
                                </Link>
                                <Link to="/orders" className={`nav-link ${isActive('/orders')}`} title={t('myOrders')}>
                                    <FiPackage /> {t('myOrders')}
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="nav-actions">
                        {/* Language Selector */}
                        <div className="lang-selector">
                            <button className="lang-btn" onClick={() => setLangOpen(!langOpen)}>
                                <span>{currentLang.flag}</span>
                                <span className="lang-name">{currentLang.code.toUpperCase()}</span>
                            </button>
                            {langOpen && (
                                <div className="lang-dropdown">
                                    {languages.map(l => (
                                        <button
                                            key={l.code}
                                            className={`lang-option ${lang === l.code ? 'active' : ''}`}
                                            onClick={() => {
                                                setLang(l.code);
                                                setLangOpen(false);
                                            }}
                                        >
                                            <span>{l.flag}</span>
                                            <span>{l.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Theme Toggle */}
                        <button className="theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? t('lightMode') : t('darkMode')}>
                            {theme === 'dark' ? <FiSun /> : <FiMoon />}
                        </button>

                        <button
                            className="btn btn-icon btn-ghost cart-btn"
                            onClick={() => setIsOpen(true)}
                            id="cart-button"
                        >
                            <FiShoppingBag />
                            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
                        </button>

                        {user ? (
                            <>
                                <Link to="/profile" className="hey-user" style={{ textDecoration: 'none' }}>
                                    {t('hey')}, {user.name.split(' ')[0]}
                                </Link>
                                <button className="btn btn-icon btn-ghost" onClick={logout} title={t('logout')}>
                                    <FiLogOut />
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="btn btn-sm btn-primary" id="login-button">
                                <FiUser /> {t('login')}
                            </Link>
                        )}

                        <button className="nav-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
                            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
                {navItems.map(item => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className={`nav-link ${isActive(item.to)}`}
                        onClick={() => setMobileOpen(false)}
                    >
                        {item.label}
                    </Link>
                ))}
                {user && (
                    <Link to="/orders" className="nav-link" onClick={() => setMobileOpen(false)}>
                        {t('myOrders')}
                    </Link>
                )}
                {!user && (
                    <Link to="/login" className="nav-link" onClick={() => setMobileOpen(false)}>
                        {t('login')} / {t('signUp')}
                    </Link>
                )}
            </div>
        </>
    );
}
