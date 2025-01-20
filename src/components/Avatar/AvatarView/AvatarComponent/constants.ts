import { Vector3, Euler } from 'three';
import { AnimationConfig } from './components/FullbodyAvatar/types';

// Position and rotation of the avatar
export const AVATAR_POSITION = new Vector3(0, -1, 0);
export const AVATAR_ROTATION = new Euler(0.175, 0, 0);
export const AVATAR_POSITION_ZOOMED = new Vector3(0, -1.45, 0);

// Factor for lerping the scale of the avatar
export const SCALE_LERP_FACTOR = 0.1;

// Maximum number of idle loops before forcing change
export const MAX_IDLE_LOOPS_DEFAULT = 5;


interface BaseAction {
  weight: number;
  action?: string;
}

// Base animations for the avatar
export const BASE_ACTIONS: Record<string, BaseAction> = {
  Gioia1: { weight: 0 },
  Gioia2: { weight: 0 },
  Gioia3: { weight: 0 },
  Idle1: { weight: 1 },
  Idle2: { weight: 0 },
  Idle3: { weight: 0 },
  Idle4: { weight: 0 },
  Idle5: { weight: 0 },
  Rabbia1: { weight: 0 },
  Rabbia2: { weight: 0 },
  Rabbia3: { weight: 0 },
  Sorpresa1: { weight: 0 },
  Sorpresa2: { weight: 0 },
  Sorpresa3: { weight: 0 },
  Timore1: { weight: 0 },
  Timore2: { weight: 0 },
  Timore3: { weight: 0 },
  Tristezza1: { weight: 0 },
  Tristezza2: { weight: 0 },
  Tristezza3: { weight: 0 },
  Loading1: { weight: 0 },
  Loading2: { weight: 0 },
  Loading3: { weight: 0 },
};

export const MAPPING_BLEND_SHAPE_TO_EMOTION_RPM = {
  Rabbia: { // Anger
    'browDownLeft': 0.5,
    'browDownRight': 0.5,
    'browOuterUpLeft': 0.5,
    'browOuterUpRight': 0.5,
    'mouthSmile': -0.2,
  },
  Timore: { // Fear
    'browOuterUpLeft': -0.5,
    'browOuterUpRight': -0.5,
    'eyeWideLeft': -0.5,
    'eyeWideRight': -0.5,
  },
  Tristezza: { // Sadness
    'browDownLeft': -0.5,
    'browDownRight': -0.5,
    'eyeSquintLeft': 0.5,
    'eyeSquintRight': 0.5,
    'mouthSmile': -0.6,
  },
  Sorpresa: { // Surprise
    'browInnerUp': 0.5,
    'browOuterUpLeft': 0.5,
    'browOuterUpRight': 0.5,
    'eyeWideLeft': 0.5,
    'eyeWideRight': 0.5,
  },
  Gioia: { // Joy
    'browDownLeft': 0.5,
    'browDownRight': 0.5,
    'browInnerUp': 0.5,
    'mouthSmile': 0.8,
  }
};

// For custom GLB - using direct emotion morphs
export const MAPPING_BLEND_SHAPE_TO_EMOTION_CUSTOM_GLB = {
  Gioia: 'Joy',
  Rabbia: 'Anger', 
  Sorpresa: 'Surprise',
  Tristezza: 'Sadness',
  Timore: 'Fear'
};

// Direct emotion map for custom GLB
export const EMOTION_MAP_CUSTOM_GLB = {
  Joy: { Joy: 1 },
  Anger: { Anger: 1 },
  Surprise: { Surprise: 1 },
  Sadness: { Sadness: 1 },
  Fear: { Fear: 1 }
};

// URL for the male avatar
export const ANIMATION_URLS = {
  MALE: 'https://assets.memori.ai/api/v2/asset/2c5e88a4-cf62-408b-9ef0-518b099dfcb2.glb',
  FEMALE:
    'https://assets.memori.ai/api/v2/asset/2adc934b-24b2-45bd-94ad-ffec58d3cb32.glb',
};

// Blink configuration
export const BLINK_CONFIG = {
  minInterval: 1000,
  maxInterval: 5000,
  blinkDuration: 150,
};

// Default animation configuration
export const DEFAULT_CONFIG: AnimationConfig = {
  fadeInDuration: 0.8,
  fadeOutDuration: 0.8,
  idleCount: 5,
  timeScale: 1.0,
};

// Smoothing factors for emotion and viseme morphs
export const EMOTION_SMOOTHING = 0.3;
export const VISEME_SMOOTHING = 0.5;
