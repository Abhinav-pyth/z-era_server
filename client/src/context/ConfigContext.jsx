import { createContext, useContext, useState, useEffect } from 'react';
import { getConfig } from '../api/api';

const ConfigContext = createContext();

export function ConfigProvider({ children }) {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getConfig()
            .then(data => setConfig(data))
            .catch(err => {
                console.error('Failed to load config:', err);
                // Fallback config
                setConfig({
                    brand: { name: 'Z-era', tagline: 'Walk the Future' },
                    categories: [
                        { name: 'Sandals', slug: 'sandals', icon: '🩴' },
                        { name: 'Flats', slug: 'flats', icon: '🥿' },
                        { name: 'Sneakers', slug: 'sneakers', icon: '👟' }
                    ],
                    sizes: [4, 5, 6, 7, 8, 9, 10, 11],
                    priceRanges: [],
                    carousel: [],
                    payment: { cod: true, upi: true },
                    colors: []
                });
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <ConfigContext.Provider value={{ config, loading }}>
            {children}
        </ConfigContext.Provider>
    );
}

export const useConfig = () => useContext(ConfigContext);
