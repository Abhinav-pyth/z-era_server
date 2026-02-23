import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Flame, Snowflake, Star, Zap, Heart, Moon, Ghost, Gift, Cloud } from 'lucide-react';
import MagicLamp from './components/MagicLamp';
import JinnCharacter from './components/JinnCharacter';
import MagicEffects from './components/MagicEffects';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
}

const SPELLS = [
  { name: 'Fire', icon: <Flame size={18} />, phrase: 'Burn bright, magic light!' },
  { name: 'Ice', icon: <Snowflake size={18} />, phrase: 'Freeze like a winter breeze!' },
  { name: 'Galaxy', icon: <Star size={18} />, phrase: 'Stars above, show your love!' },
  { name: 'Dragon', icon: <Flame size={18} />, phrase: 'Dragon fire, higher and higher!' },
  { name: 'Butterfly', icon: <Heart size={18} />, phrase: 'Fly away, it’s a magic day!' },
  { name: 'Rainbow', icon: <Star size={18} />, phrase: 'Colors bright, what a sight!' },
  { name: 'Candy', icon: <Gift size={18} />, phrase: 'Yummy gummy, fill your tummy!' },
  { name: 'Moon', icon: <Moon size={18} />, phrase: 'Moonlight glow, magic flow!' },
  { name: 'Unicorn', icon: <Star size={18} />, phrase: 'Unicorn leap, magic to keep!' },
  { name: 'Thunder', icon: <Zap size={18} />, phrase: 'Bolt of light, magic might!' },
];

function App() {
  const [isListening, setIsListening] = useState(false);
  const [isSummoned, setIsSummoned] = useState(false);
  const [currentSpell, setCurrentSpell] = useState('');
  const [jinnState, setJinnState] = useState('idle'); // idle, listening, casting
  const [jinnMessage, setJinnMessage] = useState('Tap the lamp to summon me!');
  const [isCasting, setIsCasting] = useState(false);
  const [lastWords, setLastWords] = useState('');

  const [screenShake, setScreenShake] = useState(false);
  const [magicFlash, setMagicFlash] = useState(false);

  const spellTimeoutRef = useRef(null);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(text);
      msg.pitch = 1.2;
      msg.rate = 1.0;
      window.speechSynthesis.speak(msg);
    }
  };

  const castSpell = useCallback((spellName) => {
    const spell = SPELLS.find(s => s.name.toLowerCase() === spellName.toLowerCase()) || { name: spellName, phrase: "Magic!" };

    setCurrentSpell(spell.name);
    setJinnState('casting');
    setJinnMessage(`${spell.phrase}`);
    setIsCasting(true);
    setScreenShake(true);
    setMagicFlash(true);
    speak(spell.phrase);

    // Reset effects
    setTimeout(() => {
      setScreenShake(false);
      setMagicFlash(false);
    }, 500);

    if (spellTimeoutRef.current) clearTimeout(spellTimeoutRef.current);

    spellTimeoutRef.current = setTimeout(() => {
      setCurrentSpell('');
      setJinnState('idle');
      setIsCasting(false);
      setJinnMessage("By your command! What else shall we create?");
      speak("By your command! What else shall we create?");
    }, 4000);
  }, []);

  const handleSummon = () => {
    if (!isSummoned) {
      setIsSummoned(true);
      setJinnMessage("I am at your service, little master!");
      speak("I am at your service, little master!");
    } else {
      setJinnMessage("You called?");
      speak("You called?");
    }
  };

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
        .toLowerCase();

      setLastWords(transcript);

      SPELLS.forEach(spell => {
        if (transcript.includes(spell.name.toLowerCase()) && isSummoned) {
          castSpell(spell.name);
          recognition.stop();
          setIsListening(false);
        }
      });
    };

    recognition.onend = () => {
      if (isListening) recognition.start();
    };

    return () => {
      if (recognition) recognition.stop();
    };
  }, [castSpell, isListening, isSummoned]);

  const toggleListening = () => {
    if (!isSummoned) {
      setJinnMessage("Summon me from the lamp first!");
      speak("Summon me from the lamp first!");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      setJinnState('idle');
      setJinnMessage("I'm resting in the smoke...");
    } else {
      try {
        recognition.start();
        setIsListening(true);
        setJinnState('listening');
        setJinnMessage("Tell me your magic words!");
        speak("Tell me your magic words!");
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden transition-all duration-500 ${screenShake ? 'shake-screen' : ''}`}>
      {/* Magic Flash Overlay */}
      <div className={`flash-overlay ${magicFlash ? 'flash-active' : ''}`} />

      {/* Galaxy Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.1, 0.7, 0.1] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
          />
        ))}
      </div>

      <header className="mb-8 text-center z-10">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-2 p-2"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          Aladdin's Magic Lamp
        </motion.h1>
      </header>

      <main className="flex flex-col items-center gap-10 z-10 w-full max-w-4xl">
        {/* Jinn & Lamp Area */}
        <div className="flex flex-col items-center gap-4 relative min-h-[400px]">
          <AnimatePresence>
            {isSummoned && (
              <motion.div
                initial={{ opacity: 0, scale: 0, y: 100 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0, y: 100 }}
                transition={{ type: "spring", damping: 15 }}
              >
                <JinnCharacter state={jinnState} message={jinnMessage} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-auto">
            <MagicLamp onClick={handleSummon} isSummoned={isSummoned} />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
          <button
            onClick={toggleListening}
            className={`neon-btn flex items-center gap-4 shadow-xl ${isListening ? 'ring-4 ring-cyan-500/50' : ''}`}
          >
            {isListening ? <Mic size={24} /> : <MicOff size={24} />}
            {isListening ? "I AM LISTENING..." : "WAKE THE JINN"}
          </button>

          {lastWords && isListening && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-gold italic text-xl font-bold drop-shadow-lg"
            >
              " {lastWords} "
            </motion.div>
          )}
        </div>

        {/* Spell Grid */}
        <div className="crystal-container">
          {SPELLS.map((spell) => (
            <motion.div
              key={spell.name}
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
              whileTap={{ scale: 0.9 }}
              className="spell-crystal border-2 border-gold/30 hover:border-gold"
              onClick={() => isSummoned ? castSpell(spell.name) : handleSummon()}
            >
              <div className="text-gold">{spell.icon}</div>
              <span className="font-bold text-xs tracking-tighter text-white uppercase">{spell.name}</span>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Effects Component */}
      <MagicEffects spell={currentSpell} />

      <footer className="mt-8 text-gold/30 font-bold uppercase tracking-[0.5em] text-[10px] z-10">
        Ancient Wonders Await
      </footer>
    </div>
  );
}

export default App;
