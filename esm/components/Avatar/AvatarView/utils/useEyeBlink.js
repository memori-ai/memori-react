import { useCallback, useEffect, useRef } from 'react';
const DEFAULT_BLINK_CONFIG = {
    minInterval: 1000,
    maxInterval: 5000,
    blinkDuration: 150,
};
export function useAvatarBlink({ enabled, setMorphTargetInfluences, config = {} }) {
    const blinkTimeoutRef = useRef();
    const isBlinkingRef = useRef(false);
    const lastBlinkTime = useRef(0);
    const blinkConfig = {
        ...DEFAULT_BLINK_CONFIG,
        ...config
    };
    const blink = useCallback(() => {
        if (!enabled || isBlinkingRef.current)
            return;
        isBlinkingRef.current = true;
        setMorphTargetInfluences((prev) => ({
            ...prev,
            eyesClosed: 1
        }));
        setTimeout(() => {
            setMorphTargetInfluences((prev) => ({
                ...prev,
                eyesClosed: 0
            }));
            isBlinkingRef.current = false;
            lastBlinkTime.current = Date.now();
            scheduleNextBlink();
        }, blinkConfig.blinkDuration);
    }, [enabled, blinkConfig.blinkDuration, setMorphTargetInfluences]);
    const scheduleNextBlink = useCallback(() => {
        if (blinkTimeoutRef.current) {
            clearTimeout(blinkTimeoutRef.current);
        }
        const nextBlinkDelay = Math.random() *
            (blinkConfig.maxInterval - blinkConfig.minInterval) +
            blinkConfig.minInterval;
        blinkTimeoutRef.current = setTimeout(blink, nextBlinkDelay);
    }, [blink, blinkConfig.maxInterval, blinkConfig.minInterval]);
    useEffect(() => {
        if (enabled) {
            scheduleNextBlink();
        }
        else {
            if (blinkTimeoutRef.current) {
                clearTimeout(blinkTimeoutRef.current);
            }
            setMorphTargetInfluences((prevInfluences) => ({
                ...prevInfluences,
                eyesClosed: 0
            }));
        }
        return () => {
            if (blinkTimeoutRef.current) {
                clearTimeout(blinkTimeoutRef.current);
            }
        };
    }, [enabled, scheduleNextBlink, setMorphTargetInfluences]);
    return {
        isBlinking: isBlinkingRef.current,
        lastBlinkTime: lastBlinkTime.current,
        triggerBlink: blink
    };
}
//# sourceMappingURL=useEyeBlink.js.map