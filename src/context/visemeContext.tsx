import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { SkinnedMesh } from 'three';

type AzureViseme = { visemeId: number; audioOffset: number };

type ProcessedViseme = {
  name: string;
  duration: number;
  weight: number;
  startTime: number;
};

interface VisemeContextType {
  setMeshRef: (mesh: SkinnedMesh | null) => void;
  addVisemeToQueue: (viseme: AzureViseme) => void;
  processVisemeQueue: () => ProcessedViseme[];
  clearVisemes: () => void;
  isMeshSet: boolean;
  setEmotion: (emotion: string) => void;
  emotion: string;
  getAzureStyleForEmotion: (emotion: string) => string;
}

const VisemeContext = createContext<VisemeContextType | undefined>(undefined);

const VISEME_SMOOTHING = 0.45;
const DEFAULT_VISEME_DURATION = 0.1;
const MINIMUM_ELAPSED_TIME = 0.01;
const VISEME_SPEED_FACTOR = 1.0;
const AUDIO_PLAYBACK_RATE = 1.0;
const VISEME_BASE_SPEED = 1.0;

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

export const VisemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMeshSet, setIsMeshSet] = useState(false);
  const [emotion, setEmotion] = useState('Neutral');
  const isAnimatingRef = useRef(false);
  const currentVisemesRef = useRef<ProcessedViseme[]>([]);
  const visemeQueueRef = useRef<AzureViseme[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const currentVisemeWeightRef = useRef<{ [key: string]: number }>({});
  const meshRef = useRef<SkinnedMesh | null>(null);

  const lerp = (start: number, end: number, alpha: number): number => {
    return start * (1 - alpha) + end * alpha;
  };

  const easeInOutCubic = (x: number): number => {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  };

  const setMeshRef = useCallback(
    (mesh: SkinnedMesh | null) => {
      if (mesh && mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
        meshRef.current = mesh;
        setIsMeshSet(true);
        // console.log('Mesh set successfully:', mesh);
      } else {
        console.error('Invalid mesh provided:', mesh);
      }
    },
    [meshRef]
  );

  const addVisemeToQueue = useCallback((viseme: AzureViseme) => {
    visemeQueueRef.current.push(viseme);
    // console.log('Viseme added to queue:', viseme);
  }, []);

  const getCurrentViseme = useCallback((elapsedTime: number) => {
    if (elapsedTime < MINIMUM_ELAPSED_TIME) return null;

    return currentVisemesRef.current.find((viseme, index) => {
      const nextViseme = currentVisemesRef.current[index + 1];
      return (
        elapsedTime >= viseme.startTime &&
        (!nextViseme || elapsedTime < nextViseme.startTime)
      );
    });
  }, []);

  const getDynamicSpeedFactor = (visemeDuration: number): number => {
    const baseDuration = 0.1; // Average expected viseme duration
    return (
      VISEME_BASE_SPEED * (baseDuration / visemeDuration) * AUDIO_PLAYBACK_RATE
    );
  };

  const applyViseme = useCallback(
    (viseme: ProcessedViseme, elapsedTime: number) => {
      if (!meshRef.current) {
        console.error('Mesh not set');
        return;
      }

      const visemeProgress = Math.min(
        (elapsedTime - viseme.startTime) / viseme.duration,
        1
      );

      const dynamicSpeedFactor = getDynamicSpeedFactor(viseme.duration);
      const adjustedProgress = visemeProgress * dynamicSpeedFactor;

      // Use a cubic easing function for smoother transitions
      const easedProgress = easeInOutCubic(adjustedProgress);
      const targetWeight = Math.sin(easedProgress * Math.PI) * viseme.weight;

      currentVisemeWeightRef.current[viseme.name] = lerp(
        currentVisemeWeightRef.current[viseme.name] || 0,
        targetWeight,
        VISEME_SMOOTHING
      );

      const visemeIndex = meshRef.current.morphTargetDictionary?.[viseme.name];
      if (
        typeof visemeIndex === 'number' &&
        meshRef.current.morphTargetInfluences
      ) {
        meshRef.current.morphTargetInfluences[visemeIndex] =
          currentVisemeWeightRef.current[viseme.name];
        // console.log(`Applied viseme: ${viseme.name}, weight: ${currentVisemeWeightRef.current[viseme.name]}`);
      } else {
        console.error(
          `Viseme not found in morph target dictionary: ${viseme.name}`
        );
      }
    },
    []
  );

  const animate = useCallback(
    (time: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = time;
      }

      const elapsedTime =
        ((time - startTimeRef.current) / 1000) * VISEME_SPEED_FACTOR;

      const currentViseme = getCurrentViseme(elapsedTime);

      if (currentViseme) {
        applyViseme(currentViseme, elapsedTime);
      }

      if (
        currentVisemesRef.current.length > 0 &&
        elapsedTime <
          currentVisemesRef.current[currentVisemesRef.current.length - 1]
            .startTime +
            currentVisemesRef.current[currentVisemesRef.current.length - 1]
              .duration
      ) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        clearVisemes();
      }
    },
    [getCurrentViseme, applyViseme]
  );

  const processVisemeQueue = useCallback(() => {
    const azureVisemes = [...visemeQueueRef.current];
    visemeQueueRef.current = [];

    if (azureVisemes.length === 0) {
      // console.log('No visemes to process');
      return [];
    }

    const processedVisemes: ProcessedViseme[] = azureVisemes.map(
      (currentViseme, i) => {
        const nextViseme = azureVisemes[i + 1];
        const duration = nextViseme
          ? (nextViseme.audioOffset - currentViseme.audioOffset) / 10000000
          : DEFAULT_VISEME_DURATION;

        const processedViseme = {
          name: VISEME_MAP[currentViseme.visemeId] || 'viseme_sil',
          duration,
          weight: 1,
          startTime: currentViseme.audioOffset / 10000000,
        };
        //console.log('Processed viseme:', processedViseme);
        return processedViseme;
      }
    );

    currentVisemesRef.current = processedVisemes;

    // Start animation immediately if not already animating
    if (!isAnimatingRef.current) {
      isAnimatingRef.current = true;
      startTimeRef.current = performance.now();
      // console.log('Starting animation');
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      // If already animating, adjust the start time for the new visemes
      if (startTimeRef.current !== null) {
        const currentTime = performance.now();
        const elapsedTime =
          ((currentTime - startTimeRef.current) / 1000) * VISEME_SPEED_FACTOR;
        startTimeRef.current =
          currentTime - (elapsedTime / VISEME_SPEED_FACTOR) * 1000;
      }
    }

    return processedVisemes;
  }, [isMeshSet, animate]);

  const clearVisemes = useCallback(() => {
    currentVisemesRef.current = [];
    visemeQueueRef.current = [];

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (
      meshRef.current?.morphTargetDictionary &&
      meshRef.current?.morphTargetInfluences
    ) {
      Object.values(meshRef.current.morphTargetDictionary).forEach(index => {
        if (typeof index === 'number') {
          meshRef.current!.morphTargetInfluences![index] = 0;
        }
      });
    }

    currentVisemeWeightRef.current = {};
    startTimeRef.current = null;
    isAnimatingRef.current = false;
    // console.log('Visemes cleared');
  }, []);

  // Your existing emotion map
  const emotionMap: Record<string, Record<string, number>> = {
    Gioia: { Gioria: 1 },
    Rabbia: { Rabbia: 1 },
    Sorpresa: { Sorpresa: 1 },
    Tristezza: { Tristezza: 1 },
    Timore: { Timore: 1 },
  };

  // Mapping from your emotions to Azure styles
  const emotionToAzureStyleMap: Record<string, string> = {
    Gioia: 'cheerful',
    Rabbia: 'angry',
    Sorpresa: 'excited',
    Tristezza: 'sad',
    Timore: 'terrified',
  };

  // Function to get Azure style from emotion
  function getAzureStyleForEmotion(emotion: string): string {
    return emotionToAzureStyleMap[emotion] || 'neutral';
  }


  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const contextValue: VisemeContextType = {
    setMeshRef,
    addVisemeToQueue,
    processVisemeQueue,
    clearVisemes,
    isMeshSet,
    setEmotion,
    emotion,
    getAzureStyleForEmotion,
  };

  return (
    <VisemeContext.Provider value={contextValue}>
      {children}
    </VisemeContext.Provider>
  );
};

export const useViseme = (): VisemeContextType => {
  const context = useContext(VisemeContext);
  if (context === undefined) {
    throw new Error('useViseme must be used within a VisemeProvider');
  }
  return context;
};
