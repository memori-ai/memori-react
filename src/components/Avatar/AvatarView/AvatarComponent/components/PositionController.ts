import { Vector3, MathUtils } from 'three';
import { AVATAR_POSITION, AVATAR_POSITION_ZOOMED } from './constants';

export class AvatarPositionController {
  private currentScale: Vector3;
  private targetScale: Vector3;
  private currentPosition: Vector3;
  private basePosition: Vector3;
  private defaultPosition: Vector3;
  private zoomedPosition: Vector3;
  private initialCameraPosition: Vector3;

  constructor(
    defaultPosition: Vector3 = AVATAR_POSITION.clone(),
    zoomedPosition: Vector3 = AVATAR_POSITION_ZOOMED.clone(),
    initialCameraZ: number = 0.6
  ) {
    this.defaultPosition = defaultPosition;
    this.zoomedPosition = zoomedPosition;
    this.currentScale = new Vector3(1, 1, 1);
    this.targetScale = new Vector3(1, 1, 1);
    this.currentPosition = defaultPosition.clone();
    this.basePosition = defaultPosition.clone();
    this.initialCameraPosition = new Vector3(0, 0, initialCameraZ);
  }

  // Map height slider value (0 to 100) to scale (0.8 to 1.2)
  private mapHeightToScale(sliderValue: number, isHalfBody: boolean): number {
    // Convert slider value to scale factor
    if (isHalfBody) {
      return MathUtils.lerp(1.4, 2.1, sliderValue / 100);
    } else {
      return MathUtils.lerp(0.5, 1.5, sliderValue / 100);
    }
  }

  // Map depth slider value (0 to 100) to camera Z position
  private mapDepthToCamera(depthValue: number, isHalfBody: boolean): number {
    const baseZ = this.initialCameraPosition.z;
    if (isHalfBody) {
      return MathUtils.lerp(baseZ, baseZ + 3, depthValue / 100);
    } else {
      return MathUtils.lerp(baseZ, baseZ + 3, depthValue / 100);
    }
  }

  // Update height from GUI control (0-100)
  updateHeight(heightValue: number, isHalfBody: boolean): void {
    const heightScale = this.mapHeightToScale(heightValue, isHalfBody);
    this.targetScale.set(heightScale, heightScale, heightScale);
  }

  // Update depth and return new camera Z position
  updateDepth(depthValue: number, isHalfBody: boolean): number {
    return this.mapDepthToCamera(depthValue, isHalfBody);
  }

  // Update base position for zooming
  updateBasePosition(isZoomed: boolean): void {
    const newPosition = isZoomed ? this.zoomedPosition : this.defaultPosition;
    this.basePosition.copy(newPosition);
    this.currentPosition.copy(newPosition);
  }

  // Smoothly interpolate current scale to target scale
  updateScale(lerpFactor: number): Vector3 {
    this.currentScale.lerp(this.targetScale, lerpFactor);
    return this.currentScale;
  }

  // Get current position
  getPosition(): Vector3 {
    return this.currentPosition;
  }

  // Reset to default values
  reset(): void {
    this.currentScale.set(1, 1, 1);
    this.targetScale.set(1, 1, 1);
    this.currentPosition.copy(this.defaultPosition);
    this.basePosition.copy(this.defaultPosition);
  }
}