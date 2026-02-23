import React, { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

const MagicEffects = ({ spell }) => {
    const triggerCandy = useCallback(() => {
        const scalar = 2;
        const candy = confetti.shapeFromText({ text: '🍬', scalar });
        const lollipop = confetti.shapeFromText({ text: '🍭', scalar });
        const chocolate = confetti.shapeFromText({ text: '🍫', scalar });

        confetti({
            shapes: [candy, lollipop, chocolate],
            particleCount: 80,
            spread: 120,
            origin: { y: 0.6 },
            scalar
        });
    }, []);

    const triggerUnicorn = useCallback(() => {
        const end = Date.now() + (3 * 1000);
        const colors = ['#ff00ff', '#00ffff', '#ffffff', '#ff69b4'];

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }, []);

    const triggerThunder = useCallback(() => {
        // Large centered white/blue burst
        confetti({
            particleCount: 150,
            spread: 360,
            startVelocity: 45,
            origin: { y: 0.5 },
            colors: ['#ffffff', '#00ffff', '#483d8b'],
            shapes: ['square'],
            scalar: 1.5
        });
    }, []);

    useEffect(() => {
        if (!spell) return;

        const s = spell.toLowerCase();
        if (s.includes('candy')) triggerCandy();
        if (s.includes('unicorn')) triggerUnicorn();
        if (s.includes('thunder')) triggerThunder();

        // Existing effects
        if (s.includes('fire') || s.includes('dragon')) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ff0000', '#ff8c00', '#ffd700'],
            });
        }
        if (s.includes('ice')) {
            confetti({
                particleCount: 200,
                spread: 200,
                origin: { y: 0.6 },
                colors: ['#ffffff', '#00ced1', '#add8e6'],
            });
        }
        if (s.includes('galaxy') || s.includes('star')) {
            const end = Date.now() + (2 * 1000);
            (function frame() {
                confetti({
                    particleCount: 10,
                    spread: 360,
                    origin: { x: Math.random(), y: Math.random() - 0.2 },
                    colors: ['#6a5acd', '#ff00ff', '#00ffff'],
                    shapes: ['star']
                });
                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        }
        if (s.includes('butterfly')) {
            confetti({
                particleCount: 80,
                spread: 160,
                origin: { y: 0.6 },
                colors: ['#ff69b4', '#da70d6', '#ee82ee'],
            });
        }
        if (s.includes('rainbow')) {
            confetti({
                particleCount: 150,
                spread: 120,
                origin: { y: 0.6 },
                colors: ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee']
            });
        }
        if (s.includes('moon')) {
            confetti({
                particleCount: 100,
                spread: 360,
                origin: { y: 0.5 },
                colors: ['#f0f0f0', '#fff8dc', '#fdf5e6'],
                shapes: ['circle'],
                scalar: 2
            });
        }

    }, [spell, triggerCandy, triggerUnicorn, triggerThunder]);

    return null;
};

export default MagicEffects;
