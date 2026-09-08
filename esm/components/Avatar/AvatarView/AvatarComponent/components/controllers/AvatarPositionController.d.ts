import { Vector3 } from 'three';
export declare class AvatarPositionController {
    private currentScale;
    private targetScale;
    private currentPosition;
    private basePosition;
    private defaultPosition;
    private zoomedPosition;
    private initialCameraPosition;
    constructor(defaultPosition?: Vector3, zoomedPosition?: Vector3, initialCameraZ?: number);
    private mapHeightToScale;
    private mapDepthToCamera;
    updateHeight(heightValue: number, isHalfBody: boolean): void;
    updateDepth(depthValue: number, isHalfBody: boolean): number;
    updateBasePosition(isZoomed: boolean): void;
    updateScale(lerpFactor: number): Vector3;
    getPosition(): Vector3;
    reset(): void;
}
