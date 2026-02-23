import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../api/api';
import { useConfig } from '../context/ConfigContext';
import { useLanguage } from '../context/LanguageContext';
import Carousel from '../components/Carousel';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import FootMeasureTool from '../components/FootMeasureTool';
import { FiPlus, FiCheck } from 'react-icons/fi';

export default function HomePage() {
    const [searchParams] = useSearchParams();
    const { config } = useConfig();
    const { t } = useLanguage();
    const [products, setProducts] = useState([]);
    const [premiumProducts, setPremiumProducts] = useState([]);
    const [budgetProducts, setBudgetProducts] = useState([]);
    const [dealProducts, setDealProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [activeFaq, setActiveFaq] = useState(null);
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        size: '',
        priceMin: '',
        priceMax: '',
        search: '',
        tier: '',
        sort: 'newest'
    });

    // Fetch collections
    useEffect(() => {
        getProducts({ tier: 'premium', limit: 8 }).then(data => setPremiumProducts(data.products));
        getProducts({ tier: 'budget', limit: 8 }).then(data => setBudgetProducts(data.products));
        getProducts({ has_discount: true, limit: 4 }).then(data => setDealProducts(data.products));
    }, []);

    // Main collection fetch
    useEffect(() => {
        setLoading(true);
        const params = {};
        if (filters.category) params.category = filters.category;
        if (filters.size) params.size = filters.size;
        if (filters.priceMin) params.priceMin = filters.priceMin;
        if (filters.priceMax) params.priceMax = filters.priceMax;
        if (filters.search) params.search = filters.search;
        if (filters.tier) params.tier = filters.tier;
        if (filters.sort) params.sort = filters.sort;

        getProducts(params)
            .then(data => {
                setProducts(data.products);
                setTotal(data.total);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [filters]);

    const toggleFaq = (idx) => setActiveFaq(activeFaq === idx ? null : idx);

    const faqs = [
        { q: "Are Z-era shoes comfortable for all-day wear?", a: "Absolutely! Every pair features our signature Cloud-Tech insoles designed for maximum breathability and arch support." },
        { q: "Do you offer international shipping?", a: "Currently, we ship across India, France, and Canada. We're expanding to more regions soon!" },
        { q: "How do I find my perfect foot size?", a: "Use our 'Foot Finder' tool below. It helps you measure your foot in cm and suggests the best UK size." },
        { q: "What is your return policy?", a: "We offer a 7-day hassle-free return and exchange policy on all unworn items." }
    ];

    return (
        <div className="home-page">
            <div className="promo-bar" style={{ backgroundColor: 'var(--accent-purple)', color: 'white', padding: '8px 0', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.5px' }}>
                ✨ {t('limitedTimeOffers')} — USE CODE: <span style={{ textDecoration: 'underline' }}>LAUNCH10</span> FOR 10% OFF!
            </div>

            <Carousel />

            {/* Circular Category Style Section */}
            <section className="style-section container" style={{ padding: '80px 0 40px' }}>
                <div className="section-header">
                    <h2>{t('shopByCategory')}</h2>
                    <p>{t('shopByCategoryDesc')}</p>
                </div>
                <div className="style-categories">
                    {config?.categories?.map(cat => (
                        <div
                            key={cat.slug}
                            className={`style-circle ${filters.category === cat.slug ? 'active' : ''}`}
                            onClick={() => setFilters(prev => ({ ...prev, category: prev.category === cat.slug ? '' : cat.slug }))}
                        >
                            <div className="style-img-wrapper">
                                <span>{cat.icon}</span>
                            </div>
                            <h4>{cat.name}</h4>
                        </div>
                    ))}
                </div>
            </section>

            {/* Limited Time Deals */}
            {dealProducts.length > 0 && (
                <section className="deals-section container" style={{ padding: '40px 0' }}>
                    <div className="glass-card" style={{ padding: '40px', border: '2px dashed var(--accent-purple)', backgroundColor: 'rgba(139, 92, 246, 0.03)' }}>
                        <div className="section-header" style={{ textAlign: 'left', marginBottom: '32px' }}>
                            <h2 style={{ color: 'var(--accent-purple)' }}>{t('limitedTimeOffers')}</h2>
                            <p>Handpicked styles at unbeatable launch prices.</p>
                        </div>
                        <div className="products-grid">
                            {dealProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Trending Premium Drops */}
            <section className="tier-section" id="premium-section">
                <div className="container">
                    <div className="section-header" style={{ textAlign: 'left', marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '2.4rem' }}>{t('trendingNow')}</h2>
                        <p style={{ margin: '0' }}>The most sought-after drops this season</p>
                    </div>
                    <div className="tier-products-scroll">
                        {premiumProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Lifestyle Image Text Banner */}
            <section className="container">
                <div className="lifestyle-banner" style={{ backgroundColor: '#f9f9f9', backgroundImage: 'linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url("https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1000")' }}>
                    <div className="lifestyle-content">
                        <h3>Fall in Love with Every Step</h3>
                        <p style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>
                            Experience the perfect blend of street-smart aesthetics and orthopaedic comfort. Designed for the modern woman who never stops.
                        </p>
                        <button className="btn btn-primary" onClick={() => document.getElementById('products').scrollIntoView()}>
                            Explore Collection
                        </button>
                    </div>
                </div>
            </section>

            {/* Best Sellers / Main Grid */}
            <section className="products-section" id="products">
                <div className="container">
                    <div className="section-header">
                        <h2>Our Full Collection</h2>
                        <p>Discover the art of comfortable walking</p>
                    </div>

                    <div className="products-layout">
                        <FilterSidebar filters={filters} setFilters={setFilters} />

                        <div style={{ flex: 1 }}>
                            <div className="sort-bar" style={{ marginBottom: '32px' }}>
                                <span className="result-count">{total} products found</span>
                                <select
                                    className="sort-select"
                                    value={filters.sort}
                                    onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="price_asc">Price: Low - High</option>
                                    <option value="price_desc">Price: High - Low</option>
                                    <option value="rating">Top Rated</option>
                                </select>
                            </div>

                            {loading ? (
                                <div className="loader"><div className="spinner"></div></div>
                            ) : (
                                <div className="products-grid">
                                    {products.map((product, i) => (
                                        <div key={product.id} className="fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                                            <ProductCard product={product} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Z-era? Trust Section */}
            <section style={{ backgroundColor: '#fafafa', padding: '100px 0' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>Step Into Comfort, Step Into Style</h2>
                        <p>Why thousands of women choose Z-era every day</p>
                    </div>
                    <div className="categories-grid">
                        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', backgroundColor: 'white' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>☁️</div>
                            <h3 style={{ marginBottom: '12px' }}>Cloud-Tech Comfort</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Ultra-soft insoles that make you feel like you're walking on air, all day long.</p>
                        </div>
                        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', backgroundColor: 'white' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>💎</div>
                            <h3 style={{ marginBottom: '12px' }}>Premium Materials</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Handpicked, durable, and sustainable materials that stand the test of time.</p>
                        </div>
                        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', backgroundColor: 'white' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>🌍</div>
                            <h3 style={{ marginBottom: '12px' }}>Eco-Conscious</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>We care for your feet and the planet. Minimal waste, maximal impact.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Foot Finder Tool */}
            <section style={{ padding: '80px 0' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <FootMeasureTool />
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section container">
                <div className="section-header">
                    <h2>Frequently Asked Questions</h2>
                </div>
                <div className="faq-list">
                    {faqs.map((faq, i) => (
                        <div key={i} className={`faq-item ${activeFaq === i ? 'active' : ''}`}>
                            <div className="faq-question" onClick={() => toggleFaq(i)}>
                                <span>{faq.q}</span>
                                <FiPlus className="faq-icon" />
                            </div>
                            <div className="faq-answer">
                                <p>{faq.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
