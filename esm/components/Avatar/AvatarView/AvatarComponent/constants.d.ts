import { Vector3, Euler } from 'three';
import { AnimationConfig } from './components/FullbodyAvatar/types';
export declare const AVATAR_POSITION: Vector3;
export declare const AVATAR_ROTATION: Euler;
export declare const AVATAR_POSITION_ZOOMED: Vector3;
export declare const SCALE_LERP_FACTOR = 0.1;
export declare const MAX_IDLE_LOOPS_DEFAULT = 5;
interface EmotionMappingItem {
    italian: string;
    english: string;
}
export type EmotionMapping = EmotionMappingItem[];
interface BlendShapeMapItem {
    emotion: {
        italian: string;
        english: string;
    };
    blendShapes: Record<string, number>;
}
export type BlendShapeMap = BlendShapeMapItem[];
export declare const MAPPING_EMOTIONS_ITALIAN_TO_ENGLISH: EmotionMapping;
export declare const MAPPING_BLEND_SHAPE_TO_EMOTION_RPM: BlendShapeMap;
export declare const ANIMATION_URLS: {
    MALE: string;
    FEMALE: string;
};
export declare const MALE_EXCLUDED_ANIMATIONS: Set<string>;
export declare const BLINK_CONFIG: {
    minInterval: number;
    maxInterval: number;
    blinkDuration: number;
};
export declare const DEFAULT_CONFIG: AnimationConfig;
export declare const EMOTION_SMOOTHING = 0.3;
export declare const VISEME_SMOOTHING = 0.5;
export declare const EMOTION_INTENSITY = 1.5;
export {};
