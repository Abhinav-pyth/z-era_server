import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import translations, { LANGUAGES } from '../i18n/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(() => {
        return localStorage.getItem('z-era-lang') || 'en';
    });

    useEffect(() => {
        localStorage.setItem('z-era-lang', lang);
        document.documentElement.setAttribute('lang', lang);
    }, [lang]);

    const t = useCallback((key, replacements = {}) => {
        let text = translations[lang]?.[key] || translations['en']?.[key] || key;
        Object.entries(replacements).forEach(([k, v]) => {
            text = text.replace(`{${k}}`, v);
        });
        return text;
    }, [lang]);

    return (
        <LanguageContext.Provider value={{ lang, setLang, t, languages: LANGUAGES }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);
