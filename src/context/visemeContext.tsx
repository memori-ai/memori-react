import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  useState,
  useMemo,
} from 'react';
import { IAudioContext } from 'standardized-audio-context';

type Viseme = {
  name: string;
  weight: number;
  startTime: number;
  endTime: number;
};

interface VisemeContextType {
  addViseme: (visemeId: number, audioOffset: number) => void;
  updateCurrentViseme: (currentTime: number) => Viseme | null;
  startProcessing: (audioCtx: IAudioContext) => void;
  stopProcessing: () => void;
  resetAndStartProcessing: (audioCtx: IAudioContext) => void;
  resetVisemeQueue: () => void;
  isProcessing: boolean;
  setAudioContext: (ctx: IAudioContext) => void;
}

const VisemeContext = createContext<VisemeContextType | undefined>(undefined);

const VISEME_MAP: Readonly<{ [key: number]: string }> = {
  0: 'viseme_sil', // silence
  1: 'viseme_PP', // p, b, m
  2: 'viseme_FF', // f, v
  3: 'viseme_TH', // th, dh
  4: 'viseme_DD', // t, d, n, l
  5: 'viseme_kk', // k, g, ng
  6: 'viseme_CH', // tS, dZ, S, Z
  7: 'viseme_SS', // s, z
  8: 'viseme_nn', // Not explicitly defined in Azure mapping, keeping for compatibility
  9: 'viseme_RR', // r
  10: 'viseme_aa', // A:
  11: 'viseme_E', // e
  12: 'viseme_I', // I
  13: 'viseme_O', // O
  14: 'viseme_U', // u
  15: 'viseme_kk', // g, k (same as 5)
  16: 'viseme_CH', // ch, j, sh, zh (same as 6)
  17: 'viseme_SS', // s, z (same as 7)
  18: 'viseme_TH', // th, dh (same as 3)
  19: 'viseme_RR', // r (same as 9)
  20: 'viseme_kk', // w (closest match, could be debated)
  21: 'viseme_PP', // y (closest match, could be debated)
};

// Optimized constants with explanations
const CONSTANTS = {
  // Duration of each viseme - optimized for natural speech
  // Slightly longer to ensure smoother transitions
  // Average syllable duration in natural speech is ~0.2s
  // We want shorter duration for more precise lip movements
  DEFAULT_VISEME_DURATION: 0.1, // 100ms per viseme

  // Overlap between consecutive visemes
  // Increased for smoother blending between mouth shapes
  // Should be about 1/3 of the viseme duration for natural transition
  VISEME_OVERLAP: 0.02, // 30ms overlap

  // Smoothing factor for weight transitions
  // Lower value = smoother but slower transitions
  // Higher value = faster but potentially jerky transitions
  // 0.4 provides good balance between responsiveness and smoothness
  SMOOTHING_FACTOR: 0.4,

  // How often to log debug information (in frames)
  // Adjusted to be less frequent to reduce console spam
  // 60 frames = roughly 1 second at 60fps
  LOG_INTERVAL: 60,

  // Time to preload/buffer visemes (in seconds)
  // Reduced from 1s to 0.5s as we don't need such a large buffer
  // Half a second is enough to prepare upcoming visemes
  PRELOAD: 0.5,

  // Weight multiplication factor for emphasis
  // Can be adjusted to make lip movements more or less pronounced
  WEIGHT_MULTIPLIER: 0.8,
} as const;

// Export individual constants for backwards compatibility
export const {
  DEFAULT_VISEME_DURATION,
  VISEME_OVERLAP,
  SMOOTHING_FACTOR,
  LOG_INTERVAL,
  PRELOAD,
  WEIGHT_MULTIPLIER,
} = CONSTANTS;

// Helper functions for timing calculations
const timing = {
  // Calculate viseme end time based on start time
  calculateEndTime: (startTime: number) => startTime + DEFAULT_VISEME_DURATION,

  // Check if viseme is expired
  isExpired: (viseme: Viseme, currentTime: number) =>
    viseme.endTime < currentTime - VISEME_OVERLAP,

  // Calculate viseme weight based on progress
  calculateWeight: (progress: number) =>
    Math.sin(Math.PI * Math.min(progress, 1)) * WEIGHT_MULTIPLIER,

  // Calculate smooth transition between weights
  smoothWeight: (currentWeight: number, targetWeight: number) =>
    currentWeight + (targetWeight - currentWeight) * SMOOTHING_FACTOR,
};

const createLogger =
  (type: 'event' | 'error' | 'debug') => (event: string, data: any) => {
    const styles = {
      event: 'color: #4CAF50; font-weight: bold;',
      error: 'color: #f44336; font-weight: bold;',
      debug: 'color: #2196F3; font-weight: bold;',
    };
    console.log(`%c[VisemeContext] ${event}`, styles[type], data);
  };

const logVisemeEvent = createLogger('event');
const logVisemeError = createLogger('error');
const logVisemeDebug = createLogger('debug');

type VisemeState = 'idle' | 'preparing' | 'active' | 'paused' | 'finished';

