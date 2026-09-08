import { Vector3, Euler } from 'three';
export const AVATAR_POSITION = new Vector3(0, -1, 0);
export const AVATAR_ROTATION = new Euler(0.175, 0, 0);
export const AVATAR_POSITION_ZOOMED = new Vector3(0, -1.45, 0);
export const SCALE_LERP_FACTOR = 0.1;
export const MAX_IDLE_LOOPS_DEFAULT = 5;
export const MAPPING_EMOTIONS_ITALIAN_TO_ENGLISH = [
    {
        italian: 'Gioia',
        english: 'Joy',
    },
    {
        italian: 'Rabbia',
        english: 'Anger',
    },
    {
        italian: 'Sorpresa',
        english: 'Surprise',
    },
    {
        italian: 'Tristezza',
        english: 'Sadness',
    },
    {
        italian: 'Timore',
        english: 'Fear',
    },
];
export const MAPPING_BLEND_SHAPE_TO_EMOTION_RPM = [
    {
        emotion: { italian: 'Rabbia', english: 'Anger' },
        blendShapes: {
            'browDownLeft': 0.5,
            'browDownRight': 0.5,
            'browOuterUpLeft': 0.5,
            'browOuterUpRight': 0.5,
            'mouthSmileLeft': -0.2,
            'mouthSmileRight': -0.2,
        },
    },
    {
        emotion: { italian: 'Timore', english: 'Fear' },
        blendShapes: {
            'browOuterUpLeft': -0.5,
            'browOuterUpRight': -0.5,
            'eyeWideLeft': -0.5,
            'eyeWideRight': -0.5,
        },
    },
    {
        emotion: { italian: 'Tristezza', english: 'Sadness' },
        blendShapes: {
            'browDownLeft': -0.5,
            'browDownRight': -0.5,
            'eyeSquintLeft': 0.5,
            'eyeSquintRight': 0.5,
            'mouthSmileLeft': -0.6,
            'mouthSmileRight': -0.6,
        },
    },
    {
        emotion: { italian: 'Sorpresa', english: 'Surprise' },
        blendShapes: {
            'browInnerUp': 0.5,
            'browOuterUpLeft': 0.5,
            'browOuterUpRight': 0.5,
            'eyeWideLeft': 0.5,
            'eyeWideRight': 0.5,
            'mouthSmileLeft': 0.5,
            'mouthSmileRight': 0.5,
        },
    },
    {
        emotion: { italian: 'Gioia', english: 'Joy' },
        blendShapes: {
            'browDownLeft': 0.5,
            'browDownRight': 0.5,
            'browInnerUp': 0.5,
            'mouthSmileLeft': 0.5,
            'mouthSmileRight': 0.5,
        },
    },
];
export const ANIMATION_URLS = {
    MALE: 'https://assets.memori.ai/api/v2/asset/2c5e88a4-cf62-408b-9ef0-518b099dfcb2.glb',
    FEMALE: 'https://assets.memori.ai/api/v2/asset/2adc934b-24b2-45bd-94ad-ffec58d3cb32.glb',
};
export const MALE_EXCLUDED_ANIMATIONS = new Set([
    'Idle',
    'Idle2'
]);
export const BLINK_CONFIG = {
    minInterval: 1000,
    maxInterval: 5000,
    blinkDuration: 150,
};
export const DEFAULT_CONFIG = {
    fadeInDuration: 0.8,
    fadeOutDuration: 0.8,
    idleCount: 5,
    timeScale: 1.0,
};
export const EMOTION_SMOOTHING = 0.3;
export const VISEME_SMOOTHING = 0.5;
export const EMOTION_INTENSITY = 1.5;
//# sourceMappingURL=constants.js.map