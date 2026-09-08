import React from 'react';
import { SkinnedMesh } from 'three';
interface Viseme {
    name: string;
    duration: number;
    weight: number;
    startTime: number;
}
interface UseMouthAnimationProps {
    currentVisemes: Viseme[];
    avatarMeshRef: React.RefObject<SkinnedMesh>;
}
export declare function useMouthAnimation({ currentVisemes, avatarMeshRef }: UseMouthAnimationProps): {
    handleMouthMovement: (elapsedTime: number) => void;
};
export {};
