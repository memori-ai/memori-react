import React, { createContext, useContext, useRef, useCallback, useState, useEffect } from 'react';

type Viseme = { 
  name: string; 
  weight: number; 
  startTime: number; 
  endTime: number;
};

interface VisemeContextType {
  addViseme: (visemeId: number, audioOffset: number) => void;
  updateCurrentViseme: (currentTime: number) => Viseme | null;
  startProcessing: () => void;
  stopProcessing: () => void;
  resetVisemeQueue: () => void;
  isProcessing: boolean;
}

const VisemeContext = createContext<VisemeContextType | undefined>(undefined);

const VISEME_MAP: { [key: number]: string } = {
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

const DEFAULT_VISEME_DURATION = 0.06 //0; // Reduced from 0.4 for smoother transitions
const VISEME_OVERLAP = 0.5; // Slightly increased from 0.04 for more overlap
const SMOOTHING_FACTOR = 0.4 // New constant for weight smoothing
const TIME_OFFSET = -0.1; // Adjust this value as needed (in seconds)
const PRELOAD_TIME = 0.6; // Preload visemes 0.5 seconds in advance

export const VisemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const visemeQueueRef = useRef<Viseme[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const lastVisemeRef = useRef<Viseme | null>(null);

  const addViseme = useCallback((visemeId: number, audioOffset: number) => {
    const visemeName = VISEME_MAP[visemeId] || 'viseme_sil';
    const startTime = audioOffset / 10000000 + TIME_OFFSET;
    const endTime = startTime + DEFAULT_VISEME_DURATION;
    const newViseme: Viseme = {
      name: visemeName,
      weight: 0,
      startTime,
      endTime,
    };
    visemeQueueRef.current.push(newViseme);

    if (!isProcessing) {
      startProcessing();
    }
  }, [isProcessing]);

  const updateCurrentViseme = useCallback((currentTime: number): Viseme | null => {
    if (!isProcessing || startTimeRef.current === null) {
      console.log('StartTimeRef not set');
      return null;
    }

    const elapsedTime = currentTime - startTimeRef.current + PRELOAD_TIME

    // Remove expired visemes
    visemeQueueRef.current = visemeQueueRef.current.filter(v => v.endTime > elapsedTime);

    const currentViseme = visemeQueueRef.current.find(v => 
      v.startTime <= elapsedTime && v.endTime > elapsedTime - VISEME_OVERLAP
    );

    if (currentViseme) {
      console.log('CurrentViseme Found!')
      const visemeProgress = (elapsedTime - currentViseme.startTime) / (currentViseme.endTime - currentViseme.startTime);
      const targetWeight = Math.sin(Math.PI * Math.min(visemeProgress, 1));
      
      // Smooth the weight transition
      const smoothedWeight = lastVisemeRef.current
        ? lastVisemeRef.current.weight + (targetWeight - lastVisemeRef.current.weight) * SMOOTHING_FACTOR
        : targetWeight;

      const updatedViseme = { ...currentViseme, weight: smoothedWeight };
      lastVisemeRef.current = updatedViseme;
      return updatedViseme;
    }

    // Gradually reduce weight when no viseme is active
    if (lastVisemeRef.current) {
      const reducedWeight = lastVisemeRef.current.weight * (1 - SMOOTHING_FACTOR);
      if (reducedWeight > 0.01) {
        lastVisemeRef.current = { ...lastVisemeRef.current, weight: reducedWeight };
        return lastVisemeRef.current;
      }
    }

    lastVisemeRef.current = null;
    return null;
  }, [isProcessing]);

  const startProcessing = useCallback(() => {
    if (isProcessing) return;
    startTimeRef.current = performance.now() / 1000;
    setIsProcessing(true);
  }, [isProcessing]);

  const stopProcessing = useCallback(() => {
    setIsProcessing(false);
    startTimeRef.current = null;
    lastVisemeRef.current = null;
  }, []);

  const resetVisemeQueue = useCallback(() => {
    visemeQueueRef.current = [];
    lastVisemeRef.current = null;
  }, []);

  const contextValue = {
    addViseme,
    updateCurrentViseme,
    startProcessing,
    stopProcessing,
    resetVisemeQueue,
    isProcessing,
  };

  return (
    <VisemeContext.Provider value={contextValue}>
      {children}
    </VisemeContext.Provider>
  );
};

export const useViseme = (): VisemeContextType => {
  const context = useContext(VisemeContext);
  if (!context) {
    throw new Error('useViseme must be used within a VisemeProvider');
  }
  return context;
};