"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useViseme = exports.VisemeProvider = exports.WEIGHT_MULTIPLIER = exports.PRELOAD = exports.LOG_INTERVAL = exports.SMOOTHING_FACTOR = exports.VISEME_OVERLAP = exports.DEFAULT_VISEME_DURATION = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const VisemeContext = (0, react_1.createContext)(undefined);
const VISEME_MAP = {
    0: 'viseme_sil',
    1: 'viseme_PP',
    2: 'viseme_FF',
    3: 'viseme_TH',
    4: 'viseme_DD',
    5: 'viseme_kk',
    6: 'viseme_CH',
    7: 'viseme_SS',
    8: 'viseme_nn',
    9: 'viseme_RR',
    10: 'viseme_aa',
    11: 'viseme_E',
    12: 'viseme_I',
    13: 'viseme_O',
    14: 'viseme_U',
    15: 'viseme_kk',
    16: 'viseme_CH',
    17: 'viseme_SS',
    18: 'viseme_TH',
    19: 'viseme_RR',
    20: 'viseme_kk',
    21: 'viseme_PP',
};
const CONSTANTS = {
    DEFAULT_VISEME_DURATION: 0.12,
    VISEME_OVERLAP: 0.02,
    SMOOTHING_FACTOR: 0.4,
    LOG_INTERVAL: 60,
    PRELOAD: 0.2,
    WEIGHT_MULTIPLIER: 0.8,
};
exports.DEFAULT_VISEME_DURATION = CONSTANTS.DEFAULT_VISEME_DURATION, exports.VISEME_OVERLAP = CONSTANTS.VISEME_OVERLAP, exports.SMOOTHING_FACTOR = CONSTANTS.SMOOTHING_FACTOR, exports.LOG_INTERVAL = CONSTANTS.LOG_INTERVAL, exports.PRELOAD = CONSTANTS.PRELOAD, exports.WEIGHT_MULTIPLIER = CONSTANTS.WEIGHT_MULTIPLIER;
const timing = {
    calculateEndTime: (startTime) => startTime + exports.DEFAULT_VISEME_DURATION,
    isExpired: (viseme, currentTime) => viseme.endTime < currentTime - exports.VISEME_OVERLAP,
    calculateWeight: (progress) => Math.sin(Math.PI * Math.min(progress, 1)) * exports.WEIGHT_MULTIPLIER,
    smoothWeight: (currentWeight, targetWeight) => currentWeight + (targetWeight - currentWeight) * exports.SMOOTHING_FACTOR,
};
const VisemeProvider = ({ children, }) => {
    const visemeQueueRef = (0, react_1.useRef)([]);
    const audioContextRef = (0, react_1.useRef)(null);
    const audioStartTimeRef = (0, react_1.useRef)(null);
    const [isProcessing, setIsProcessing] = (0, react_1.useState)(false);
    const [visemeState, setVisemeState] = (0, react_1.useState)('idle');
    const lastVisemeRef = (0, react_1.useRef)(null);
    const frameCountRef = (0, react_1.useRef)(0);
    const firstVisemeTimeRef = (0, react_1.useRef)(null);
    const setAudioContext = (0, react_1.useCallback)((ctx) => {
        audioContextRef.current = ctx;
        if (ctx.onstatechange !== null) {
            ctx.onstatechange = () => {
                switch (ctx.state) {
                    case 'running':
                        setVisemeState('active');
                        break;
                    case 'suspended':
                        setVisemeState('paused');
                        break;
                    case 'closed':
                        setVisemeState('finished');
                        stopProcessing();
                        break;
                }
            };
        }
    }, []);
    const startProcessing = (0, react_1.useCallback)((audioCtx) => {
        if (!audioCtx) {
            console.error('[VisemeContext] No audio context provided');
            return;
        }
        audioContextRef.current = audioCtx;
        audioStartTimeRef.current = audioCtx.currentTime;
        frameCountRef.current = 0;
        setIsProcessing(true);
        setVisemeState('active');
    }, []);
    const addViseme = (0, react_1.useCallback)((visemeId, audioOffset) => {
        if (visemeState === 'finished')
            return;
        const visemeName = VISEME_MAP[visemeId] || 'viseme_sil';
        const startTime = audioOffset / 10000000;
        if (firstVisemeTimeRef.current === null) {
            firstVisemeTimeRef.current = startTime;
        }
        const relativeStartTime = startTime - (firstVisemeTimeRef.current || 0);
        const endTime = relativeStartTime + exports.DEFAULT_VISEME_DURATION;
        const newViseme = {
            name: visemeName,
            weight: 0,
            startTime: relativeStartTime,
            endTime,
        };
        visemeQueueRef.current.push(newViseme);
        if (visemeState === 'idle') {
            setVisemeState('preparing');
        }
    }, [visemeState]);
    const resetVisemeQueue = (0, react_1.useCallback)(() => {
        visemeQueueRef.current = [];
        lastVisemeRef.current = null;
        audioStartTimeRef.current = null;
        firstVisemeTimeRef.current = null;
        frameCountRef.current = 0;
        setVisemeState('idle');
    }, []);
    const stopProcessing = (0, react_1.useCallback)(() => {
        setIsProcessing(false);
        setVisemeState('finished');
        audioStartTimeRef.current = null;
        lastVisemeRef.current = null;
        frameCountRef.current = 0;
        audioContextRef.current = null;
    }, []);
    const updateCurrentViseme = (0, react_1.useCallback)((_) => {
        if (!isProcessing || !audioContextRef.current)
            return null;
        const audioTime = audioContextRef.current.currentTime -
            (audioStartTimeRef.current || 0) +
            exports.PRELOAD;
        visemeQueueRef.current = visemeQueueRef.current.filter(v => !timing.isExpired(v, audioTime));
        const currentViseme = visemeQueueRef.current.find(v => v.startTime <= audioTime && v.endTime > audioTime - exports.VISEME_OVERLAP);
        if (currentViseme) {
            const progress = (audioTime - currentViseme.startTime) /
                (currentViseme.endTime - currentViseme.startTime);
            const targetWeight = timing.calculateWeight(progress);
            const smoothedWeight = lastVisemeRef.current
                ? timing.smoothWeight(lastVisemeRef.current.weight, targetWeight)
                : targetWeight;
            const updatedViseme = { ...currentViseme, weight: smoothedWeight };
            lastVisemeRef.current = updatedViseme;
            return updatedViseme;
        }
        if (lastVisemeRef.current) {
            const reducedWeight = lastVisemeRef.current.weight * (1 - exports.SMOOTHING_FACTOR);
            lastVisemeRef.current = {
                ...lastVisemeRef.current,
                weight: reducedWeight,
            };
        }
        lastVisemeRef.current = null;
        return null;
    }, [isProcessing]);
    const resetAndStartProcessing = (0, react_1.useCallback)((audioCtx) => {
        stopProcessing();
        resetVisemeQueue();
        startProcessing(audioCtx);
    }, [stopProcessing, resetVisemeQueue, startProcessing, visemeState]);
    const contextValue = (0, react_1.useMemo)(() => ({
        addViseme,
        updateCurrentViseme,
        startProcessing,
        stopProcessing,
        resetAndStartProcessing,
        resetVisemeQueue,
        isProcessing,
        setAudioContext,
    }), [
        addViseme,
        updateCurrentViseme,
        startProcessing,
        stopProcessing,
        resetAndStartProcessing,
        resetVisemeQueue,
        isProcessing,
        setAudioContext,
    ]);
    return ((0, jsx_runtime_1.jsx)(VisemeContext.Provider, { value: contextValue, children: children }));
};
exports.VisemeProvider = VisemeProvider;
const useViseme = () => {
    const context = (0, react_1.useContext)(VisemeContext);
    if (!context) {
        throw new Error('useVisemeContext must be used within a VisemeProvider');
    }
    return context;
};
exports.useViseme = useViseme;
//# sourceMappingURL=visemeContext.js.map