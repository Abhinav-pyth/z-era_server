import { useConfig } from '../context/ConfigContext';
import { useLanguage } from '../context/LanguageContext';

export default function FilterSidebar({ filters, setFilters }) {
    const { config } = useConfig();
    const { t } = useLanguage();

    const toggleCategory = (slug) => {
        setFilters(prev => ({
            ...prev,
            category: prev.category === slug ? '' : slug
        }));
    };

    const toggleTier = (tier) => {
        setFilters(prev => ({
            ...prev,
            tier: prev.tier === tier ? '' : tier
        }));
    };

    const toggleSize = (size) => {
        setFilters(prev => ({
            ...prev,
            size: prev.size === size ? '' : size
        }));
    };

    const setPriceRange = (min, max) => {
        setFilters(prev => {
            if (prev.priceMin === min && prev.priceMax === max) {
                return { ...prev, priceMin: '', priceMax: '' };
            }
            return { ...prev, priceMin: min, priceMax: max };
        });
    };

    const clearAll = () => {
        setFilters({ category: '', size: '', priceMin: '', priceMax: '', search: '', tier: '', sort: 'newest' });
    };

    const hasFilters = filters.category || filters.size || filters.priceMin || filters.tier;

    return (
        <aside className="filter-sidebar" id="filter-sidebar">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{t('filters')}</h3>
                {hasFilters && (
                    <span className="filter-clear" onClick={clearAll}>{t('clearAll')}</span>
                )}
            </div>

            {/* Collections / Tier */}
            <div className="filter-group">
                <h4>{t('tier')}</h4>
                <div
                    className={`filter-option ${filters.tier === 'premium' ? 'active' : ''}`}
                    onClick={() => toggleTier('premium')}
                >
                    <span className="filter-checkbox"></span>
                    <span>{t('premium')}</span>
                </div>
                <div
                    className={`filter-option ${filters.tier === 'budget' ? 'active' : ''}`}
                    onClick={() => toggleTier('budget')}
                >
                    <span className="filter-checkbox"></span>
                    <span>{t('budget')}</span>
                </div>
            </div>

            {/* Categories */}
            <div className="filter-group">
                <h4>{t('category')}</h4>
                {config?.categories?.map(cat => (
                    <div
                        key={cat.slug}
                        className={`filter-option ${filters.category === cat.slug ? 'active' : ''}`}
                        onClick={() => toggleCategory(cat.slug)}
                    >
                        <span className="filter-checkbox"></span>
                        <span>{cat.icon} {cat.name}</span>
                    </div>
                ))}
            </div>

            {/* Sizes */}
            <div className="filter-group">
                <h4>{t('size')}</h4>
                <div className="size-chips">
                    {config?.sizes?.map(size => (
                        <div
                            key={size}
                            className={`size-chip ${filters.size === size ? 'active' : ''}`}
                            onClick={() => toggleSize(size)}
                        >
                            {size}
                        </div>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="filter-group">
                <h4>{t('price')}</h4>
                {config?.priceRanges?.map((range, i) => (
                    <div
                        key={i}
                        className={`filter-option ${filters.priceMin === range.min && filters.priceMax === range.max ? 'active' : ''}`}
                        onClick={() => setPriceRange(range.min, range.max)}
                    >
                        <span className="filter-checkbox"></span>
                        <span>{range.label}</span>
                    </div>
                ))}
            </div>
        </aside>
    );
}
