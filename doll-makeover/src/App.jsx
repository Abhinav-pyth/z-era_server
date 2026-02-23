import React, { useState } from 'react';
import Doll from './components/Doll';
import {
  Droplets,
  Sparkles,
  Shirt,
  Eraser,
  Wind,
  Flower2
} from 'lucide-react';
import { motion } from 'framer-motion';

const PHASES = ['Bath', 'Makeup', 'Dress-up'];

const App = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [gameState, setGameState] = useState({
    isWet: false,
    isSoapy: false,
    makeup: {
      lipstick: null,
      blush: null,
      foundation: null
    },
    dress: null,
    shoes: null
  });

  const nextPhase = () => setCurrentPhase((prev) => Math.min(prev + 1, PHASES.length - 1));
  const prevPhase = () => setCurrentPhase((prev) => Math.max(prev - 1, 0));

  const handleBathAction = (action) => {
    if (action === 'shampoo') setGameState(prev => ({ ...prev, isSoapy: true }));
    if (action === 'rinse') setGameState(prev => ({ ...prev, isSoapy: false, isWet: true }));
    if (action === 'dry') setGameState(prev => ({ ...prev, isWet: false }));
  };

  const handleMakeupAction = (type, color) => {
    setGameState(prev => ({
      ...prev,
      makeup: { ...prev.makeup, [type]: color }
    }));
  };

  const handleDressAction = (type, value) => {
    setGameState(prev => ({ ...prev, [type]: value }));
  };

  return (
    <div className="game-container">
      <header className="title-section">
        <h1>Doll Makeover Magic</h1>
        <p>Give your doll a beautiful transformation!</p>
      </header>

      <div className="status-bar">
        {PHASES.map((phase, idx) => (
          <div
            key={phase}
            className={`phase-indicator ${currentPhase === idx ? 'active' : ''}`}
          >
            {idx + 1}. {phase}
          </div>
        ))}
      </div>

      <main className="game-main">
        {/* Left Tools */}
        <div className="tool-panel">
          {currentPhase === 0 && (
            <>
              <h3>Bath Time</h3>
              <div className="tool-card" onClick={() => handleBathAction('shampoo')}>
                <Droplets color="#ff69b4" /> Shampoo
              </div>
              <div className="tool-card" onClick={() => handleBathAction('rinse')}>
                <Wind color="#87ceeb" /> Rinse
              </div>
              <div className="tool-card" onClick={() => handleBathAction('dry')}>
                <Sparkles color="#ffd700" /> Dry
              </div>
            </>
          )}

          {currentPhase === 1 && (
            <>
              <h3>Makeup Box</h3>
              <p>Lipstick</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['#ff4d4d', '#ff3385', '#cc33ff'].map(color => (
                  <div
                    key={color}
                    onClick={() => handleMakeupAction('lipstick', color)}
                    style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: color, cursor: 'pointer' }}
                  />
                ))}
              </div>
              <p>Blush</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['#ffcccc', '#ffb3b3', '#ff9999'].map(color => (
                  <div
                    key={color}
                    onClick={() => handleMakeupAction('blush', color)}
                    style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: color, cursor: 'pointer' }}
                  />
                ))}
              </div>
            </>
          )}

          {currentPhase === 2 && (
            <>
              <h3>Wardrobe</h3>
              <p>Dresses</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['#ff69b4', '#87ceeb', '#dda0dd', '#98fb98'].map(color => (
                  <div
                    key={color}
                    onClick={() => handleDressAction('dress', color)}
                    style={{ width: '40px', height: '40px', backgroundColor: color, cursor: 'pointer', borderRadius: '4px' }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Center Doll */}
        <Doll state={gameState} phase={PHASES[currentPhase]} />

        {/* Right Info / Controls */}
        <div className="tool-panel">
          <h3>Your Progress</h3>
          <p>
            Current Stage: <strong>{PHASES[currentPhase]}</strong>
          </p>
          <div style={{
            padding: '1rem',
            background: 'var(--primary)',
            color: 'white',
            borderRadius: '0.5rem',
            fontSize: '0.9rem',
            textAlign: 'center',
            opacity: Object.values(gameState.makeup).some(v => v) || gameState.dress ? 1 : 0.5
          }}>
            {Object.values(gameState.makeup).some(v => v) || gameState.dress
              ? "✨ Lookin' Good! ✨"
              : "Try adding some magic!"}
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {currentPhase < PHASES.length - 1 && (
              <button className="btn-primary" onClick={nextPhase}>Next Stage →</button>
            )}
            {currentPhase > 0 && (
              <button onClick={prevPhase}>← Back</button>
            )}
            <button variant="secondary" onClick={() => window.location.reload()}>
              <Eraser size={16} /> Reset All
            </button>
          </div>
        </div>
      </main>

      <footer style={{ textAlign: 'center', marginTop: '2rem', opacity: 0.6 }}>
        <p>Sparkle & Shine Makeup Studio ✨</p>
      </footer>
    </div>
  );
};

export default App;