export const VisemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const visemeQueueRef = useRef<Viseme[]>([]);
  const audioContextRef = useRef<IAudioContext | null>(null);
  const audioStartTimeRef = useRef<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [visemeState, setVisemeState] = useState<VisemeState>('idle');
  const lastVisemeRef = useRef<Viseme | null>(null);
  const frameCountRef = useRef(0);
  const firstVisemeTimeRef = useRef<number | null>(null);

  const setAudioContext = useCallback((ctx: IAudioContext) => {
    audioContextRef.current = ctx;

    // Listen to audio context state changes
    ctx.onstatechange = () => {
      logVisemeEvent('Audio Context State Change', {
        state: ctx.state,
        currentTime: ctx.currentTime,
      });

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
  }, []);

  const addViseme = useCallback(
    (visemeId: number, audioOffset: number) => {
      if (visemeState === 'finished') return;

      const visemeName = VISEME_MAP[visemeId] || 'viseme_sil';
      const startTime = audioOffset / 10000000;

      // Store first viseme time as reference
      if (firstVisemeTimeRef.current === null) {
        firstVisemeTimeRef.current = startTime;
      }

      // Calculate time relative to first viseme
      const relativeStartTime = startTime - (firstVisemeTimeRef.current || 0);
      const endTime = relativeStartTime + DEFAULT_VISEME_DURATION;

      const newViseme: Viseme = {
        name: visemeName,
        weight: 0,
        startTime: relativeStartTime,
        endTime,
      };

      visemeQueueRef.current.push(newViseme);

      if (visemeState === 'idle') {
        setVisemeState('preparing');
      }

      // logVisemeEvent('Added Viseme', {
      //   visemeId,
      //   name: visemeName,
      //   absoluteStartTime: startTime,
      //   relativeStartTime,
      //   endTime,
      //   queueLength: visemeQueueRef.current.length,
      //   state: visemeState,
      // });
    },
    [visemeState]
  );

  const startProcessing = useCallback((audioCtx: IAudioContext) => {
    if (!audioCtx) {
      logVisemeError('No audio context provided', { state: visemeState });
      return;
    }

    audioContextRef.current = audioCtx;
    audioStartTimeRef.current = audioCtx.currentTime;
    frameCountRef.current = 0;
    setIsProcessing(true);
    setVisemeState('active');

    logVisemeEvent('Started Processing', {
      audioTime: audioCtx.currentTime,
      queueLength: visemeQueueRef.current.length,
      state: visemeState,
    });
  }, []);

  const stopProcessing = useCallback(() => {
    setIsProcessing(false);
    setVisemeState('finished');
    audioStartTimeRef.current = null;
    lastVisemeRef.current = null;
    frameCountRef.current = 0;
    audioContextRef.current = null;

    logVisemeEvent('Stopped Processing', {
      queueLength: visemeQueueRef.current.length,
      state: visemeState,
    });
  }, []);

  const updateCurrentViseme = useCallback(
    (_: number): Viseme | null => {
      if (!isProcessing || !audioContextRef.current) return null;

      const audioTime =
        audioContextRef.current.currentTime -
        (audioStartTimeRef.current || 0) +
        PRELOAD;

      // Remove expired visemes
      visemeQueueRef.current = visemeQueueRef.current.filter(
        v => !timing.isExpired(v, audioTime)
      );

      // Find current active viseme
      const currentViseme = visemeQueueRef.current.find(
        v => v.startTime <= audioTime && v.endTime > audioTime - VISEME_OVERLAP
      );

      //log it every LOG_INTERVAL frames
      if (frameCountRef.current % LOG_INTERVAL === 60) {
        logVisemeDebug('Current Viseme', {
          currentViseme,
          audioTime,
          visemeQueue: visemeQueueRef.current,
        });
      }

      if (currentViseme) {
        const progress =
          (audioTime - currentViseme.startTime) /
          (currentViseme.endTime - currentViseme.startTime);

        const targetWeight = timing.calculateWeight(progress);

        const smoothedWeight = lastVisemeRef.current
          ? timing.smoothWeight(lastVisemeRef.current.weight, targetWeight)
          : targetWeight;

        const updatedViseme = { ...currentViseme, weight: smoothedWeight };
        lastVisemeRef.current = updatedViseme;

        return updatedViseme;
      }

      // Handle fade out
      if (lastVisemeRef.current) {
        const reducedWeight =
          lastVisemeRef.current.weight * (1 - SMOOTHING_FACTOR);
        lastVisemeRef.current = {
          ...lastVisemeRef.current,
          weight: reducedWeight,
        };
      }

      lastVisemeRef.current = null;
      return null;
    },
    [isProcessing]
  );

  const resetVisemeQueue = useCallback(() => {
    visemeQueueRef.current = [];
    lastVisemeRef.current = null;
    audioStartTimeRef.current = null;
    firstVisemeTimeRef.current = null;
    frameCountRef.current = 0;
    setVisemeState('idle');

    logVisemeEvent('Reset Viseme Queue', {
      previousState: visemeState,
    });
  }, [visemeState]);

  const resetAndStartProcessing = useCallback(
    (audioCtx: IAudioContext) => {
      logVisemeEvent('Reset And Start Processing', {
        previousState: visemeState,
        queueLength: visemeQueueRef.current.length,
      });

      stopProcessing();
      resetVisemeQueue();
      startProcessing(audioCtx);
    },
    [stopProcessing, resetVisemeQueue, startProcessing, visemeState]
  );

  const contextValue = useMemo(
    () => ({
      addViseme,
      updateCurrentViseme,
      startProcessing,
      stopProcessing,
      resetAndStartProcessing,
      resetVisemeQueue,
      isProcessing,
      setAudioContext,
    }),
    [
      addViseme,
      updateCurrentViseme,
      startProcessing,
      stopProcessing,
      resetAndStartProcessing,
      resetVisemeQueue,
      isProcessing,
      setAudioContext,
    ]
  );

  return (
    <VisemeContext.Provider value={contextValue}>
      {children}
    </VisemeContext.Provider>
  );
};

export const useViseme = () => {
  const context = useContext(VisemeContext);
  if (!context) {
    throw new Error('useVisemeContext must be used within a VisemeProvider');
  }
  return context;
};
