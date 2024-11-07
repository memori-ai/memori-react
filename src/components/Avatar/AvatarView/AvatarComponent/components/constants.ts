import { Vector3, Euler } from 'three';
import { AnimationConfig } from './FullbodyAvatar/types';

export const AVATAR_POSITION = new Vector3(0, -1, 0);
export const AVATAR_ROTATION = new Euler(0.175, 0, 0);
export const AVATAR_POSITION_ZOOMED = new Vector3(0, -1.45, 0);
export const SCALE_LERP_FACTOR = 0.1;

export const ANIMATION_URLS = {
  MALE: 'https://assets.memori.ai/api/v2/asset/2c5e88a4-cf62-408b-9ef0-518b099dfcb2.glb',
  FEMALE:
    'https://assets.memori.ai/api/v2/asset/2adc934b-24b2-45bd-94ad-ffec58d3cb32.glb',
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
