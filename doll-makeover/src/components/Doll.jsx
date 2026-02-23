import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Doll = ({ state, phase }) => {
    const { makeup, dress, shoes, isWet, isSoapy } = state;

    return (
        <div className="doll-display">
            {/* Base Doll Layer */}
            <img
                src="https://api.dicebear.com/9.x/lorelei/svg?seed=Princess&backgroundColor=ffdfbf"
                alt="Doll Base"
                className={`doll-image ${isWet ? 'wet-look' : ''}`}
                style={{ width: '100%', height: '100%', display: 'block' }}
            />

            {/* Bubbles Layer (Bath Phase) */}
            <AnimatePresence>
                {isSoapy && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bubbles"
                    >
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    x: Math.random() * 200 - 100,
                                    y: Math.random() * 300 - 150,
                                    scale: 0
                                }}
                                animate={{
                                    y: Math.random() * 300 - 200,
                                    scale: Math.random() * 1.5,
                                    opacity: [0, 1, 0]
                                }}
                                transition={{
                                    duration: 2 + Math.random() * 2,
                                    repeat: Infinity,
                                    delay: Math.random() * 2
                                }}
                                style={{
                                    position: 'absolute',
                                    width: '20px',
                                    height: '20px',
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    borderRadius: '50%',
                                    border: '1px solid rgba(135, 206, 235, 0.5)',
                                    left: '50%',
                                    top: '50%'
                                }}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Makeup Layers */}
            <div className="makeup-overlay">
                {makeup.lipstick && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '58%',
                            left: '50%',
                            width: '14px',
                            height: '8px',
                            backgroundColor: makeup.lipstick,
                            borderRadius: '50%',
                            filter: 'blur(1px)',
                            opacity: 0.8,
                            transform: 'translate(-50%, -50%)'
                        }}
                    />
                )}
                {makeup.blush && (
                    <>
                        <div
                            style={{
                                position: 'absolute',
                                top: '54%',
                                left: '42%',
                                width: '22px',
                                height: '18px',
                                backgroundColor: makeup.blush,
                                borderRadius: '50%',
                                filter: 'blur(6px)',
                                opacity: 0.5,
                                transform: 'translate(-50%, -50%)'
                            }}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                top: '54%',
                                right: '42%',
                                width: '22px',
                                height: '18px',
                                backgroundColor: makeup.blush,
                                borderRadius: '50%',
                                filter: 'blur(6px)',
                                opacity: 0.5,
                                transform: 'translate(-50%, -50%)',
                                transformScaleX: -1
                            }}
                        />
                    </>
                )}
            </div>

            {/* Clothing Layer */}
            <AnimatePresence>
                {dress && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="dress-layer"
                        style={{
                            position: 'absolute',
                            top: '55%',
                            width: '100%',
                            textAlign: 'center',
                            zIndex: 10
                        }}
                    >
                        <div style={{
                            width: '60%',
                            height: '100px',
                            backgroundColor: dress,
                            margin: '0 auto',
                            borderRadius: '10px 10px 40% 40%',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                        }} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Doll;
