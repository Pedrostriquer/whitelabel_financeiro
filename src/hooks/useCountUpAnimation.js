import { useState, useEffect } from 'react';

const interpolateColor = (progress, startColor, midColor, endColor) => {
    if (progress < 0.5) {
        const p = progress * 2;
        const r = Math.round(startColor[0] * (1 - p) + midColor[0] * p);
        const g = Math.round(startColor[1] * (1 - p) + midColor[1] * p);
        const b = Math.round(startColor[2] * (1 - p) + midColor[2] * p);
        return `rgb(${r}, ${g}, ${b})`;
    } else {
        const p = (progress - 0.5) * 2;
        const r = Math.round(midColor[0] * (1 - p) + endColor[0] * p);
        const g = Math.round(midColor[1] * (1 - p) + endColor[1] * p);
        const b = Math.round(midColor[2] * (1 - p) + endColor[2] * p);
        return `rgb(${r}, ${g}, ${b})`;
    }
};

const useCountUpAnimation = (endValue, duration = 3000, isLoading, endColorRgb = [34, 34, 34]) => {
    const [currentValue, setCurrentValue] = useState(0);
    const [animatedColor, setAnimatedColor] = useState('rgb(0, 123, 255)');

    const startColor = [0, 123, 255];
    const midColor = [40, 167, 69];

    useEffect(() => {
        if (!isLoading && typeof endValue === 'number' && endValue > 0) {
            let startTime = null;
            const animationFrame = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);

                const easedProgress = 1 - Math.pow(1 - progress, 3);
                setCurrentValue(easedProgress * endValue);
                setAnimatedColor(interpolateColor(progress, startColor, midColor, endColorRgb));

                if (progress < 1) {
                    requestAnimationFrame(animationFrame);
                } else {
                    setCurrentValue(endValue);
                    setAnimatedColor(`rgb(${endColorRgb.join(',')})`);
                }
            };
            requestAnimationFrame(animationFrame);
        } else if (isLoading) {
            setCurrentValue(0);
            setAnimatedColor('rgb(0, 123, 255)');
        } else if (!isLoading && endValue === 0) {
            setCurrentValue(0);
            setAnimatedColor(`rgb(${endColorRgb.join(',')})`);
        }
    }, [isLoading, endValue, duration]);

    return { currentValue, animatedColor };
};

export default useCountUpAnimation;