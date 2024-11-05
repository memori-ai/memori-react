import { Vector3, Euler } from 'three';
import { AnimationConfig } from './types';

export const AVATAR_POSITION = new Vector3(0, -1, 0);
export const AVATAR_ROTATION = new Euler(0.175, 0, 0);
export const AVATAR_POSITION_ZOOMED = new Vector3(0, -1.45, 0);

export const ANIMATION_URLS = {
  MALE: 'https://assets.memori.ai/api/v2/asset/2c5e88a4-cf62-408b-9ef0-518b099dfcb2.glb',
  FEMALE:
    'https://assets.memori.ai/api/v2/asset/8d1a5853-f05a-4a34-9f99-6eff64986081.glb',
};

export const BLINK_CONFIG = {
  minInterval: 1000,
  maxInterval: 5000,
  blinkDuration: 150,
};

export const DEFAULT_CONFIG: AnimationConfig = {
  fadeInDuration: 0.8,
  fadeOutDuration: 0.8,
  idleCount: 5,
  timeScale: 1.0,
};

export const EMOTION_SMOOTHING = 0.3;
export const VISEME_SMOOTHING = 0.5;
