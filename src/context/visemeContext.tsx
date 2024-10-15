import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { MathUtils, SkinnedMesh } from 'three';

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

const VISEME_SMOOTHING = 0.5;
const DEFAULT_VISEME_DURATION = 0.1;
const MINIMUM_ELAPSED_TIME = 0.01;
const VISEME_SPEED_FACTOR = 0.95;
const AUDIO_PLAYBACK_RATE = 0.95;
const VISEME_BASE_SPEED = 0.95;

const VISEME_MAP: { [key: number]: string } = {
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

  const easeInOutQuad = (x: number): number => {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  };

  const setMeshRef = useCallback(
    (mesh: SkinnedMesh | null) => {
      if (mesh && mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
        meshRef.current = mesh;
        setIsMeshSet(true);
      } else {
        console.error('Invalid mesh provided:', mesh);
      }
    },
    [meshRef]
  );

  const addVisemeToQueue = useCallback((viseme: AzureViseme) => {
    visemeQueueRef.current.push(viseme);
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
    const baseDuration = 0.1;
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

      const easedProgress = easeInOutQuad(adjustedProgress);
      const targetWeight = Math.sin(easedProgress * Math.PI) * viseme.weight;

      currentVisemeWeightRef.current[viseme.name] = MathUtils.lerp(
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
      } else {
        console.error(
          `Viseme not found in morph target dictionary: ${viseme.name}`
        );
      }

      Object.keys(currentVisemeWeightRef.current).forEach((visemeName) => {
        if (visemeName !== viseme.name) {
          currentVisemeWeightRef.current[visemeName] = lerp(
            currentVisemeWeightRef.current[visemeName],
            0,
            VISEME_SMOOTHING * 0.5
          );

          const index = meshRef.current!.morphTargetDictionary?.[visemeName];
          if (typeof index === 'number' && meshRef.current!.morphTargetInfluences) {
            meshRef.current!.morphTargetInfluences[index] = currentVisemeWeightRef.current[visemeName];
          }
        }
      });
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
        return processedViseme;
      }
    );

    const interpolatedVisemes: ProcessedViseme[] = [];
    for (let i = 0; i < processedVisemes.length - 1; i++) {
      const currentViseme = processedVisemes[i];
      const nextViseme = processedVisemes[i + 1];
      
      interpolatedVisemes.push(currentViseme);
      
      const intermediateDuration = (nextViseme.startTime - currentViseme.startTime) * 0.5;
      interpolatedVisemes.push({
        name: 'viseme_sil',
        duration: intermediateDuration,
        weight: 0.5,
        startTime: currentViseme.startTime + intermediateDuration,
      });
    }
    interpolatedVisemes.push(processedVisemes[processedVisemes.length - 1]);

    currentVisemesRef.current = interpolatedVisemes;

    if (!isAnimatingRef.current) {
      isAnimatingRef.current = true;
      startTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      if (startTimeRef.current !== null) {
        const currentTime = performance.now();
        const elapsedTime =
          ((currentTime - startTimeRef.current) / 1000) * VISEME_SPEED_FACTOR;
        startTimeRef.current =
          currentTime - (elapsedTime / VISEME_SPEED_FACTOR) * 1000;
      }
    }

    return interpolatedVisemes;
  }, [animate]);

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
  }, []);

  const emotionMap: Record<string, Record<string, number>> = {
    Gioia: { Gioria: 1 },
    Rabbia: { Rabbia: 1 },
    Sorpresa: { Sorpresa: 1 },
    Tristezza: { Tristezza: 1 },
    Timore: { Timore: 1 },
  };

  const emotionToAzureStyleMap: Record<string, string> = {
    Gioia: 'cheerful',
    Rabbia: 'angry',
    Sorpresa: 'excited',
    Tristezza: 'sad',
    Timore: 'terrified',
  };

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