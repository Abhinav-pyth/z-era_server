import React from 'react';
import { motion } from 'framer-motion';

const MagicLamp = ({ onClick, isSummoned }) => {
    return (
        <motion.div
            className="relative cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
        >
            {/* Magic Lamp SVG */}
            <svg
                width="120"
                height="60"
                viewBox="0 0 120 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="filter drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]"
            >
                <path
                    d="M10 50C10 50 20 55 60 55C100 55 110 50 110 50C110 50 115 45 90 35L80 30L95 15C100 10 90 5 80 15L70 25C70 25 50 20 30 25C10 30 5 40 10 50Z"
                    fill="#FFD700"
                    stroke="#B8860B"
                    strokeWidth="2"
                />
                <ellipse cx="60" cy="53" rx="30" ry="5" fill="#B8860B" opacity="0.5" />
            </svg>

            {/* Vibration when summoned */}
            {isSummoned && (
                <motion.div
                    animate={{ x: [-2, 2, -2, 2, 0], y: [-1, 1, -1, 1, 0] }}
                    transition={{ duration: 0.2, repeat: 10 }}
                    className="absolute inset-0 pointer-events-none"
                />
            )}
        </motion.div>
    );
};

export default MagicLamp;
