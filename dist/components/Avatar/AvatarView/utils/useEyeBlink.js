"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAvatarBlink = void 0;
const react_1 = require("react");
const DEFAULT_BLINK_CONFIG = {
    minInterval: 1000,
    maxInterval: 5000,
    blinkDuration: 150,
};
function useAvatarBlink({ enabled, setMorphTargetInfluences, config = {} }) {
    const blinkTimeoutRef = (0, react_1.useRef)();
    const isBlinkingRef = (0, react_1.useRef)(false);
    const lastBlinkTime = (0, react_1.useRef)(0);
    const blinkConfig = {
        ...DEFAULT_BLINK_CONFIG,
        ...config
    };
    const blink = (0, react_1.useCallback)(() => {
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
    const scheduleNextBlink = (0, react_1.useCallback)(() => {
        if (blinkTimeoutRef.current) {
            clearTimeout(blinkTimeoutRef.current);
        }
        const nextBlinkDelay = Math.random() *
            (blinkConfig.maxInterval - blinkConfig.minInterval) +
            blinkConfig.minInterval;
        blinkTimeoutRef.current = setTimeout(blink, nextBlinkDelay);
    }, [blink, blinkConfig.maxInterval, blinkConfig.minInterval]);
    (0, react_1.useEffect)(() => {
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
exports.useAvatarBlink = useAvatarBlink;
//# sourceMappingURL=useEyeBlink.js.map