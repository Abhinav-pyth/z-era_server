import { useState, useEffect, useCallback } from 'react';
import { useConfig } from '../context/ConfigContext';

export default function Carousel() {
    const { config } = useConfig();
    const slides = config?.carousel || [];
    const [current, setCurrent] = useState(0);

    const next = useCallback(() => {
        setCurrent(prev => (prev + 1) % slides.length);
    }, [slides.length]);

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(next, 6000); // Slower, more premium transition
        return () => clearInterval(timer);
    }, [next, slides.length]);

    if (!slides.length) return null;

    return (
        <div className="hero-carousel" id="hero-carousel">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`hero-slide ${index === current ? 'active' : ''}`}
                    style={{
                        backgroundImage: slide.image ? `url(${slide.image})` : slide.gradient,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="hero-overlay"></div>
                    <div className="hero-content">
                        <div className="hero-badge">{slide.badge || 'New Trend'}</div>
                        <h1 style={{ fontFamily: "'Playfair Display', serif" }}>{slide.title}</h1>
                        <p>{slide.subtitle}</p>
                        <a href={slide.ctaLink} className="btn btn-lg btn-white">
                            {slide.cta}
                        </a>
                    </div>
                </div>
            ))}
            <div className="hero-controls">
                <div className="hero-dots">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`hero-dot ${index === current ? 'active' : ''}`}
                            onClick={() => setCurrent(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
