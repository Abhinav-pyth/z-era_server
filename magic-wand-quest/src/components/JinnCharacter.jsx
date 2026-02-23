import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const JinnCharacter = ({ state, message }) => {
    const isCasting = state === 'casting';
    const isListening = state === 'listening';

    return (
        <div className="flex flex-col items-center gap-6 relative">
            {/* Smoke Effects */}
            <AnimatePresence>
                {isCasting && [...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="magic-smoke"
                        initial={{ x: 0, y: 0, opacity: 1, scale: 0.1 }}
                        animate={{
                            x: (Math.random() - 0.5) * 200,
                            y: -200 - Math.random() * 200,
                            opacity: 0,
                            scale: 2 + Math.random() * 2
                        }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        style={{ width: 40, height: 40 }}
                    />
                ))}
            </AnimatePresence>

            {/* Jinn Visual */}
            <div className="relative jinn-float">
                {/* Glow */}
                <motion.div
                    className="absolute inset-0 bg-blue-500 rounded-full filter blur-3xl opacity-40"
                    animate={{
                        scale: isListening ? [1, 1.3, 1] : 1,
                        opacity: isListening ? [0.4, 0.7, 0.4] : 0.4,
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Aladdin Jinn SVG */}
                <motion.svg
                    width="200"
                    height="240"
                    viewBox="0 0 200 240"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    animate={{
                        rotate: isCasting ? [0, 5, -5, 0] : 0,
                        scale: isCasting ? 1.1 : 1
                    }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10"
                >
                    {/* Jinn Body Tail/Smoke */}
                    <path
                        d="M100 220C100 220 120 200 130 180C140 160 140 140 120 120C100 100 60 100 40 120C20 140 20 160 30 180C40 200 60 220 60 220C60 220 80 230 100 220Z"
                        fill="url(#bodyGradient)"
                    />

                    {/* Upper Body / Muscles Shell */}
                    <path
                        d="M40 120C40 120 20 110 20 80C20 50 50 30 100 30C150 30 180 50 180 80C180 110 160 120 160 120L150 140H50L40 120Z"
                        fill="url(#bodyGradient)"
                    />

                    {/* Head */}
                    <circle cx="100" cy="50" r="25" fill="url(#bodyGradient)" />

                    {/* Eyes (Glowing) */}
                    <circle cx="90" cy="45" r="4" fill="white" className="animate-pulse" />
                    <circle cx="110" cy="45" r="4" fill="white" className="animate-pulse" />

                    {/* Gold Cuffs */}
                    <rect x="25" y="85" width="20" height="10" rx="2" fill="#FFD700" stroke="#B8860B" />
                    <rect x="155" y="85" width="20" height="10" rx="2" fill="#FFD700" stroke="#B8860B" />

                    {/* Gold Belt */}
                    <rect x="65" y="130" width="70" height="12" rx="2" fill="#FFD700" stroke="#B8860B" />

                    <defs>
                        <linearGradient id="bodyGradient" x1="100" y1="30" x2="100" y2="220" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#6C5CE7" />
                            <stop offset="1" stopColor="#0984E3" />
                        </linearGradient>
                    </defs>
                </motion.svg>
            </div>

            {/* Speech Bubble */}
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                key={message}
                className="jinn-bubble max-w-xs text-center text-lg z-20 border-2 border-primary-purple/20"
            >
                {message || "Speak the ancient words, and I shall answer!"}
            </motion.div>
        </div>
    );
};

export default JinnCharacter;
