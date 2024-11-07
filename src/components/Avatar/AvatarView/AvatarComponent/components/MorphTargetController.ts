import { SkinnedMesh } from 'three';
import { MathUtils } from 'three';
import { EMOTION_SMOOTHING, VISEME_SMOOTHING, BLINK_CONFIG } from './constants';

export class MorphTargetController {
  private headMesh: SkinnedMesh;
  private currentEmotionValues: Record<string, number> = {};
  private previousEmotionKeys: Set<string> = new Set();

  constructor(headMesh: SkinnedMesh) {
    this.headMesh = headMesh;
  }

  updateMorphTargets(
    currentTime: number,
    emotionMorphTargets: Record<string, number>,
    currentViseme: { name: string; weight: number } | null,
    eyeBlink: boolean,
    blinkState: {
      isBlinking: boolean;
      lastBlinkTime: number;
      nextBlinkTime: number;
      blinkStartTime: number;
    }
  ) {
    if (
      !this.headMesh.morphTargetDictionary ||
      !this.headMesh.morphTargetInfluences
    ) {
      return;
    }

    const blinkValue = this.calculateBlinkValue(
      currentTime,
      blinkState,
      eyeBlink
    );
    const currentEmotionKeys = new Set(Object.keys(emotionMorphTargets));

    Object.entries(this.headMesh.morphTargetDictionary).forEach(
      ([key, index]) => {
        if (typeof index !== 'number') return;

        let targetValue = 0;

        // Handle emotion morphs
        if (currentEmotionKeys.has(key)) {
          const targetEmotionValue = emotionMorphTargets[key];
          const currentEmotionValue = this.currentEmotionValues[key] || 0;
          const newEmotionValue = MathUtils.lerp(
            currentEmotionValue,
            targetEmotionValue * 2.5,
            EMOTION_SMOOTHING
          );
          this.currentEmotionValues[key] = newEmotionValue;
          targetValue += newEmotionValue;
        }

        // Handle viseme
        if (currentViseme && key === currentViseme.name) {
          targetValue += currentViseme.weight;
        }

        // Handle blinking
        if (key === 'eyesClosed' && eyeBlink) {
          targetValue += blinkValue;
        }

        // Apply final value
        targetValue = MathUtils.clamp(targetValue, 0, 1);
        if (this.headMesh.morphTargetInfluences) {
          this.headMesh.morphTargetInfluences[index] = MathUtils.lerp(
            this.headMesh.morphTargetInfluences[index] || 0,
            targetValue,
            VISEME_SMOOTHING
          );
        }
      }
    );

    this.previousEmotionKeys = currentEmotionKeys;
  }

  private calculateBlinkValue(
    currentTime: number,
    blinkState: {
      isBlinking: boolean;
      lastBlinkTime: number;
      nextBlinkTime: number;
      blinkStartTime: number;
    },
    eyeBlink: boolean
  ): number {
    if (!eyeBlink) return 0;

    let blinkValue = 0;

    if (currentTime >= blinkState.nextBlinkTime && !blinkState.isBlinking) {
      blinkState.isBlinking = true;
      blinkState.blinkStartTime = currentTime;
      blinkState.lastBlinkTime = currentTime;
      blinkState.nextBlinkTime =
        currentTime +
        Math.random() * (BLINK_CONFIG.maxInterval - BLINK_CONFIG.minInterval) +
        BLINK_CONFIG.minInterval;
    }

    if (blinkState.isBlinking) {
      const blinkProgress =
        (currentTime - blinkState.blinkStartTime) / BLINK_CONFIG.blinkDuration;
      if (blinkProgress <= 0.5) {
        blinkValue = blinkProgress * 2;
      } else if (blinkProgress <= 1) {
        blinkValue = 2 - blinkProgress * 2;
      } else {
        blinkState.isBlinking = false;
        blinkValue = 0;
      }
    }

    return blinkValue;
  }
}
