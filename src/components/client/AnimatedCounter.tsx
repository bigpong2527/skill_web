'use client';

import React, { useEffect, useState } from 'react';

interface AnimatedCounterProps {
    end: number;
    duration?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (end === 0) return;

        let startTime: number | null = null;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Ease Out Expo 算法
            const value = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            setCount(Math.floor(value * end));

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }, [end, duration]);

    return <>{count}</>;
};

export default AnimatedCounter;
