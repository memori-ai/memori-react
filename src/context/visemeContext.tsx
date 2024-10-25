import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  useState,
  useEffect,
} from 'react';

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
  resetAndStartProcessing: () => void;
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

const DEFAULT_VISEME_DURATION = 0.04; //0; // Reduced from 0.4 for smoother transitions
const VISEME_OVERLAP = 0.02; // Slightly increased from 0.04 for more overlap
const SMOOTHING_FACTOR = 0.35; // New constant for weight smoothing
const PRELOAD_TIME = 0.5; // Preload visemes 0.5 seconds in advance

// Utility function for formatted logging
const logVisemeEvent = (event: string, data: any) => {
  console.log(
    `%c[VisemeContext] ${event}`,
    'color: #4CAF50; font-weight: bold;',
    data
  );
};

const logVisemeError = (event: string, data: any) => {
  console.log(
    `%c[VisemeContext] ${event}`,
    'color: #f44336; font-weight: bold;',
    data
  );
};

const logVisemeDebug = (event: string, data: any) => {
  console.log(
    `%c[VisemeContext] ${event}`,
    'color: #2196F3; font-weight: bold;',
    data
  );
};

export const VisemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const visemeQueueRef = useRef<Viseme[]>([]);
  const baseTimeRef = useRef<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const lastVisemeRef = useRef<Viseme | null>(null);
  const frameCountRef = useRef(0);

  const addViseme = useCallback(
    (visemeId: number, audioOffset: number) => {
      const visemeName = VISEME_MAP[visemeId] || 'viseme_sil';
      const startTime = audioOffset / 10000000;
      const endTime = startTime + DEFAULT_VISEME_DURATION;
      
      const newViseme: Viseme = {
        name: visemeName,
        weight: 0,
        startTime,
        endTime,
      };

      visemeQueueRef.current.push(newViseme);
      
      logVisemeEvent('Added Viseme', {
        visemeId,
        name: visemeName,
        startTime,
        endTime,
        queueLength: visemeQueueRef.current.length,
        audioOffset,
      });

      if (!isProcessing) {
        logVisemeDebug('Starting processing due to new viseme', {
          isProcessing,
          queueLength: visemeQueueRef.current.length,
        });
        startProcessing();
      }
    },
    [isProcessing]
  );


  const startProcessing = useCallback(() => {
    baseTimeRef.current = 0;
    frameCountRef.current = 0;
    setIsProcessing(true);
    
    logVisemeEvent('Started Processing', {
      baseTime: baseTimeRef.current,
      queueLength: visemeQueueRef.current.length,
    });
  }, []);

  const stopProcessing = useCallback(() => {
    setIsProcessing(false);
    baseTimeRef.current = 0;
    lastVisemeRef.current = null;
    frameCountRef.current = 0;
    
    logVisemeEvent('Stopped Processing', {
      queueLength: visemeQueueRef.current.length,
      lastViseme: lastVisemeRef.current,
    });
  }, []);

  const resetVisemeQueue = useCallback(() => {
    const queueLength = visemeQueueRef.current.length;
    visemeQueueRef.current = [];
    lastVisemeRef.current = null;
    baseTimeRef.current = 0;
    frameCountRef.current = 0;
    
    logVisemeEvent('Reset Viseme Queue', {
      previousQueueLength: queueLength,
      baseTime: baseTimeRef.current,
    });
  }, []);

  const resetAndStartProcessing = useCallback(() => {
    logVisemeEvent('Resetting and Starting Processing', {
      previousQueueLength: visemeQueueRef.current.length,
      wasProcessing: isProcessing,
    });
    
    stopProcessing();
    resetVisemeQueue();
    startProcessing();
  }, [stopProcessing, resetVisemeQueue, startProcessing]);


    const updateCurrentViseme = useCallback(
    (elapsedTime: number): Viseme | null => {
      frameCountRef.current++;
      
      // Log every 60 frames to avoid console spam
      const shouldLog = frameCountRef.current % 60 === 0;
      
      if (!isProcessing) {
        if (shouldLog) {
          logVisemeError('Not processing visemes', { elapsedTime, isProcessing });
        }
        return null;
      }

      // Calculate time relative to when processing started
      const relativeTime = elapsedTime - baseTimeRef.current;

      // Remove expired visemes and log the cleanup
      const initialLength = visemeQueueRef.current.length;
      visemeQueueRef.current = visemeQueueRef.current.filter(
        v => v.endTime > relativeTime
      );
      
      if (initialLength !== visemeQueueRef.current.length && shouldLog) {
        logVisemeDebug('Cleaned up expired visemes', {
          before: initialLength,
          after: visemeQueueRef.current.length,
          relativeTime,
        });
      }

      const currentViseme = visemeQueueRef.current.find(
        v => v.startTime <= relativeTime && 
             v.endTime > relativeTime - VISEME_OVERLAP
      );

      if (currentViseme) {
        const visemeProgress =
          (relativeTime - currentViseme.startTime) /
          (currentViseme.endTime - currentViseme.startTime);
        const targetWeight = Math.sin(Math.PI * Math.min(visemeProgress, 1));

        const smoothedWeight = lastVisemeRef.current
          ? lastVisemeRef.current.weight +
            (targetWeight - lastVisemeRef.current.weight) * SMOOTHING_FACTOR
          : targetWeight;

        const updatedViseme = { ...currentViseme, weight: smoothedWeight };
        lastVisemeRef.current = updatedViseme;

        if (shouldLog) {
          logVisemeDebug('Active viseme updated', {
            name: updatedViseme.name,
            weight: smoothedWeight.toFixed(3),
            progress: visemeProgress.toFixed(3),
            relativeTime: relativeTime.toFixed(3),
            queueLength: visemeQueueRef.current.length,
          });
        }

        return updatedViseme;
      }

      // Gradually reduce weight when no viseme is active
      if (lastVisemeRef.current) {
        const reducedWeight = lastVisemeRef.current.weight * (1 - SMOOTHING_FACTOR);
        if (reducedWeight > 0.01) {
          lastVisemeRef.current = {
            ...lastVisemeRef.current,
            weight: reducedWeight,
          };
          
          if (shouldLog) {
            logVisemeDebug('Fading out last viseme', {
              name: lastVisemeRef.current.name,
              weight: reducedWeight.toFixed(3),
              relativeTime: relativeTime.toFixed(3),
            });
          }
          
          return lastVisemeRef.current;
        }
      }

      if (shouldLog && lastVisemeRef.current) {
        logVisemeDebug('No active viseme', {
          relativeTime: relativeTime.toFixed(3),
          queueLength: visemeQueueRef.current.length,
        });
      }

      lastVisemeRef.current = null;
      return null;
    },
    [isProcessing]
  );

  const contextValue = {
    addViseme,
    updateCurrentViseme,
    startProcessing,
    stopProcessing,
    resetAndStartProcessing,
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
