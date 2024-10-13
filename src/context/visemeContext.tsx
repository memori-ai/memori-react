import React, { createContext, useContext, useRef, useCallback, useState, useEffect } from 'react';

type Viseme = { name: string; weight: number; startTime: number; duration: number };

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
  // Mapping the rest based on closest matches or keeping them as in the original mapping
  15: 'viseme_kk', // g, k (same as 5)
  16: 'viseme_CH', // ch, j, sh, zh (same as 6)
  17: 'viseme_SS', // s, z (same as 7)
  18: 'viseme_TH', // th, dh (same as 3)
  19: 'viseme_RR', // r (same as 9)
  20: 'viseme_kk', // w (closest match, could be debated)
  21: 'viseme_PP', // y (closest match, could be debated)
};

const DEFAULT_VISEME_DURATION = 0.1;
const VISEME_OVERLAP = 0.05;

export const VisemeProvider: React.FC<{ children: React.ReactNode; enableCleanup?: boolean }> = ({ children, enableCleanup = false }) => {
  const visemeQueueRef = useRef<Viseme[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const addViseme = useCallback((visemeId: number, audioOffset: number) => {
    const visemeName = VISEME_MAP[visemeId] || 'viseme_sil';
    const startTime = audioOffset / 10000000;
    const newViseme: Viseme = {
      name: visemeName,
      weight: 0,
      startTime,
      duration: DEFAULT_VISEME_DURATION,
    };
    visemeQueueRef.current.push(newViseme);

    if (!isProcessing) {
      startProcessing();
    }
  }, [isProcessing]);

  const updateCurrentViseme = useCallback((currentTime: number): Viseme | null => {
    if (!isProcessing || startTimeRef.current === null) {
      return null;
    }

    let elapsedTime = currentTime - startTimeRef.current;

    if (elapsedTime < 0) {
      startTimeRef.current = currentTime;
      elapsedTime = 0;
    }

    if (enableCleanup) {
      visemeQueueRef.current = visemeQueueRef.current.filter(v => 
        v.startTime + v.duration > elapsedTime - VISEME_OVERLAP
      );
    }

    const currentViseme = visemeQueueRef.current.find(v => 
      v.startTime <= elapsedTime && v.startTime + v.duration > elapsedTime - VISEME_OVERLAP
    );
    const nextViseme = visemeQueueRef.current.find(v => v.startTime > elapsedTime);

    if (!currentViseme && !nextViseme) {
      return null;
    }

    if (!currentViseme && nextViseme) {
      return { ...nextViseme, weight: 0 };
    }

    if (currentViseme) {
      const visemeProgress = (elapsedTime - currentViseme.startTime) / currentViseme.duration;
      const weight = Math.sin(Math.PI * Math.min(visemeProgress, 1));

      if (nextViseme && visemeProgress > 0.5) {
        const nextWeight = Math.sin(Math.PI * Math.max(0, (visemeProgress - 0.5) * 2));
        return {
          name: `${currentViseme.name}_to_${nextViseme.name}`,
          weight: 1,
          startTime: currentViseme.startTime,
          duration: nextViseme.startTime - currentViseme.startTime,
        };
      }

      return { ...currentViseme, weight };
    }

    return null;
  }, [isProcessing, enableCleanup]);

  const startProcessing = useCallback(() => {
    if (isProcessing) {
      return;
    }

    const earliestVisemeTime = visemeQueueRef.current.length > 0
      ? Math.min(...visemeQueueRef.current.map(v => v.startTime))
      : performance.now() / 1000;

    startTimeRef.current = Math.min(earliestVisemeTime, performance.now() / 1000);
    setIsProcessing(true);
  }, [isProcessing]);

  const stopProcessing = useCallback(() => {
    if (!isProcessing) {
      return;
    }

    startTimeRef.current = null;
    setIsProcessing(false);
  }, [isProcessing]);

  const resetVisemeQueue = useCallback(() => {
    visemeQueueRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      stopProcessing();
      resetVisemeQueue();
    };
  }, [stopProcessing, resetVisemeQueue]);

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