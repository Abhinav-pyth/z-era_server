import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FiMaximize, FiInfo, FiCheckCircle } from 'react-icons/fi';

export default function FootMeasureTool() {
    const { t } = useLanguage();
    const [step, setStep] = useState(1);
    const [lengthCm, setLengthCm] = useState(0);
    const [calculatedSize, setCalculatedSize] = useState(null);

    // Standard conversion for women's footwear (simplified)
    // Formula: (Length in cm + 1.5) / 0.667 approx
    const calculateSize = (cm) => {
        if (cm < 20) return 4;
        if (cm < 21) return 5;
        if (cm < 22) return 6;
        if (cm < 23) return 7;
        if (cm < 24) return 8;
        if (cm < 25) return 9;
        if (cm < 26) return 10;
        return 11;
    };

    const handleCalculate = () => {
        const size = calculateSize(parseFloat(lengthCm));
        setCalculatedSize(size);
        setStep(3);
    };

    return (
        <div className="glass-card foot-tool" style={{ padding: '32px', margin: '40px 0' }}>
            <div className="section-header" style={{ marginBottom: '24px', textAlign: 'left' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{t('sizeFinder')}</h2>
                <p style={{ margin: '0', fontSize: '0.9rem' }}>{t('sizeFinderDesc')}</p>
            </div>

            {step === 1 && (
                <div className="tool-step fade-in-up">
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
                        <div style={{ fontSize: '2.5rem', color: 'var(--accent-purple)' }}><FiMaximize /></div>
                        <div>
                            <h4 style={{ marginBottom: '4px' }}>{t('step1Title')}</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('step1Desc')}</p>
                        </div>
                    </div>
                    <button className="btn btn-primary" onClick={() => setStep(2)}>
                        {t('startMeasuring')}
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="tool-step fade-in-up">
                    <div style={{ marginBottom: '24px' }}>
                        <label className="input-label">{t('footLengthCm')}</label>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                            <input
                                type="number"
                                className="input-field"
                                value={lengthCm}
                                onChange={(e) => setLengthCm(e.target.value)}
                                placeholder="e.g. 23.5"
                                step="0.1"
                            />
                            <button className="btn btn-primary" onClick={handleCalculate}>
                                {t('calculate')}
                            </button>
                        </div>
                    </div>
                    <div className="info-box" style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '16px',
                        background: 'rgba(139, 92, 246, 0.05)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)'
                    }}>
                        <FiInfo size={20} style={{ flexShrink: 0 }} />
                        <p>{t('measurementTip')}</p>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="tool-step fade-in-up" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', color: 'var(--accent-green)', marginBottom: '16px' }}>
                        <FiCheckCircle />
                    </div>
                    <h3 style={{ marginBottom: '8px' }}>{t('yourEstimatedSize')}</h3>
                    <div style={{
                        fontSize: '4rem',
                        fontWeight: '900',
                        background: 'var(--gradient-primary)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '16px'
                    }}>
                        UK {calculatedSize}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                        {t('sizeNote')}
                    </p>
                    <button className="btn btn-outline btn-sm" onClick={() => setStep(1)}>
                        {t('measureAgain')}
                    </button>
                </div>
            )}
        </div>
    );
}
