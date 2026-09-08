import React from 'react';
import { IAudioContext } from 'standardized-audio-context';
type Viseme = {
    name: string;
    weight: number;
    startTime: number;
    endTime: number;
};
interface VisemeContextType {
    addViseme: (visemeId: number, audioOffset: number) => void;
    updateCurrentViseme: (currentTime: number) => Viseme | null;
    startProcessing: (audioCtx: IAudioContext) => void;
    stopProcessing: () => void;
    resetAndStartProcessing: (audioCtx: IAudioContext) => void;
    resetVisemeQueue: () => void;
    isProcessing: boolean;
    setAudioContext: (ctx: IAudioContext) => void;
}
export declare const DEFAULT_VISEME_DURATION: 0.12, VISEME_OVERLAP: 0.02, SMOOTHING_FACTOR: 0.4, LOG_INTERVAL: 60, PRELOAD: 0.2, WEIGHT_MULTIPLIER: 0.8;
export declare const VisemeProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useViseme: () => VisemeContextType;
export {};
